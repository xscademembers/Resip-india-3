import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, ChevronRight, ArrowRight, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Recycle, Award, Droplets, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Navbar Component
 */
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Our Process', path: '/#process' },
    { name: 'About', path: '/about' },
    { name: 'Corporate', path: '/corporate' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4",
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:bg-brand-gold transition-colors duration-300">
            RI
          </div>
          <span className={cn(
            "text-xl font-display font-bold tracking-tighter transition-colors duration-300",
            isScrolled ? "text-charcoal" : "text-white"
          )}>
            RESIP <span className="text-brand-gold">INDIA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={cn(
                "text-sm font-medium tracking-wide hover:text-brand-gold transition-colors duration-300",
                isScrolled ? "text-charcoal" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/shop" className={cn(
            "p-2 rounded-full transition-all duration-300",
            isScrolled ? "bg-brand-blue text-white hover:bg-brand-gold" : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          )}>
            <ShoppingBag size={20} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={cn("md:hidden p-2", isScrolled ? "text-charcoal" : "text-white")}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-charcoal hover:text-brand-blue"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/**
 * Footer Component
 */
export const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-blue font-bold">
              RI
            </div>
            <span className="text-2xl font-display font-bold tracking-tighter">
              RESIP <span className="text-brand-gold">INDIA</span>
            </span>
          </div>
          <p className="text-white/70 leading-relaxed font-light">
            Transforming discarded bottles into timeless designer glassware. Handcrafted luxury with a sustainable soul.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all duration-300">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all duration-300">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all duration-300">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-brand-gold">Quick Links</h4>
          <ul className="space-y-4 text-white/70 font-light">
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
            <li><Link to="/corporate" className="hover:text-white transition-colors">Corporate Gifting</Link></li>
            <li><Link to="/#process" className="hover:text-white transition-colors">The Process</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-brand-gold">Customer Care</h4>
          <ul className="space-y-4 text-white/70 font-light">
            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Care Instructions</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-brand-gold">Newsletter</h4>
          <p className="text-white/70 mb-6 font-light">Join our journey towards a waste-free world.</p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:border-brand-gold transition-colors"
            />
            <button className="bg-brand-gold text-brand-blue font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/40 font-light">
        <p>© 2026 Resip India. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

/**
 * Before/After Slider Component
 */
export const BeforeAfterSlider = ({ before, after }: { before: string; after: string }) => {
  const [sliderPos, setSliderPos] = useState(50);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-col-resize select-none shadow-2xl"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Base) */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
      
      {/* Before Image (Overlay) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100vw' }} referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <span className="text-white font-display font-bold text-4xl opacity-50 tracking-widest uppercase">Waste</span>
        </div>
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-brand-gold z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-brand-gold rounded-full shadow-lg flex items-center justify-center text-brand-blue">
          <ChevronRight size={24} className="rotate-180" />
          <ChevronRight size={24} />
        </div>
      </div>

      <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        <span className="text-white font-display font-bold text-xl tracking-widest uppercase">Reimagined</span>
      </div>
    </div>
  );
};

/**
 * Product Card Component
 */
interface ProductCardProps {
  product: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-2xl transition-all duration-500"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/10 transition-colors duration-500" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Quick View
        </div>
      </Link>
      <div className="p-6 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-bold mb-1">{product.category}</p>
            <h3 className="text-lg font-display font-bold group-hover:text-brand-blue transition-colors">{product.name}</h3>
          </div>
          <p className="font-bold text-brand-blue">₹{product.price}</p>
        </div>
        <button className="w-full mt-4 py-3 bg-brand-bg border border-brand-blue/10 rounded-xl text-sm font-bold text-brand-blue hover:bg-brand-blue hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
          Add to Cart <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};
