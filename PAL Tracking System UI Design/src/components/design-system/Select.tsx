import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export function Select({
  label,
  helperText,
  error,
  options,
  placeholder,
  required,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  const baseStyles = 'w-full h-10 px-3 pr-10 rounded-[var(--radius-base)] border transition-all duration-200 bg-[var(--color-surface)] text-[var(--color-text-primary)] appearance-none cursor-pointer';
  const stateStyles = hasError
    ? 'border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-2 focus:ring-[var(--color-error-100)]'
    : 'border-[var(--color-border)] focus:border-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-100)]';
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block mb-2 text-sm text-[var(--color-text-primary)]"
        >
          {label}
          {required && <span className="ml-1 text-[var(--color-error-500)]">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`${baseStyles} ${stateStyles} focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {hasError ? (
            <AlertCircle className="w-4 h-4 text-[var(--color-error-500)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--color-text-tertiary)]" />
          )}
        </div>
      </div>
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]">{helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-[var(--color-error-500)]">{error}</p>
      )}
    </div>
  );
}
