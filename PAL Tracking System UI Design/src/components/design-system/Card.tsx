import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-[var(--color-surface)] border border-[var(--color-border)]',
    bordered: 'bg-[var(--color-surface)] border-2 border-[var(--color-border-strong)]',
    elevated: 'bg-[var(--color-surface)] shadow-[var(--shadow-md)]',
  };
  
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div
      className={`rounded-[var(--radius-lg)] ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  description,
  action,
  className = '',
  ...props
}: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between ${className}`} {...props}>
      <div>
        <h3 className="text-[var(--color-text-primary)]">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
