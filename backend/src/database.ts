import sqlite3 from 'sqlite3';
import path from 'path';

const DATABASE_PATH = process.env.DATABASE_PATH || './database.sqlite';

// Create database connection
export const db = new sqlite3.Database(DATABASE_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    // User table (authentication with roles)
    db.run(`
      CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('Admin', 'Manager', 'Student', 'Tutor')),
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        studentId TEXT UNIQUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Program table (MD, Nursing)
    db.run(`
      CREATE TABLE IF NOT EXISTS Program (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        code TEXT UNIQUE NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Year table (1-6 for MD, 1-4 for Nursing)
    db.run(`
      CREATE TABLE IF NOT EXISTS Year (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        programId INTEGER NOT NULL,
        yearNumber INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (programId) REFERENCES Program(id),
        UNIQUE(programId, yearNumber)
      )
    `);

    // Course/Topic table
    db.run(`
      CREATE TABLE IF NOT EXISTS Course (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        programId INTEGER NOT NULL,
        yearId INTEGER NOT NULL,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (programId) REFERENCES Program(id),
        FOREIGN KEY (yearId) REFERENCES Year(id),
        UNIQUE(code, programId, yearId)
      )
    `);

    // Student table
    db.run(`
      CREATE TABLE IF NOT EXISTS Student (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER UNIQUE NOT NULL,
        programId INTEGER NOT NULL,
        yearId INTEGER NOT NULL,
        gpa REAL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id),
        FOREIGN KEY (programId) REFERENCES Program(id),
        FOREIGN KEY (yearId) REFERENCES Year(id)
      )
    `);

    // TutorApplication table (registration data)
    db.run(`
      CREATE TABLE IF NOT EXISTS TutorApplication (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        programId INTEGER NOT NULL,
        yearId INTEGER NOT NULL,
        gpa REAL,
        status TEXT NOT NULL CHECK(status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
        trainingCompleted BOOLEAN DEFAULT 0,
        certificationUrl TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id),
        FOREIGN KEY (programId) REFERENCES Program(id),
        FOREIGN KEY (yearId) REFERENCES Year(id)
      )
    `);

    // TutorCourse table (many-to-many for tutor expertise)
    db.run(`
      CREATE TABLE IF NOT EXISTS TutorCourse (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tutorApplicationId INTEGER NOT NULL,
        courseId INTEGER NOT NULL,
        FOREIGN KEY (tutorApplicationId) REFERENCES TutorApplication(id),
        FOREIGN KEY (courseId) REFERENCES Course(id),
        UNIQUE(tutorApplicationId, courseId)
      )
    `);

    // Session table (tutor-learner pairs)
    db.run(`
      CREATE TABLE IF NOT EXISTS Session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tutorId INTEGER NOT NULL,
        learnerId INTEGER NOT NULL,
        courseId INTEGER NOT NULL,
        sessionDate DATETIME NOT NULL,
        duration INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('Scheduled', 'Completed', 'Cancelled')) DEFAULT 'Scheduled',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tutorId) REFERENCES User(id),
        FOREIGN KEY (learnerId) REFERENCES User(id),
        FOREIGN KEY (courseId) REFERENCES Course(id)
      )
    `);

    // Feedback table (session ratings)
    db.run(`
      CREATE TABLE IF NOT EXISTS Feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionId INTEGER UNIQUE NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        satisfaction INTEGER CHECK(satisfaction >= 1 AND satisfaction <= 5),
        helpfulness INTEGER CHECK(helpfulness >= 1 AND helpfulness <= 5),
        comments TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sessionId) REFERENCES Session(id)
      )
    `);

    // Config table (admin settings)
    db.run(`
      CREATE TABLE IF NOT EXISTS Config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin user and initial data
    db.run(`
      INSERT OR IGNORE INTO User (email, password, role, firstName, lastName, studentId) 
      VALUES ('admin@agu.edu', '$2a$10$K.h7lJMiH6oQrX9JmvvZheE8n6QvH9RtYHn0N5xNz7aLqNxXlhYAy', 'Admin', 'System', 'Administrator', 'ADMIN001')
    `, (err) => {
      if (!err) {
        console.log('Default admin user created (password: admin123)');
      }
    });

    // Insert programs
    db.run(`INSERT OR IGNORE INTO Program (name, code, description) VALUES ('Medicine', 'MD', 'Doctor of Medicine Program')`);
    db.run(`INSERT OR IGNORE INTO Program (name, code, description) VALUES ('Nursing', 'NS', 'Bachelor of Nursing Program')`);

    // Insert years for MD (1-6)
    for (let i = 1; i <= 6; i++) {
      db.run(`INSERT OR IGNORE INTO Year (programId, yearNumber, name) SELECT id, ${i}, 'Year ${i}' FROM Program WHERE code = 'MD'`);
    }

    // Insert years for Nursing (1-4)
    for (let i = 1; i <= 4; i++) {
      db.run(`INSERT OR IGNORE INTO Year (programId, yearNumber, name) SELECT id, ${i}, 'Year ${i}' FROM Program WHERE code = 'NS'`);
    }

    // Insert default config
    db.run(`INSERT OR IGNORE INTO Config (key, value, description) VALUES ('maxCourseSelections', '3', 'Maximum number of courses a student can select')`);
    db.run(`INSERT OR IGNORE INTO Config (key, value, description) VALUES ('minGpaForTutor', '3.0', 'Minimum GPA required to become a tutor')`);

    console.log('Database schema initialized successfully');
  });
}

// Helper function to run queries with promises
export function runQuery(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// Helper function to get single row
export function getOne(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Helper function to get all rows
export function getAll(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}
