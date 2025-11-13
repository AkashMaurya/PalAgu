import React, { useState } from 'react';
import { Table, Column } from '../design-system/Table';
import { Badge } from '../design-system/Badge';
import { Button } from '../design-system/Button';
import { Input } from '../design-system/Input';
import { Select } from '../design-system/Select';
import { Card } from '../design-system/Card';
import { Search, Filter, MoreVertical, UserPlus, Download } from 'lucide-react';

export function AdminUsers() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const users = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@university.edu',
      role: 'Tutor',
      program: 'Computer Science',
      year: 'Year 3',
      status: 'Active',
      sessions: 45,
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.c@university.edu',
      role: 'Student',
      program: 'Mathematics',
      year: 'Year 2',
      status: 'Active',
      sessions: 12,
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.d@university.edu',
      role: 'Tutor',
      program: 'Engineering',
      year: 'Year 4',
      status: 'Active',
      sessions: 38,
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'james.w@university.edu',
      role: 'Student',
      program: 'Business',
      year: 'Year 1',
      status: 'Inactive',
      sessions: 3,
    },
    {
      id: '5',
      name: 'Olivia Brown',
      email: 'olivia.b@university.edu',
      role: 'Admin',
      program: 'N/A',
      year: 'N/A',
      status: 'Active',
      sessions: 0,
    },
  ];

  const columns: Column<typeof users[0]>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-[var(--color-text-primary)]">{row.name}</p>
          <p className="text-xs text-[var(--color-text-tertiary)]">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (row) => (
        <Badge
          variant={
            row.role === 'Admin'
              ? 'error'
              : row.role === 'Tutor'
              ? 'primary'
              : 'neutral'
          }
        >
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'program',
      label: 'Program',
      sortable: true,
    },
    {
      key: 'year',
      label: 'Year',
      sortable: true,
    },
    {
      key: 'sessions',
      label: 'Sessions',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button className="p-2 hover:bg-[var(--color-surface-hover)] rounded-[var(--radius-base)] transition-colors">
          <MoreVertical className="w-4 h-4 text-[var(--color-text-tertiary)]" />
        </button>
      ),
    },
  ];

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === users.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(users.map((u) => u.id)));
    }
  };

  return (
    <div className="grid-container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[var(--color-text-primary)] mb-2">User Management</h1>
          <p className="text-[var(--color-text-secondary)]">
            Manage all users in the PAL system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button icon={<UserPlus className="w-4 h-4" />}>
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card variant="elevated" padding="md" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Select
            placeholder="Filter by role"
            options={[
              { value: '', label: 'All Roles' },
              { value: 'student', label: 'Student' },
              { value: 'tutor', label: 'Tutor' },
              { value: 'admin', label: 'Admin' },
            ]}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          />
          <Select
            placeholder="Filter by status"
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            More Filters
          </Button>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedRows.size > 0 && (
        <Card variant="bordered" padding="sm" className="mb-4 border-[var(--color-primary-600)]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--color-text-primary)]">
              {selectedRows.size} user{selectedRows.size > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Activate
              </Button>
              <Button variant="outline" size="sm">
                Deactivate
              </Button>
              <Button variant="danger" size="sm">
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={users}
        selectable
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
