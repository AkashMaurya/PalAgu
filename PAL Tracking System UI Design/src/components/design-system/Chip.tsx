import React from 'react';
import { X } from 'lucide-react';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  selected?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export function Chip({
  label,
  selected = false,
  onRemove,
  icon,
  className = '',
  ...props
}: ChipProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200 cursor-pointer select-none';
  const stateStyles = selected
    ? 'bg-[var(--color-primary-600)] text-white'
    : 'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-tertiary)] border border-[var(--color-border)]';
  
  return (
    <div
      className={`${baseStyles} ${stateStyles} ${className}`}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
