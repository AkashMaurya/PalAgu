import express, { Router } from 'express';
import bcrypt from 'bcryptjs';
import xlsx from 'xlsx';
import multer from 'multer';
import { getAll, getOne, runQuery } from '../database';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all users (Admin only)
router.get('/', authenticateToken, requireRole('Admin'), async (req: AuthRequest, res) => {
  try {
    const { role, search } = req.query;
    let sql = 'SELECT id, email, firstName, lastName, role, studentId, createdAt FROM User WHERE 1=1';
    const params: any[] = [];

    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      sql += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR studentId LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    sql += ' ORDER BY createdAt DESC';

    const users = await getAll(sql, params);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await getOne(
      'SELECT id, email, firstName, lastName, role, studentId, createdAt FROM User WHERE id = ?',
      [req.params.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check permission
    if (req.user!.role !== 'Admin' && req.user!.id !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error fetching user' });
  }
});

// Create user (Admin only)
router.post('/', authenticateToken, requireRole('Admin'), async (req: AuthRequest, res) => {
  try {
    const { email, password, firstName, lastName, role, studentId } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await getOne('SELECT id FROM User WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await runQuery(
      'INSERT INTO User (email, password, firstName, lastName, role, studentId) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, role, studentId || null]
    );

    res.status(201).json({
      id: result.lastID,
      email,
      firstName,
      lastName,
      role,
      studentId
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error creating user' });
  }
});

// Update user (Admin only)
router.put('/:id', authenticateToken, requireRole('Admin'), async (req: AuthRequest, res) => {
  try {
    const { email, firstName, lastName, role, studentId } = req.body;

    const user = await getOne('SELECT id FROM User WHERE id = ?', [req.params.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await runQuery(
      'UPDATE User SET email = ?, firstName = ?, lastName = ?, role = ?, studentId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [email, firstName, lastName, role, studentId || null, req.params.id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error updating user' });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, requireRole('Admin'), async (req: AuthRequest, res) => {
  try {
    const user = await getOne('SELECT id FROM User WHERE id = ?', [req.params.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await runQuery('DELETE FROM User WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error deleting user' });
  }
});

// Bulk upload users via XLSX (Admin only)
router.post('/bulk-upload', authenticateToken, requireRole('Admin'), upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    let successCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    for (const row of data as any[]) {
      try {
        const { email, password, firstName, lastName, role, studentId } = row;

        if (!email || !password || !firstName || !lastName || !role) {
          errors.push({ row, error: 'Missing required fields' });
          errorCount++;
          continue;
        }

        const existingUser = await getOne('SELECT id FROM User WHERE email = ?', [email]);
        if (existingUser) {
          errors.push({ row, error: 'Email already exists' });
          errorCount++;
          continue;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await runQuery(
          'INSERT INTO User (email, password, firstName, lastName, role, studentId) VALUES (?, ?, ?, ?, ?, ?)',
          [email, hashedPassword, firstName, lastName, role, studentId || null]
        );

        successCount++;
      } catch (error) {
        errors.push({ row, error: (error as Error).message });
        errorCount++;
      }
    }

    res.json({
      message: 'Bulk upload completed',
      successCount,
      errorCount,
      errors: errorCount > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Server error during bulk upload' });
  }
});

export default router;
