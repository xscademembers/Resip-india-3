import React, { Suspense, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  Boxes,
  Star,
  Image,
  Megaphone,
  Settings as SettingsIcon,
  Menu,
  X,
  ExternalLink,
  LogOut,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEOHead from '../../components/SEOHead';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package, end: false },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart, end: false },
  { to: '/admin/customers', label: 'Customers', icon: Users, end: false },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket, end: false },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes, end: false },
  { to: '/admin/reviews', label: 'Reviews', icon: Star, end: false },
  { to: '/admin/banners', label: 'Banners', icon: Image, end: false },
  { to: '/admin/impact', label: 'Impact', icon: Leaf, end: false },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone, end: false },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon, end: false },
];

const RouteFallback = () => (
  <div className="flex items-center justify-center py-32">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
  </div>
);

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg">
      <SEOHead title="Admin" noindex />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-brand-blue/10 bg-white transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-brand-blue/10 px-6">
          <Link to="/admin" className="font-display text-xl font-bold text-brand-blue">
            ReSip Admin
          </Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-brand-blue text-white' : 'text-charcoal/70 hover:bg-brand-blue/5'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-brand-blue/10 p-4">
          <Link
            to="/"
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-charcoal/70 hover:bg-brand-blue/5"
          >
            <ExternalLink size={18} /> View Store
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} aria-hidden />
      )}

      {/* Main */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-brand-blue/10 bg-white/90 px-4 backdrop-blur-md md:px-8">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div className="ml-auto text-right">
            <p className="text-sm font-bold text-charcoal">{user?.name}</p>
            <p className="text-xs text-charcoal/50">Administrator</p>
          </div>
        </header>
        <main className="p-4 md:p-8">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
