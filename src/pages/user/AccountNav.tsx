import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/orders', label: 'My Orders', icon: Package, end: false },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin, end: false },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart, end: false },
];

export default function AccountNav() {
  const { logout, user } = useAuth();

  return (
    <nav aria-label="Account navigation" className="rounded-2xl border border-brand-blue/10 bg-white p-4 shadow-sm">
      <div className="mb-4 border-b border-brand-blue/10 px-2 pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal/40">Signed in as</p>
        <p className="mt-1 truncate font-display text-lg font-bold text-brand-blue">{user?.name}</p>
        <p className="truncate text-xs text-charcoal/50">{user?.email}</p>
      </div>
      <ul className="space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-brand-blue text-white' : 'text-charcoal/70 hover:bg-brand-blue/5'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
}
