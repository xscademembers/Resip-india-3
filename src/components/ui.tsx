import React from 'react';
import { Link } from 'react-router-dom';

/** Page wrapper that clears the fixed header and applies the 8px-grid spacing. */
export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`mx-auto w-full max-w-7xl px-6 pb-24 pt-32 md:pt-40 ${className}`}>{children}</div>
);

/** Centered card layout used by auth pages. */
export const AuthShell: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, subtitle, children, footer }) => (
  <section className="flex min-h-screen items-center justify-center px-6 pb-16 pt-32 md:pt-36">
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-brand-blue/10 bg-white p-8 shadow-xl md:p-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue">{title}</h1>
        {subtitle && <p className="mt-2 text-sm font-light text-charcoal/60">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
      {footer && <div className="mt-6 text-center text-sm text-charcoal/60">{footer}</div>}
    </div>
  </section>
);

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const TextField: React.FC<TextFieldProps> = ({ label, id, ...props }) => (
  <div className="mb-4">
    <label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-charcoal/60">
      {label}
    </label>
    <input
      id={id}
      className="w-full rounded-xl border border-brand-blue/15 bg-brand-bg px-4 py-3 text-charcoal transition-colors focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
      {...props}
    />
  </div>
);

export const SubmitButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
> = ({ children, loading, disabled, className = '', ...props }) => (
  <button
    {...props}
    disabled={loading || disabled}
    className={`flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
  >
    {loading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
    )}
    {children}
  </button>
);

export const TextLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="font-semibold text-brand-blue underline-offset-4 hover:underline">
    {children}
  </Link>
);

/** Generic empty/error state. */
export const EmptyState: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ title, description, action, icon }) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-brand-blue/20 bg-white/60 px-6 py-20 text-center">
    {icon && <div className="mb-4 text-brand-blue/40">{icon}</div>}
    <h2 className="font-display text-2xl font-bold text-brand-blue">{title}</h2>
    {description && <p className="mt-2 max-w-md text-sm font-light text-charcoal/60">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
  </div>
);

/** Display INR amounts consistently. */
export const inr = (amount: number) => `₹${(amount || 0).toLocaleString('en-IN')}`;
