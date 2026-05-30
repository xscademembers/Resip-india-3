import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ShoppingBag, Menu, X, ChevronRight, ChevronLeft, ArrowRight, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Recycle, Award, Droplets, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  formatInr,
  getProductGalleryImages,
  getProductPriceCaption,
  ANNOUNCEMENT_MESSAGES,
  INSTAGRAM_PROFILE_URL,
  FOOTER_UPCYCLE_LOGO_SRC,
  FOOTER_MAKE_IN_INDIA_LOGO_SRC,
  MEDIA_PARTNERS,
  BRAND_LOGO_SRC,
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

const BRAND_LOGO_LABEL = 'ReSip India — Upcycling With A Cause';

type BrandLogoProps = {
  /** Full-colour lockup, or white for dark backgrounds. */
  variant?: 'color' | 'white';
  displayWidth?: number;
  className?: string;
  priority?: boolean;
};

/** Site logo — colour on light backgrounds, white mask on dark (footer / hero nav). */
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
              ◆{' '}
            </span>
            {message}
            <span className="text-[var(--color-brand-gold)]" aria-hidden>
              {' '}
              ◆
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
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all duration-300">
              <Twitter size={18} />
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2" aria-label="Certifications">
            <OptimizedImage
              src={FOOTER_UPCYCLE_LOGO_SRC}
              displayWidth={56}
              alt="Upcycle logo"
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
          <h4 className="text-lg font-bold mb-6 text-brand-gold">Quick Links</h4>
          <ul className="space-y-4 text-white/70 font-light">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
            <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
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

function MediaPartnerLogo({ partner }: { partner: MediaPartner }) {
  const content = (
    <OptimizedImage
      src={partner.logo}
      displayWidth={160}
      alt={partner.name}
      className="h-16 w-auto max-w-[160px] object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 motion-reduce:opacity-100 motion-reduce:grayscale-0"
    />
  );

  const className =
    'flex h-24 w-52 shrink-0 items-center justify-center px-6 sm:w-56';

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={partner.name}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

/**
 * Infinite horizontal marquee — four partner logos visible, seamless loop.
 */
export const MediaPartnersMarquee = () => {
  const reduceMotion = useReducedMotion();
  const marqueeTrack = [...MEDIA_PARTNERS, ...MEDIA_PARTNERS];

  if (reduceMotion) {
    return (
      <ul className="mx-auto grid max-w-5xl list-none grid-cols-2 gap-8 p-0 md:grid-cols-4">
        {MEDIA_PARTNERS.map((partner) => (
          <li key={partner.id} className="flex justify-center">
            <MediaPartnerLogo partner={partner} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      aria-label="Our media partners"
      role="region"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24"
        aria-hidden
      />
      <div className="media-partners-marquee-track flex w-max items-center gap-8 sm:gap-12">
        {marqueeTrack.map((partner, index) => (
          <MediaPartnerLogo key={`${partner.id}-${index}`} partner={partner} />
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
      {/* After image — full base layer */}
      <div className="absolute inset-0 bg-white">
        <OptimizedImage
          src={after}
          displayWidth={IMG_WIDTHS.HERO}
          alt={afterLabel}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Before image — clipped; inner frame matches full container size */}
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
            alt={`${product.name} — image ${index + 1} of ${len}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={currentSrc}
              src={optimizedSrc(currentSrc, IMG_WIDTHS.DETAIL)}
              srcSet={optimizedSrcSet(currentSrc, IMG_WIDTHS.DETAIL)}
              sizes={`(max-width: ${IMG_WIDTHS.DETAIL}px) 100vw, ${IMG_WIDTHS.DETAIL}px`}
              alt={`${product.name} — image ${index + 1} of ${len}`}
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
  const productPath = `/product/${product.id}`;

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : { y: -10 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-blue/10 bg-white transition-all duration-500 hover:shadow-2xl"
    >
      <Link to={productPath} className="block flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-gold)]">
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
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-gold)]"
        >
          Add to Cart <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </motion.article>
  );
};
