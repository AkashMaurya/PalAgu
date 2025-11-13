import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
}

export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
  ...props
}: AlertProps) {
  const variants = {
    info: {
      bg: 'bg-[var(--color-info-50)] dark:bg-[var(--color-info-900)]',
      border: 'border-[var(--color-info-200)] dark:border-[var(--color-info-700)]',
      icon: <Info className="w-5 h-5 text-[var(--color-info-600)]" />,
      titleColor: 'text-[var(--color-info-900)] dark:text-[var(--color-info-100)]',
      textColor: 'text-[var(--color-info-800)] dark:text-[var(--color-info-200)]',
    },
    success: {
      bg: 'bg-[var(--color-success-50)] dark:bg-[var(--color-success-900)]',
      border: 'border-[var(--color-success-200)] dark:border-[var(--color-success-700)]',
      icon: <CheckCircle className="w-5 h-5 text-[var(--color-success-600)]" />,
      titleColor: 'text-[var(--color-success-900)] dark:text-[var(--color-success-100)]',
      textColor: 'text-[var(--color-success-800)] dark:text-[var(--color-success-200)]',
    },
    warning: {
      bg: 'bg-[var(--color-warning-50)] dark:bg-[var(--color-warning-900)]',
      border: 'border-[var(--color-warning-200)] dark:border-[var(--color-warning-700)]',
      icon: <AlertTriangle className="w-5 h-5 text-[var(--color-warning-600)]" />,
      titleColor: 'text-[var(--color-warning-900)] dark:text-[var(--color-warning-100)]',
      textColor: 'text-[var(--color-warning-800)] dark:text-[var(--color-warning-200)]',
    },
    error: {
      bg: 'bg-[var(--color-error-50)] dark:bg-[var(--color-error-900)]',
      border: 'border-[var(--color-error-200)] dark:border-[var(--color-error-700)]',
      icon: <AlertCircle className="w-5 h-5 text-[var(--color-error-600)]" />,
      titleColor: 'text-[var(--color-error-900)] dark:text-[var(--color-error-100)]',
      textColor: 'text-[var(--color-error-800)] dark:text-[var(--color-error-200)]',
    },
  };
  
  const config = variants[variant];
  
  return (
    <div
      className={`flex gap-3 p-4 rounded-[var(--radius-md)] border ${config.bg} ${config.border} ${className}`}
      {...props}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1">
        {title && (
          <h4 className={`text-sm mb-1 ${config.titleColor}`}>{title}</h4>
        )}
        <div className={`text-sm ${config.textColor}`}>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
