import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES, getShopCategoryPath } from './constants';
import OptimizedImage from './OptimizedImage';
import { optimizedSrc, prefetchImage, IMG_WIDTHS } from './image-utils';
import { settingsApi, bannersApi, type PublicBanner } from './api/settings';

const HomeBelowFold = lazy(() => import('./HomeBelowFold'));

const FALLBACK_HERO_SLIDES: PublicBanner[] = [
  {
    _id: 'fallback-1',
    image: 'https://static.wixstatic.com/media/9356bd_c8da8f804c0040c6917734181d2df3df~mv2.jpeg',
  },
  {
    _id: 'fallback-2',
    image: 'https://static.wixstatic.com/media/9356bd_a9b37b9f80984ce6ad7158b2ffc20bca~mv2.jpeg',
  },
  {
    _id: 'fallback-3',
    image: 'https://static.wixstatic.com/media/9356bd_6d4b2e5ba5d24c67917bd840a5fc3f05~mv2.jpeg',
  },
];

const HERO_SLIDE_INTERVAL_MS = 6000;
/** Desktop hero width — keep moderate for LCP. */
const HERO_DESKTOP_W = 1200;
/** Phone hero width — full 1280 was crushing mobile networks. */
const HERO_MOBILE_W = 720;
const HERO_QUALITY = 68;

export const DEFAULT_IMPACT = {
  bottlesValue: '6,000+',
  bottlesLabel: 'Bottle Upcycled',
  co2Value: '204kg',
  co2Label: 'CO2 Reduce',
  waterValue: '31,800 L',
  waterLabel: 'Saved Water',
  landfillValue: '2.5+ Tonnes',
  landfillLabel: 'Landfilled Diverted',
};

function usePrefersMobileHero() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

function heroSrc(slide: PublicBanner, isMobile: boolean) {
  const url = (isMobile && slide.mobileImage) || slide.image;
  return optimizedSrc(url, isMobile ? HERO_MOBILE_W : HERO_DESKTOP_W, HERO_QUALITY);
}

const HeroSlide: React.FC<{
  src: string;
  isPriority: boolean;
  className: string;
  onReady?: () => void;
}> = ({ src, isPriority, className, onReady }) => {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) onReady?.();
  }, [src, onReady]);

  return (
    <div className={className}>
      <img
        ref={ref}
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority={isPriority ? 'high' : 'low'}
        onLoad={onReady}
      />
    </div>
  );
};

function HeroBackgroundSlideshow({
  reduceMotion,
  slides,
}: {
  reduceMotion: boolean;
  slides: PublicBanner[];
}) {
  const isMobile = usePrefersMobileHero();
  const items = slides.length > 0 ? slides : FALLBACK_HERO_SLIDES.slice(0, 1);
  const slideKey = items.map((s) => s._id || s.image).join('|');
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [firstReady, setFirstReady] = useState(false);
  const prevIndexRef = useRef(0);
  const markFirstReady = useCallback(() => setFirstReady(true), []);
  const firstSrc = items[0] ? heroSrc(items[0], isMobile) : '';
  const firstSrcRef = useRef(firstSrc);

  useEffect(() => {
    setActiveIndex(0);
    setOutgoingIndex(null);
    setFadeIn(false);
    prevIndexRef.current = 0;
  }, [slideKey]);

  useEffect(() => {
    if (firstSrcRef.current === firstSrc) return;
    firstSrcRef.current = firstSrc;
    setFirstReady(false);
  }, [firstSrc]);

  useEffect(() => {
    if (reduceMotion || !firstReady || items.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length);
    }, HERO_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, firstReady, items.length, slideKey]);

  useEffect(() => {
    const prev = prevIndexRef.current;
    if (activeIndex === prev) return;
    setOutgoingIndex(prev);
    setFadeIn(false);
    prevIndexRef.current = activeIndex;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setFadeIn(true));
    });
    const t = window.setTimeout(() => {
      setOutgoingIndex(null);
      setFadeIn(false);
    }, 1000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (reduceMotion || items.length <= 1) return;
    const next = items[(activeIndex + 1) % items.length];
    prefetchImage(
      (isMobile && next.mobileImage) || next.image,
      isMobile ? HERO_MOBILE_W : HERO_DESKTOP_W,
      HERO_QUALITY,
    );
  }, [activeIndex, slideKey, isMobile, reduceMotion, items]);

  const mountedIndexes =
    outgoingIndex == null || outgoingIndex === activeIndex
      ? [activeIndex]
      : [outgoingIndex, activeIndex];

  return (
    <div className="absolute inset-0 z-0 bg-brand-blue" aria-hidden>
      {mountedIndexes.map((i) => {
        const slide = items[i];
        if (!slide) return null;
        const isActive = i === activeIndex;
        const opacityClass =
          outgoingIndex == null
            ? 'opacity-100'
            : isActive
              ? fadeIn
                ? 'opacity-100'
                : 'opacity-0'
              : fadeIn
                ? 'opacity-0'
                : 'opacity-100';
        return (
          <HeroSlide
            key={`${slide._id || slide.image}-${i}`}
            src={heroSrc(slide, isMobile)}
            isPriority={i === 0 && outgoingIndex == null}
            onReady={isActive ? markFirstReady : undefined}
            className={`absolute inset-0 ${
              outgoingIndex == null ? '' : 'transition-opacity duration-1000 ease-in-out'
            } ${opacityClass}`}
          />
        );
      })}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}

const Home = () => {
  // Start with only the first fallback so load does not pull every hero image.
  const [heroSlides, setHeroSlides] = useState<PublicBanner[]>([FALLBACK_HERO_SLIDES[0]]);
  const [impact, setImpact] = useState(DEFAULT_IMPACT);
  const [showBelowFold, setShowBelowFold] = useState(false);
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Defer non-critical homepage content until after first paint.
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const start = () => setShowBelowFold(true);
    const ric = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    }).requestIdleCallback;

    if (typeof ric === 'function') {
      idleId = ric(start, { timeout: 1200 });
    } else {
      timeoutId = setTimeout(start, 200);
    }

    return () => {
      if (idleId !== undefined) {
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    bannersApi
      .list('hero')
      .then((list) => {
        if (cancelled) return;
        if (list.length > 0) setHeroSlides(list);
        else setHeroSlides(FALLBACK_HERO_SLIDES);
      })
      .catch(() => {
        if (!cancelled) setHeroSlides(FALLBACK_HERO_SLIDES);
      });

    settingsApi
      .public()
      .then((s) => {
        if (cancelled) return;
        setImpact({
          bottlesValue: String(s.impact_bottles_value ?? DEFAULT_IMPACT.bottlesValue),
          bottlesLabel: String(s.impact_bottles_label ?? DEFAULT_IMPACT.bottlesLabel),
          co2Value: String(s.impact_co2_value ?? DEFAULT_IMPACT.co2Value),
          co2Label: String(s.impact_co2_label ?? DEFAULT_IMPACT.co2Label),
          waterValue: String(s.impact_water_value ?? DEFAULT_IMPACT.waterValue),
          waterLabel: String(s.impact_water_label ?? DEFAULT_IMPACT.waterLabel),
          landfillValue: String(s.impact_landfill_value ?? DEFAULT_IMPACT.landfillValue),
          landfillLabel: String(s.impact_landfill_label ?? DEFAULT_IMPACT.landfillLabel),
        });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero — kept lean for LCP */}
      <section className="relative h-[100svh] max-h-[920px] min-h-[480px] overflow-hidden">
        <h1 className="sr-only">ReSip India</h1>
        <HeroBackgroundSlideshow reduceMotion={!!reduceMotion} slides={heroSlides} />
        <div className="glass-reflection pointer-events-none absolute inset-0 z-10 opacity-30" />
      </section>

      {/* Categories stay in the first chunk but images stay lazy */}
      <section className="bg-brand-bg px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between md:mb-16">
            <div>
              <span className="mb-4 block font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-blue">
                Collections
              </span>
              <h2 className="text-4xl md:text-5xl">Shop by Category</h2>
            </div>
            <Link
              to="/shop"
              className="hidden items-center gap-2 font-bold text-brand-blue transition-colors hover:text-brand-gold md:flex"
            >
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.id}
                to={getShopCategoryPath(cat.name)}
                className="group relative block aspect-square overflow-hidden rounded-2xl shadow-lg outline-none transition-transform duration-300 ease-out hover:-translate-y-2 motion-reduce:transform-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                <OptimizedImage
                  src={cat.image}
                  displayWidth={IMG_WIDTHS.CARD}
                  quality={65}
                  priority={idx === 0}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/85 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="font-display text-2xl font-bold text-white md:text-3xl">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showBelowFold ? (
        <Suspense fallback={<div className="min-h-[40vh] bg-brand-bg" aria-hidden />}>
          <HomeBelowFold impact={impact} />
        </Suspense>
      ) : (
        <div className="min-h-[40vh] bg-brand-bg" aria-hidden />
      )}
    </div>
  );
};

export default Home;
