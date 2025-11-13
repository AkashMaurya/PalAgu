import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  getRowId?: (row: T) => string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  selectable,
  selectedRows,
  onSelectRow,
  onSelectAll,
  getRowId,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
      <table className="w-full">
        <thead className="bg-[var(--color-background-secondary)] sticky top-0">
          <tr>
            {selectable && (
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={data.length > 0 && selectedRows?.size === data.length}
                  className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-100)]"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm text-[var(--color-text-secondary)] border-b border-[var(--color-border)]"
              >
                {column.sortable ? (
                  <button
                    onClick={() => onSort?.(column.key)}
                    className="flex items-center gap-2 hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    {column.label}
                    {sortKey === column.key && (
                      <>
                        {sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--color-surface)]">
          {data.map((row, index) => {
            const rowId = getRowId ? getRowId(row) : index.toString();
            const isSelected = selectedRows?.has(rowId);
            
            return (
              <tr
                key={rowId}
                className={`border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors ${
                  isSelected ? 'bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20' : ''
                }`}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectRow?.(rowId)}
                      className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-100)]"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-12 text-center text-sm text-[var(--color-text-secondary)]">
          No data available
        </div>
      )}
    </div>
  );
}
