import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export function Checkbox({
  label,
  description,
  error,
  id,
  className = '',
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  return (
    <div className={`${className}`}>
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={checkboxId}
            className="peer w-5 h-5 appearance-none border-2 rounded-[var(--radius-sm)] border-[var(--color-border)] transition-all duration-200 cursor-pointer checked:bg-[var(--color-primary-600)] checked:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)] disabled:opacity-50 disabled:cursor-not-allowed"
            {...props}
          />
          <Check className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {(label || description) && (
          <div className="flex-1 pt-0.5">
            {label && (
              <label
                htmlFor={checkboxId}
                className="block text-sm text-[var(--color-text-primary)] cursor-pointer select-none"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{description}</p>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[var(--color-error-500)] ml-8">{error}</p>
      )}
    </div>
  );
}
