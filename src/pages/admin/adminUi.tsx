import React from 'react';
import { X } from 'lucide-react';

export const AdminHeading: React.FC<{ title: string; action?: React.ReactNode; subtitle?: string }> = ({
  title,
  action,
  subtitle,
}) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-brand-blue md:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-charcoal/50">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm ${className}`}>{children}</div>
);

export const StatCard: React.FC<{ label: string; value: React.ReactNode; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="rounded-2xl border border-brand-blue/10 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal/40">{label}</p>
      {icon && <span className="text-brand-blue/40">{icon}</span>}
    </div>
    <p className="mt-2 font-display text-2xl font-bold text-brand-blue">{value}</p>
  </div>
);

/** Simple responsive table shell. */
export const Table: React.FC<{ head: React.ReactNode; children: React.ReactNode }> = ({ head, children }) => (
  <div className="overflow-x-auto rounded-2xl border border-brand-blue/10 bg-white shadow-sm">
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead className="border-b border-brand-blue/10 bg-brand-bg text-xs font-bold uppercase tracking-wider text-charcoal/50">
        {head}
      </thead>
      <tbody className="divide-y divide-brand-blue/5">{children}</tbody>
    </table>
  </div>
);

export const Th: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th className={`px-4 py-3 ${className}`}>{children}</th>
);

export const Td: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>
);

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-brand-blue">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 hover:bg-brand-blue/5">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="mb-3 block">
    <span className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-charcoal/60">{label}</span>
    {children}
  </label>
);

export const inputClass =
  'w-full rounded-xl border border-brand-blue/15 bg-brand-bg px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20';

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-gold disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);
