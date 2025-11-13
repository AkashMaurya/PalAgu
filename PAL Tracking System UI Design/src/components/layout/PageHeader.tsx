import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="grid-container py-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)] transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-[var(--color-text-primary)]">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[var(--color-text-primary)]">{title}</h1>
            {description && (
              <p className="mt-2 text-[var(--color-text-secondary)]">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
