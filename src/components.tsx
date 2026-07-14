import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ShoppingBag, Menu, X, ChevronRight, ChevronLeft, ArrowRight, Instagram, Facebook, Mail, Phone, MapPin, Recycle, Award, Droplets, Sparkles, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import apiClient from './api/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  formatInr,
  getProductGalleryImages,
  getProductPriceCaption,
  ANNOUNCEMENT_MESSAGES,
  INSTAGRAM_PROFILE_URL,
  CONTACT_WHATSAPP_URL,
  FOOTER_UPCYCLE_LOGO_SRC,
  FOOTER_MAKE_IN_INDIA_LOGO_SRC,
  MEDIA_PARTNERS,
  BRAND_LOGO_SRC,
  CATEGORIES,
  getShopCategoryPath,
  isCandleProduct,
  type GlassSetSize,
  type GlassSetPricing,
  type Product,
  type MediaPartner,
} from './constants';
import OptimizedImage from './OptimizedImage';
import { optimizedSrc, optimizedSrcSet, IMG_WIDTHS } from './image-utils';

/**
 * Utility for Tailwind class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BRAND_LOGO_LABEL = 'ReSip India Upcycling With A Cause';

type BrandLogoProps = {
  /** Full-colour lockup, or white for dark backgrounds. */
  variant?: 'color' | 'white';
  displayWidth?: number;
  className?: string;
  priority?: boolean;
};

/** Site logo colour on light backgrounds, white mask on dark (footer / hero nav). */
export function BrandLogo({
  variant = 'color',
  displayWidth = IMG_WIDTHS.LOGO,
  className,
  priority = false,
}: BrandLogoProps) {
  if (variant === 'white') {
    return (
      <span
        role="img"
        aria-label={BRAND_LOGO_LABEL}
        className={cn('brand-logo--white inline-block shrink-0', className)}
        style={
          { '--brand-logo-mask-url': `url("${BRAND_LOGO_SRC}")` } as React.CSSProperties
        }
      />
    );
  }

  return (
    <OptimizedImage
      src={BRAND_LOGO_SRC}
      displayWidth={displayWidth}
      priority={priority}
      alt={BRAND_LOGO_LABEL}
      className={cn('object-contain object-left', className)}
    />
  );
}

const BRAND_LOGO_BOX = 'h-12 w-[140px] md:h-14 md:w-[160px]';
const BRAND_LOGO_BOX_FOOTER = 'h-24 w-[200px] md:h-28 md:w-[220px]';

const ANNOUNCEMENT_INTERVAL_MS = 4500;

/**
 * Rotating promo strip above the navbar (marquee-style, all pages).
 */
export const AnnouncementBanner = () => {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const len = ANNOUNCEMENT_MESSAGES.length;

  useEffect(() => {
    if (len <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, ANNOUNCEMENT_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [len]);

  const message = ANNOUNCEMENT_MESSAGES[index] ?? ANNOUNCEMENT_MESSAGES[0];

  return (
    <div
      className="announcement-bar relative h-10 w-full shrink-0 overflow-hidden border-b border-[color-mix(in_srgb,var(--color-brand-gold)_35%,transparent)] bg-[var(--color-brand-blue)] text-white"
      role="region"
      aria-label="Store announcements"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="relative flex h-full items-center justify-center px-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={message}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
            className="max-w-full truncate text-center text-[11px] font-semibold uppercase tracking-[0.28em] md:text-xs md:tracking-[0.32em]"
          >
            <span className="text-[var(--color-brand-gold)]" aria-hidden>
              � �{' '}
            </span>
            {message}
            <span className="text-[var(--color-brand-gold)]" aria-hidden>
              {' '}
              � �
            </span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

/** Fixed header stack: announcement bar + navbar (every page). */
export const SiteHeader = () => (
  <header className="fixed top-0 left-0 z-50 flex w-full flex-col">
    <AnnouncementBanner />
    <Navbar />
  </header>
);

/**
 * Navbar Component
 */
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const isHome = location.pathname === '/';
  const useTransparent = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Shop', path: '/shop' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      "relative w-full transition-all duration-500 px-6 py-4",
      useTransparent ? "bg-transparent" : "bg-white/90 backdrop-blur-md shadow-sm py-3"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className={cn(
            'relative flex shrink-0 items-center rounded-sm motion-safe:transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-gold)]',
            BRAND_LOGO_BOX
          )}
        >
          <BrandLogo
            variant="color"
            displayWidth={IMG_WIDTHS.LOGO}
            priority
            className={cn(
              'absolute inset-0 h-full w-full motion-safe:transition-opacity motion-safe:duration-500 motion-reduce:transition-none',
              useTransparent ? 'pointer-events-none opacity-0' : 'opacity-100'
            )}
          />
          <BrandLogo
            variant="white"
            className={cn(
              'absolute inset-0 h-full w-full drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] motion-safe:transition-opacity motion-safe:duration-500 motion-reduce:transition-none',
              useTransparent ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
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
          {isAdmin && (
            <Link
              to="/admin"
              aria-label="Admin dashboard"
              className={cn(
                'p-2 rounded-full transition-all duration-300',
                useTransparent ? 'text-white hover:bg-white/10' : 'text-charcoal hover:text-brand-gold'
              )}
            >
              <LayoutDashboard size={20} />
            </Link>
          )}
          <Link
            to={isAuthenticated ? '/account' : '/login'}
            aria-label={isAuthenticated ? 'My account' : 'Sign in'}
            className={cn(
              'p-2 rounded-full transition-all duration-300',
              useTransparent ? 'text-white hover:bg-white/10' : 'text-charcoal hover:text-brand-gold'
            )}
          >
            <UserIcon size={20} />
          </Link>
          <Link
            to="/cart"
            aria-label={`Cart with ${totalItems} items`}
            className={cn(
              'relative p-2 rounded-full transition-all duration-300',
              useTransparent ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm' : 'bg-brand-blue text-white hover:bg-brand-gold'
            )}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-blue">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: cart icon + menu toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            to="/cart"
            aria-label={`Cart with ${totalItems} items`}
            className={cn(
              'relative p-2 rounded-full transition-all duration-300',
              useTransparent ? 'text-white hover:bg-white/10' : 'text-charcoal hover:text-brand-gold'
            )}
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-blue">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className={cn('p-2', useTransparent ? 'text-white' : 'text-charcoal')}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
            <div className="border-t border-brand-blue/10 pt-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-charcoal/40">
                Collections
              </p>
              <div className="flex flex-col gap-3">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={getShopCategoryPath(cat.name)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-charcoal/80 hover:text-brand-blue"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-brand-blue/10 pt-4">
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-lg font-medium text-charcoal hover:text-brand-blue"
              >
                <ShoppingBag size={20} /> Cart {totalItems > 0 ? `(${totalItems})` : ''}
              </Link>
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-lg font-medium text-charcoal hover:text-brand-blue"
              >
                <UserIcon size={20} /> {isAuthenticated ? 'My Account' : 'Sign In'}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-lg font-medium text-charcoal hover:text-brand-blue"
                >
                  <LayoutDashboard size={20} /> Admin
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/**
 * Footer Component
 */
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export const Footer = () => {
  const toast = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribing(true);
    try {
      const { data } = await apiClient.post('/newsletter', { email: newsletterEmail.trim() });
      toast.success(data?.message || 'Subscribed successfully!');
      setNewsletterEmail('');
    } catch (err: any) {
      toast.error(err?.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-brand-blue text-white pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-gold)] motion-safe:transition-opacity hover:opacity-95"
          >
            <BrandLogo
              variant="white"
              displayWidth={IMG_WIDTHS.LOGO_FOOTER}
              className={BRAND_LOGO_BOX_FOOTER}
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
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all duration-300"
              aria-label="ReSip India on WhatsApp"
            >
              <WhatsAppIcon size={18} />
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2" aria-label="Certifications">
            <OptimizedImage
              src={FOOTER_UPCYCLE_LOGO_SRC}
              displayWidth={56}
              alt="Upcycled logo"
              className="h-14 w-auto object-contain"
            />
            <OptimizedImage
              src={FOOTER_MAKE_IN_INDIA_LOGO_SRC}
              displayWidth={56}
              alt="Make in India"
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 text-brand-gold uppercase tracking-widest">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70 font-light">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
            <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 text-brand-gold uppercase tracking-widest">Customer Care</h4>
          <ul className="space-y-2 text-sm text-white/70 font-light">
            <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link to="/returns-exchange" className="hover:text-white transition-colors">Returns &amp; Exchanges</Link></li>
            <li><Link to="/care-instructions" className="hover:text-white transition-colors">Care Instructions</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
            <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4 text-brand-gold uppercase tracking-widest">Newsletter</h4>
          <p className="text-sm text-white/70 mb-3 font-light">Join our journey towards a waste-free world.</p>
          <form className="flex gap-2" onSubmit={handleNewsletter}>
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:border-brand-gold transition-colors"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="bg-brand-gold text-brand-blue font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-60"
            >
              {subscribing ? '…' : 'Join'}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/40 font-light">
        <p>� 2026 Resip India. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

const MediaPartnerCard: React.FC<{ partner: MediaPartner }> = ({ partner }) => {
  return (
    <div className="group relative shrink-0 overflow-hidden rounded-xl bg-white shadow-md transition-all duration-400 hover:shadow-xl hover:-translate-y-1" style={{ width: 220, height: 160 }}>
      <img
        src={partner.image}
        alt={partner.name}
        className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * Infinite horizontal scrolling showcase â€” all four partner images visible,
 * continuously rotating one-by-one in a seamless loop.
 */
export const MediaPartnersMarquee = () => {
  const reduceMotion = useReducedMotion();
  // Duplicate the set 3x for a seamless infinite scroll
  const marqueeTrack = [...MEDIA_PARTNERS, ...MEDIA_PARTNERS, ...MEDIA_PARTNERS];

  if (reduceMotion) {
    return (
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-6">
        {MEDIA_PARTNERS.map((partner) => (
          <div key={partner.id}>
            <MediaPartnerCard partner={partner} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden py-2"
      aria-label="Our media partners"
      role="region"
    >
      {/* Soft gradient fade on edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24"
        aria-hidden
      />
      <div className="media-partners-marquee-track flex w-max items-center gap-8">
        {marqueeTrack.map((partner, index) => (
          <MediaPartnerCard key={`${partner.id}-${index}`} partner={partner} />
        ))}
      </div>
    </div>
  );
};

/**
 * Before/After Slider Component
 */
export const BeforeAfterSlider = ({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const posRef = useRef(50);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => setContainerWidth(el.getBoundingClientRect().width);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const applyPosition = useCallback((pos: number, syncState = false) => {
    const clamped = Math.min(Math.max(pos, 0), 100);
    posRef.current = clamped;

    if (clipRef.current) clipRef.current.style.width = `${clamped}%`;
    if (dividerRef.current) dividerRef.current.style.left = `${clamped}%`;

    if (syncState) setSliderPos(clamped);
  }, []);

  const updatePosition = useCallback(
    (clientX: number, syncState = false) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width <= 0) return;
      const position = ((clientX - rect.left) / rect.width) * 100;
      applyPosition(position, syncState);
    },
    [applyPosition],
  );

  const stopDragging = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setSliderPos(posRef.current);
  }, []);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      updatePosition(e.clientX, false);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, [updatePosition, stopDragging]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      updatePosition(e.clientX, false);
    },
    [updatePosition],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    stopDragging();
  }, [stopDragging]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        applyPosition(posRef.current - 2, true);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        applyPosition(posRef.current + 2, true);
      }
    },
    [applyPosition],
  );

  const showBeforeLabel = sliderPos > 12;
  const showAfterLabel = sliderPos < 88;
  const frameWidth = containerWidth > 0 ? `${containerWidth}px` : '100%';

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-[4/3] w-full cursor-col-resize select-none overflow-hidden rounded-2xl bg-white shadow-2xl touch-none',
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Compare before and after images"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPos)}
    >
      {/* After image full base layer */}
      <div className="absolute inset-0 bg-white">
        <OptimizedImage
          src={after}
          displayWidth={IMG_WIDTHS.HERO}
          alt={afterLabel}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Before image clipped; inner frame matches full container size */}
      <div
        ref={clipRef}
        className="absolute inset-y-0 left-0 overflow-hidden bg-white"
        style={{ width: `${sliderPos}%` }}
        aria-hidden={sliderPos === 0}
      >
        <div
          className="absolute left-0 top-0 h-full bg-white"
          style={{ width: frameWidth }}
        >
          <OptimizedImage
            src={before}
            displayWidth={IMG_WIDTHS.HERO}
            alt={beforeLabel}
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Divider + handle */}
      <div
        ref={dividerRef}
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-brand-gold shadow-[0_0_12px_color-mix(in_srgb,var(--color-brand-gold)_45%,transparent)]"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-brand-gold text-brand-blue shadow-xl">
          <ChevronRight size={22} className="rotate-180" strokeWidth={2.5} aria-hidden />
          <ChevronRight size={22} strokeWidth={2.5} aria-hidden />
        </div>
      </div>

      {/* Before label */}
      {showBeforeLabel ? (
        <div
          className="pointer-events-none absolute bottom-6 left-6 z-20 rounded-full border border-white/20 bg-black/45 px-4 py-2 backdrop-blur-md"
          style={{ maxWidth: `calc(${sliderPos}% - 24px)` }}
        >
          <span className="truncate font-display text-sm font-bold uppercase tracking-widest text-white">
            {beforeLabel}
          </span>
        </div>
      ) : null}

      {/* After label */}
      {showAfterLabel ? (
        <div className="pointer-events-none absolute bottom-6 right-6 z-20 rounded-full border border-white/20 bg-black/45 px-4 py-2 backdrop-blur-md">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
            {afterLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
};

type CandleDualImageHoverProps = {
  product: Product;
  variant?: 'card' | 'detail';
  displayWidth?: number;
  className?: string;
};

/** Scented candles: image 1 by default; on hover, fade to image 2 (no zoom). */
export function CandleDualImageHover({
  product,
  variant = 'card',
  displayWidth,
  className,
}: CandleDualImageHoverProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const images = getProductGalleryImages(product);
  const primary = images[0];
  const secondary = images[1] ?? primary;
  const width = displayWidth ?? (variant === 'detail' ? IMG_WIDTHS.DETAIL : IMG_WIDTHS.THUMB);
  const objectFit = variant === 'detail' ? 'object-contain' : 'object-cover';
  const showSecondary = !shouldReduceMotion && hovered && secondary !== primary;
  const fadeMs = shouldReduceMotion ? 0 : 500;

  const handleEnter = () => {
    if (!shouldReduceMotion) setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  return (
    <div
      className={cn(
        'relative aspect-square w-full overflow-hidden bg-brand-bg',
        variant === 'detail' && 'rounded-2xl shadow-lg',
        className,
      )}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      {...(variant === 'detail'
        ? { tabIndex: 0, 'aria-label': `${product.name} product photos` }
        : {})}
    >
      <img
        src={optimizedSrc(primary, width)}
        srcSet={optimizedSrcSet(primary, width)}
        sizes={`(max-width: ${width}px) 100vw, ${width}px`}
        alt={product.name}
        loading={variant === 'detail' ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        className={cn('absolute inset-0 h-full w-full', objectFit)}
        style={{
          opacity: showSecondary ? 0 : 1,
          transition: fadeMs ? `opacity ${fadeMs}ms ease-in-out` : undefined,
        }}
      />
      {secondary !== primary ? (
        <img
          src={optimizedSrc(secondary, width)}
          srcSet={optimizedSrcSet(secondary, width)}
          sizes={`(max-width: ${width}px) 100vw, ${width}px`}
          alt={`${product.name} alternate view`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={cn('absolute inset-0 h-full w-full', objectFit)}
          style={{
            opacity: showSecondary ? 1 : 0,
            transition: fadeMs ? `opacity ${fadeMs}ms ease-in-out` : undefined,
          }}
        />
      ) : null}
    </div>
  );
}

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
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-brand-bg shadow-lg outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)]"
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
          <OptimizedImage
            key={currentSrc}
            src={currentSrc}
            displayWidth={IMG_WIDTHS.DETAIL}
            alt={`${product.name} image ${index + 1} of ${len}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={currentSrc}
              src={optimizedSrc(currentSrc, IMG_WIDTHS.DETAIL)}
              srcSet={optimizedSrcSet(currentSrc, IMG_WIDTHS.DETAIL)}
              sizes={`(max-width: ${IMG_WIDTHS.DETAIL}px) 100vw, ${IMG_WIDTHS.DETAIL}px`}
              alt={`${product.name} image ${index + 1} of ${len}`}
              className="absolute inset-0 h-full w-full object-contain"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
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
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-brand-blue)_18%,transparent)] bg-[color-mix(in_srgb,white_94%,var(--color-brand-blue)_6%)] text-[var(--color-brand-blue)] shadow-md motion-safe:transition-colors motion-safe:duration-200 hover:bg-[var(--color-brand-blue)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-blue)]"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-brand-blue)_18%,transparent)] bg-[color-mix(in_srgb,white_94%,var(--color-brand-blue)_6%)] text-[var(--color-brand-blue)] shadow-md motion-safe:transition-colors motion-safe:duration-200 hover:bg-[var(--color-brand-blue)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-blue)]"
              aria-label="Next image"
            >
              <ChevronRight size={20} strokeWidth={2.25} aria-hidden />
            </button>
          </>
        ) : null}
      </section>
    </motion.div>
  );
};

/**
 * Set size selector format 24 (sets of 2 & 4) or 612 (sets of 6 & 12).
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
          Sold in sets of 2 or 4 only price is per set.
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
        Sold in sets of 6 or 12 only price is per set.
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

export type CandleLabelType = 'text' | 'image';

interface FragrancePickerProps {
  fragrances: string[];
  selected: string;
  onChange: (fragrance: string) => void;
}

export const FragrancePicker: React.FC<FragrancePickerProps> = ({
  fragrances,
  selected,
  onChange,
}) => {
  const baseLabel =
    'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 motion-safe:transition-colors';

  return (
    <fieldset className="space-y-4">
      <legend className="mb-2 block text-sm font-bold uppercase tracking-widest text-charcoal/40">
        Choose fragrance
      </legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {fragrances.map((fragrance) => (
          <label
            key={fragrance}
            className={cn(
              baseLabel,
              selected === fragrance
                ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5 ring-2 ring-[var(--color-brand-blue)]/25'
                : 'border-brand-blue/15 hover:border-[var(--color-brand-blue)]/40'
            )}
          >
            <input
              type="radio"
              name="candle-fragrance"
              value={fragrance}
              checked={selected === fragrance}
              onChange={() => onChange(fragrance)}
              className="size-4 shrink-0 accent-[var(--color-brand-blue)]"
            />
            <span className="text-sm font-bold text-charcoal">{fragrance}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

interface CandleLabelPickerProps {
  surcharge: number;
  selected: CandleLabelType;
  onChange: (label: CandleLabelType) => void;
}

export const CandleLabelPicker: React.FC<CandleLabelPickerProps> = ({
  surcharge,
  selected,
  onChange,
}) => {
  const baseLabel =
    'flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 motion-safe:transition-colors';

  return (
    <fieldset className="space-y-4">
      <legend className="mb-2 block text-sm font-bold uppercase tracking-widest text-charcoal/40">
        Choose label
      </legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
        <label
          className={cn(
            baseLabel,
            selected === 'text'
              ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5 ring-2 ring-[var(--color-brand-blue)]/25'
              : 'border-brand-blue/15 hover:border-[var(--color-brand-blue)]/40'
          )}
        >
          <span className="flex items-start gap-3">
            <input
              type="radio"
              name="candle-label"
              value="text"
              checked={selected === 'text'}
              onChange={() => onChange('text')}
              className="mt-1 size-4 shrink-0 accent-[var(--color-brand-blue)]"
            />
            <span className="flex flex-col gap-1">
              <span className="font-bold text-charcoal">Label with text</span>
              <span className="text-sm text-charcoal/60">Included</span>
            </span>
          </span>
        </label>
        <label
          className={cn(
            baseLabel,
            selected === 'image'
              ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5 ring-2 ring-[var(--color-brand-blue)]/25'
              : 'border-brand-blue/15 hover:border-[var(--color-brand-blue)]/40'
          )}
        >
          <span className="flex items-start gap-3">
            <input
              type="radio"
              name="candle-label"
              value="image"
              checked={selected === 'image'}
              onChange={() => onChange('image')}
              className="mt-1 size-4 shrink-0 accent-[var(--color-brand-blue)]"
            />
            <span className="flex flex-col gap-1">
              <span className="font-bold text-charcoal">Label with image</span>
              <span className="text-sm text-charcoal/60">+ ₹{formatInr(surcharge)} per set</span>
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
  const navigate = useNavigate();
  const { addItem } = useCart();
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  // API products expose Mongo _id; legacy constants products use id/legacyId.
  const productKey = product.legacyId || product.id || product.slug;
  const productPath = `/product/${productKey}`;
  const isCandle = isCandleProduct(product);
  // Products with set sizes or fragrances need option selection on the detail page.
  const needsOptions = !!product.glassSetPricing || (product.fragrances?.length ?? 0) > 0;

  const handleAddToCart = async () => {
    // Without a Mongo _id (pure constants data) we can't hit the cart API; send
    // the shopper to the detail page to pick options instead.
    if (!product._id || needsOptions) {
      navigate(productPath);
      return;
    }
    setAdding(true);
    try {
      await addItem({ productId: product._id, quantity: 1 });
      toast.success(`${product.name} added to cart`);
    } catch (err: any) {
      toast.error(err?.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.article
      whileHover={!isCandle && !shouldReduceMotion ? { y: -10 } : undefined}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-blue/10 bg-white transition-all duration-500',
        !isCandle && 'hover:shadow-2xl',
      )}
    >
      <Link to={productPath} className="block flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-gold)]">
        {isCandle ? (
          <CandleDualImageHover product={product} variant="card" />
        ) : (
          <div className="relative aspect-square overflow-hidden">
            <OptimizedImage
              src={product.image}
              displayWidth={IMG_WIDTHS.THUMB}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-brand-blue/0 transition-colors duration-500 group-hover:bg-brand-blue/10" />
            <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-blue opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100">
              Quick View
            </div>
          </div>
        )}
        <div className="p-6 pb-4">
          <h3 className="font-display text-xl font-bold leading-tight tracking-tight transition-colors group-hover:text-brand-blue md:text-2xl">
            {product.name}
          </h3>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-charcoal/50">
            {product.category}
          </p>

          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              Expertise
            </p>
            {product.description?.trim() ? (
              <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-charcoal/60">
                {product.description}
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <p className="text-sm font-medium text-charcoal/40">Price</p>
            <p className="text-sm font-bold leading-snug text-[var(--color-brand-blue)] sm:text-base">
              {getProductPriceCaption(product)}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-auto grid grid-cols-2 gap-3 px-6 pb-6">
        <Link
          to={productPath}
          className="flex items-center justify-center gap-2 rounded-xl border border-brand-blue/20 py-3 text-sm font-bold text-brand-blue transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-gold)]"
        >
          Details <ChevronRight size={16} aria-hidden />
        </Link>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-gold)] disabled:opacity-60"
        >
          {needsOptions ? 'Select Options' : 'Add to Cart'} <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </motion.article>
  );
};
