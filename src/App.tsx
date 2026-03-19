import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Navbar, Footer } from './components';
import Home from './Home';
import Shop from './Shop';
import ProductDetail from './ProductDetail';
import About from './About';
import CustomOrders from './CustomOrders';

/**
 * ScrollToTop component ensures page starts at top on route change
 */
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

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/corporate" element={<CustomOrders />} />
          </Routes>
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
    </Router>
  );
}
