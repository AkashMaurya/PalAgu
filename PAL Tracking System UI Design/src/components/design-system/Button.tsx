import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] active:bg-[var(--color-primary-800)] focus:ring-[var(--color-primary-600)]',
    secondary: 'bg-[var(--color-secondary-500)] text-white hover:bg-[var(--color-secondary-600)] active:bg-[var(--color-secondary-700)] focus:ring-[var(--color-secondary-500)]',
    outline: 'border-2 border-[var(--color-border-strong)] text-[var(--color-text-primary)] bg-transparent hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-background-tertiary)] focus:ring-[var(--color-primary-600)]',
    ghost: 'text-[var(--color-text-primary)] bg-transparent hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-background-tertiary)] focus:ring-[var(--color-primary-600)]',
    danger: 'bg-[var(--color-error-500)] text-white hover:bg-[var(--color-error-600)] active:bg-[var(--color-error-600)] focus:ring-[var(--color-error-500)]',
    success: 'bg-[var(--color-success-500)] text-white hover:bg-[var(--color-success-600)] active:bg-[var(--color-success-600)] focus:ring-[var(--color-success-500)]',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm rounded-[var(--radius-base)]',
    md: 'h-10 px-4 text-base rounded-[var(--radius-md)]',
    lg: 'h-12 px-6 text-base rounded-[var(--radius-md)]',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
}
