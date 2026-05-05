import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ShoppingBag, Menu, X, ChevronRight, ChevronLeft, ArrowRight, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Recycle, Award, Droplets, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  formatInr,
  getProductGalleryImages,
  getProductPriceCaption,
  INSTAGRAM_PROFILE_URL,
  BRAND_LOGO_HEADER_SRC,
  BRAND_LOGO_FOOTER_SRC,
  type GlassSetSize,
  type GlassSetPricing,
  type Product,
} from './constants';

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
  const isHome = location.pathname === '/';
  const useTransparent = isHome && !isScrolled;

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
      useTransparent ? "bg-transparent" : "bg-white/90 backdrop-blur-md shadow-sm py-3"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className={cn(
            'flex shrink-0 items-center rounded-sm motion-safe:transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-gold)]',
            useTransparent && 'drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]'
          )}
        >
          <img
            src={BRAND_LOGO_HEADER_SRC}
            alt="ReSip India — Upcycling With A Cause"
            className="h-10 w-auto max-h-[52px] object-contain object-left md:h-11 md:max-h-14"
            width={200}
            height={56}
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={cn(
                "text-sm font-medium tracking-wide hover:text-brand-gold transition-colors duration-300",
                useTransparent ? "text-white" : "text-charcoal"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/shop" className={cn(
            "p-2 rounded-full transition-all duration-300",
            useTransparent ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm" : "bg-brand-blue text-white hover:bg-brand-gold"
          )}>
            <ShoppingBag size={20} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={cn("md:hidden p-2", useTransparent ? "text-white" : "text-charcoal")}
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
          <Link
            to="/"
            className="inline-flex rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-gold)] motion-safe:transition-opacity hover:opacity-95"
          >
            <img
              src={BRAND_LOGO_FOOTER_SRC}
              alt="ReSip India — Upcycling With A Cause"
              className="h-[72px] w-auto max-w-[min(100%,280px)] object-contain object-left md:h-20"
              width={240}
              height={80}
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </Link>
          <p className="text-white/70 leading-relaxed font-light">
            Transforming discarded bottles into timeless designer glassware. Handcrafted luxury with a sustainable soul.
          </p>
          <div className="flex gap-4">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all duration-300"
              aria-label="ReSip India on Instagram"
            >
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
        <div className="absolute inset-0 bg-brand-blue/25 flex items-center justify-center">
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
 * Product gallery with prev/next controls; respects prefers-reduced-motion.
 */
export const ProductImageCarousel: React.FC<{ product: Product }> = ({ product }) => {
  const images = getProductGalleryImages(product);
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIndex(0);
  }, [product.id]);

  const len = images.length;
  const currentSrc = images[index] ?? product.image;

  const goPrev = () => setIndex((i) => (i - 1 + len) % len);
  const goNext = () => setIndex((i) => (i + 1) % len);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35 }}
      className="w-full"
    >
      <section
        className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-brand-bg shadow-xl outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]"
        aria-roledescription="carousel"
        aria-label={`${product.name} photos`}
        aria-live={len > 1 ? 'polite' : undefined}
        tabIndex={len > 1 ? 0 : undefined}
        onKeyDown={(e) => {
          if (len <= 1) return;
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goPrev();
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            goNext();
          }
        }}
      >
        {shouldReduceMotion ? (
          <img
            key={currentSrc}
            src={currentSrc}
            alt={`${product.name} — image ${index + 1} of ${len}`}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={currentSrc}
              src={currentSrc}
              alt={`${product.name} — image ${index + 1} of ${len}`}
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            />
          </AnimatePresence>
        )}

        {len > 1 ? (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4">
              <span className="rounded-full border border-[color-mix(in_srgb,var(--color-brand-blue)_12%,transparent)] bg-[color-mix(in_srgb,white_88%,var(--color-brand-blue)_12%)] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-charcoal)] backdrop-blur-sm">
                {index + 1} / {len}
              </span>
            </div>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-brand-blue)_18%,transparent)] bg-[color-mix(in_srgb,white_94%,var(--color-brand-blue)_6%)] text-[var(--color-brand-blue)] shadow-lg motion-safe:transition-colors motion-safe:duration-200 hover:bg-[var(--color-brand-blue)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-blue)]"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-brand-blue)_18%,transparent)] bg-[color-mix(in_srgb,white_94%,var(--color-brand-blue)_6%)] text-[var(--color-brand-blue)] shadow-lg motion-safe:transition-colors motion-safe:duration-200 hover:bg-[var(--color-brand-blue)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-blue)]"
              aria-label="Next image"
            >
              <ChevronRight size={24} strokeWidth={2.25} aria-hidden />
            </button>
          </>
        ) : null}
      </section>
    </motion.div>
  );
};

/**
 * Set size selector — format 24 (sets of 2 & 4) or 612 (sets of 6 & 12).
 */
interface GlassSetPickerProps {
  pricing: GlassSetPricing;
  selected: GlassSetSize;
  onChange: (size: GlassSetSize) => void;
}

export const GlassPackPicker: React.FC<GlassSetPickerProps> = ({ pricing, selected, onChange }) => {
  const baseLabel =
    'flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 motion-safe:transition-colors';

  if (pricing.format === '24') {
    return (
      <fieldset className="space-y-4">
        <legend className="mb-2 block text-sm font-bold uppercase tracking-widest text-charcoal/40">
          Choose your set
        </legend>
        <p id="glass-set-hint" className="mb-4 text-sm text-charcoal/60">
          Sold in sets of 2 or 4 only — price is per set.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
          <label
            className={cn(
              baseLabel,
              selected === 2
                ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5 ring-2 ring-[var(--color-brand-blue)]/25'
                : 'border-brand-blue/15 hover:border-[var(--color-brand-blue)]/40'
            )}
          >
            <span className="flex items-start gap-3">
              <input
                type="radio"
                name="glass-set-24"
                value="2"
                checked={selected === 2}
                onChange={() => onChange(2)}
                className="mt-1 size-4 shrink-0 accent-[var(--color-brand-blue)]"
                aria-describedby="glass-set-hint"
              />
              <span className="flex flex-col gap-1">
                <span className="font-bold text-charcoal">Set of 2</span>
                <span className="font-display text-2xl font-bold text-[var(--color-brand-blue)]">
                  ₹{formatInr(pricing.setOf2)}
                </span>
              </span>
            </span>
          </label>
          <label
            className={cn(
              baseLabel,
              selected === 4
                ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5 ring-2 ring-[var(--color-brand-blue)]/25'
                : 'border-brand-blue/15 hover:border-[var(--color-brand-blue)]/40'
            )}
          >
            <span className="flex items-start gap-3">
              <input
                type="radio"
                name="glass-set-24"
                value="4"
                checked={selected === 4}
                onChange={() => onChange(4)}
                className="mt-1 size-4 shrink-0 accent-[var(--color-brand-blue)]"
                aria-describedby="glass-set-hint"
              />
              <span className="flex flex-col gap-1">
                <span className="font-bold text-charcoal">Set of 4</span>
                <span className="font-display text-2xl font-bold text-[var(--color-brand-blue)]">
                  ₹{formatInr(pricing.setOf4)}
                </span>
              </span>
            </span>
          </label>
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset className="space-y-4">
      <legend className="mb-2 block text-sm font-bold uppercase tracking-widest text-charcoal/40">
        Choose your set
      </legend>
      <p id="glass-set-hint-612" className="mb-4 text-sm text-charcoal/60">
        Sold in sets of 6 or 12 only — price is per set.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
        <label
          className={cn(
            baseLabel,
            selected === 6
              ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5 ring-2 ring-[var(--color-brand-blue)]/25'
              : 'border-brand-blue/15 hover:border-[var(--color-brand-blue)]/40'
          )}
        >
          <span className="flex items-start gap-3">
            <input
              type="radio"
              name="glass-set-612"
              value="6"
              checked={selected === 6}
              onChange={() => onChange(6)}
              className="mt-1 size-4 shrink-0 accent-[var(--color-brand-blue)]"
              aria-describedby="glass-set-hint-612"
            />
            <span className="flex flex-col gap-1">
              <span className="font-bold text-charcoal">Set of 6</span>
              <span className="font-display text-2xl font-bold text-[var(--color-brand-blue)]">
                ₹{formatInr(pricing.setOf6)}
              </span>
            </span>
          </span>
        </label>
        <label
          className={cn(
            baseLabel,
            selected === 12
              ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5 ring-2 ring-[var(--color-brand-blue)]/25'
              : 'border-brand-blue/15 hover:border-[var(--color-brand-blue)]/40'
          )}
        >
          <span className="flex items-start gap-3">
            <input
              type="radio"
              name="glass-set-612"
              value="12"
              checked={selected === 12}
              onChange={() => onChange(12)}
              className="mt-1 size-4 shrink-0 accent-[var(--color-brand-blue)]"
              aria-describedby="glass-set-hint-612"
            />
            <span className="flex flex-col gap-1">
              <span className="font-bold text-charcoal">Set of 12</span>
              <span className="font-display text-2xl font-bold text-[var(--color-brand-blue)]">
                ₹{formatInr(pricing.setOf12)}
              </span>
            </span>
          </span>
        </label>
      </div>
    </fieldset>
  );
};

/**
 * Product Card Component
 */
interface ProductCardProps {
  product: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div 
      whileHover={shouldReduceMotion ? undefined : { y: -10 }}
      className="group bg-white rounded-2xl overflow-hidden border border-brand-blue/10 hover:shadow-2xl transition-all duration-500"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
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
      <div className="p-6">
        <h3 className="text-xl md:text-2xl font-display font-bold leading-tight tracking-tight group-hover:text-brand-blue transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-charcoal/50 font-bold">
          {product.category}
        </p>

        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-brand-gold font-bold">
            Expertise
          </p>
          {product.description?.trim() ? (
            <p className="mt-2 text-sm text-charcoal/60 font-light leading-relaxed line-clamp-2">
              {product.description}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <p className="text-sm text-charcoal/40 font-medium">Price</p>
          <p className="text-sm font-bold leading-snug text-[var(--color-brand-blue)] sm:text-base">
            {getProductPriceCaption(product)}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            to={`/product/${product.id}`}
            className="py-3 rounded-xl text-sm font-bold text-brand-blue border border-brand-blue/20 hover:border-brand-blue/40 hover:bg-brand-blue/5 transition-colors flex items-center justify-center gap-2"
          >
            Details <ChevronRight size={16} />
          </Link>
          <button className="py-3 rounded-xl text-sm font-bold bg-brand-blue text-white hover:bg-brand-gold transition-colors flex items-center justify-center gap-2">
            Add to Cart <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
