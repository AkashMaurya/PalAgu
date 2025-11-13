import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export function Input({
  label,
  helperText,
  error,
  success,
  icon,
  required,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  
  const baseStyles = 'w-full h-10 px-3 rounded-[var(--radius-base)] border transition-all duration-200 bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]';
  const stateStyles = hasError
    ? 'border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-2 focus:ring-[var(--color-error-100)]'
    : hasSuccess
    ? 'border-[var(--color-success-500)] focus:border-[var(--color-success-500)] focus:ring-2 focus:ring-[var(--color-success-100)]'
    : 'border-[var(--color-border)] focus:border-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-100)]';
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-2 text-sm text-[var(--color-text-primary)]"
        >
          {label}
          {required && <span className="ml-1 text-[var(--color-error-500)]">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`${baseStyles} ${stateStyles} ${icon ? 'pl-10' : ''} focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
          {...props}
        />
        {(hasError || hasSuccess) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError && <AlertCircle className="w-4 h-4 text-[var(--color-error-500)]" />}
            {hasSuccess && <CheckCircle className="w-4 h-4 text-[var(--color-success-500)]" />}
          </div>
        )}
      </div>
      {helperText && !error && !success && (
        <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]">{helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-[var(--color-error-500)] flex items-center gap-1">
          {error}
        </p>
      )}
      {success && !error && (
        <p className="mt-1.5 text-xs text-[var(--color-success-500)] flex items-center gap-1">
          {success}
        </p>
      )}
    </div>
  );
}
