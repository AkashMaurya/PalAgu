import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  showCount?: boolean;
}

export function Textarea({
  label,
  helperText,
  error,
  showCount,
  maxLength,
  required,
  className = '',
  id,
  value,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  const baseStyles = 'w-full px-3 py-2 rounded-[var(--radius-base)] border transition-all duration-200 bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] resize-vertical min-h-[80px]';
  const stateStyles = hasError
    ? 'border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:ring-2 focus:ring-[var(--color-error-100)]'
    : 'border-[var(--color-border)] focus:border-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-100)]';
  
  const currentLength = value?.toString().length || 0;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm text-[var(--color-text-primary)]"
          >
            {label}
            {required && <span className="ml-1 text-[var(--color-error-500)]">*</span>}
          </label>
        )}
        {showCount && maxLength && (
          <span className="text-xs text-[var(--color-text-tertiary)]">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={textareaId}
        maxLength={maxLength}
        value={value}
        className={`${baseStyles} ${stateStyles} focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]">{helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-[var(--color-error-500)] flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
