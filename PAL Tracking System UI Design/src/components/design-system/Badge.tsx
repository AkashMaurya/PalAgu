import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  const variants = {
    primary: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)] dark:text-[var(--color-primary-200)]',
    secondary: 'bg-[var(--color-secondary-100)] text-[var(--color-secondary-700)] dark:bg-[var(--color-secondary-900)] dark:text-[var(--color-secondary-200)]',
    success: 'bg-[var(--color-success-100)] text-[var(--color-success-600)] dark:bg-[var(--color-success-600)] dark:text-white',
    warning: 'bg-[var(--color-warning-100)] text-[var(--color-warning-600)] dark:bg-[var(--color-warning-600)] dark:text-white',
    error: 'bg-[var(--color-error-100)] text-[var(--color-error-600)] dark:bg-[var(--color-error-600)] dark:text-white',
    info: 'bg-[var(--color-info-100)] text-[var(--color-info-600)] dark:bg-[var(--color-info-600)] dark:text-white',
    neutral: 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] dark:bg-[var(--color-neutral-700)] dark:text-[var(--color-neutral-200)]',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  return (
    <span
      className={`inline-flex items-center rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
