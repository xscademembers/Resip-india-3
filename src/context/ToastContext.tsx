import React, { createContext, useContext, useCallback } from 'react';
import toast, { Toaster, type ToastOptions } from 'react-hot-toast';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  notify: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const baseOptions: ToastOptions = {
  duration: 3500,
  style: {
    borderRadius: '12px',
    background: 'var(--color-brand-blue, #0047ab)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '14px',
    padding: '12px 16px',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = useCallback((message: string, variant: ToastVariant = 'info') => {
    switch (variant) {
      case 'success':
        toast.success(message, baseOptions);
        break;
      case 'error':
        toast.error(message, { ...baseOptions, style: { ...baseOptions.style, background: '#dc3545' } });
        break;
      case 'warning':
        toast(message, { ...baseOptions, icon: '⚠️', style: { ...baseOptions.style, background: 'var(--color-brand-gold, #d1aa05)', color: '#1a1a1a' } });
        break;
      default:
        toast(message, baseOptions);
    }
  }, []);

  const value: ToastContextValue = {
    notify,
    success: (m) => notify(m, 'success'),
    error: (m) => notify(m, 'error'),
    info: (m) => notify(m, 'info'),
    warning: (m) => notify(m, 'warning'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster position="top-center" gutter={8} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
