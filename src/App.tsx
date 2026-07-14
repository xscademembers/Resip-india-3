import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { SiteHeader, Footer } from './components';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute } from './components/RouteGuards';

// Lazy-load route-level pages for code-splitting.
// Only the Home page is eagerly loaded (it's the landing page).
import Home from './Home';
const Shop = lazy(() => import('./Shop'));
const ProductDetail = lazy(() => import('./ProductDetail'));
const About = lazy(() => import('./About'));
const Gallery = lazy(() => import('./Gallery'));
const Contact = lazy(() => import('./CustomOrders'));
const ReturnExchangePolicy = lazy(() => import('./ReturnExchangePolicy'));
const CareInstructions = lazy(() => import('./CareInstructions'));
const ShippingPolicy = lazy(() => import('./ShippingPolicy'));
const Faqs = lazy(() => import('./Faqs'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));

// Checkout pages
const CartPage = lazy(() => import('./pages/checkout/Cart'));
const Checkout = lazy(() => import('./pages/checkout/Checkout'));
const PaymentSuccess = lazy(() => import('./pages/checkout/PaymentSuccess'));
const PaymentFailed = lazy(() => import('./pages/checkout/PaymentFailed'));
const PaymentPending = lazy(() => import('./pages/checkout/PaymentPending'));

// User account pages
const Profile = lazy(() => import('./pages/user/Profile'));
const OrderHistory = lazy(() => import('./pages/user/OrderHistory'));
const OrderDetail = lazy(() => import('./pages/user/OrderDetail'));
const Addresses = lazy(() => import('./pages/user/Addresses'));
const WishlistPage = lazy(() => import('./pages/user/WishlistPage'));

// Admin pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminCustomers = lazy(() => import('./pages/admin/Customers'));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons'));
const AdminInventory = lazy(() => import('./pages/admin/Inventory'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews'));
const AdminBanners = lazy(() => import('./pages/admin/Banners'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

/** Lightweight spinner shown while a route chunk loads. */
const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
  </div>
);

/** ScrollToTop component ensures page starts at top on route change. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
};

/** Main storefront layout: header + footer wrap all customer-facing pages. */
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <SiteHeader />
    <main className="flex-grow">
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />

    {/* Sticky Mobile CTA */}
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-40">
      <Link
        to="/shop"
        className="flex items-center justify-center gap-3 bg-brand-blue text-white py-4 rounded-full font-bold shadow-2xl shadow-brand-blue/40 border border-white/10 backdrop-blur-sm"
      >
        <ShoppingBag size={20} /> Shop Collection
      </Link>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* ─── Storefront (existing UI preserved) ─── */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/returns-exchange" element={<ReturnExchangePolicy />} />
                  <Route path="/care-instructions" element={<CareInstructions />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/faqs" element={<Faqs />} />
                  <Route path="/corporate" element={<Navigate to="/contact" replace />} />
                  <Route path="*" element={<NotFound />} />

                  {/* Auth */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />

                  {/* Cart + checkout */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/failed" element={<PaymentFailed />} />
                  <Route path="/payment/pending" element={<PaymentPending />} />

                  {/* User account */}
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/addresses"
                    element={
                      <ProtectedRoute>
                        <Addresses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/wishlist"
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* ─── Admin dashboard (separate layout) ─── */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
