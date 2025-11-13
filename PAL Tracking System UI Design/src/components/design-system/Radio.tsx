import React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export function Radio({
  label,
  description,
  id,
  className = '',
  ...props
}: RadioProps) {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`${className}`}>
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="radio"
            id={radioId}
            className="peer w-5 h-5 appearance-none border-2 rounded-full border-[var(--color-border)] transition-all duration-200 cursor-pointer checked:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)] disabled:opacity-50 disabled:cursor-not-allowed"
            {...props}
          />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--color-primary-600)] pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        <div className="flex-1 pt-0.5">
          <label
            htmlFor={radioId}
            className="block text-sm text-[var(--color-text-primary)] cursor-pointer select-none"
          >
            {label}
          </label>
          {description && (
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export interface RadioGroupProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({
  label,
  error,
  required,
  children,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block mb-3 text-sm text-[var(--color-text-primary)]">
          {label}
          {required && <span className="ml-1 text-[var(--color-error-500)]">*</span>}
        </label>
      )}
      <div className="space-y-3">
        {children}
      </div>
      {error && (
        <p className="mt-2 text-xs text-[var(--color-error-500)]">{error}</p>
      )}
    </div>
  );
}
