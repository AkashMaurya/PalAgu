import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const variants = {
    success: {
      bg: 'bg-white dark:bg-[var(--color-neutral-800)] border-[var(--color-success-500)]',
      icon: <CheckCircle className="w-5 h-5 text-[var(--color-success-500)]" />,
    },
    error: {
      bg: 'bg-white dark:bg-[var(--color-neutral-800)] border-[var(--color-error-500)]',
      icon: <AlertCircle className="w-5 h-5 text-[var(--color-error-500)]" />,
    },
    info: {
      bg: 'bg-white dark:bg-[var(--color-neutral-800)] border-[var(--color-info-500)]',
      icon: <Info className="w-5 h-5 text-[var(--color-info-500)]" />,
    },
  };

  const config = variants[toast.variant];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] border-l-4 ${config.bg} animate-slide-in`}
    >
      {config.icon}
      <div className="flex-1">
        <h4 className="text-sm text-[var(--color-text-primary)]">{toast.title}</h4>
        {toast.description && (
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
