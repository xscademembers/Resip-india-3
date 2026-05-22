import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Play, X } from 'lucide-react';
import { GALLERY_IMAGES, GALLERY_VIDEOS } from './constants';
import OptimizedImage from './OptimizedImage';
import { cn } from './components';
import { IMG_WIDTHS } from './image-utils';

type GalleryTab = 'images' | 'videos';

type LightboxItem =
  | { type: 'image'; src: string; index: number }
  | { type: 'video'; src: string; index: number };

function GalleryLightbox({
  item,
  onClose,
  reduceMotion,
}: {
  item: LightboxItem;
  onClose: () => void;
  reduceMotion: boolean;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (item.type === 'video') {
      videoRef.current?.play().catch(() => undefined);
    }
  }, [item]);

  return (
    <motion.div
      key={`${item.type}-${item.index}`}
      role="dialog"
      aria-modal="true"
      aria-label={item.type === 'image' ? 'Full-screen image viewer' : 'Full-screen video player'}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_srgb,var(--color-charcoal)_92%,transparent)] p-4 md:p-8"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-24 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-gold)] md:right-8 md:top-28"
        aria-label="Close full-screen view"
      >
        <X size={22} aria-hidden />
      </button>

      <div
        className="flex max-h-[calc(100vh-128px)] max-w-full items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'image' ? (
          <img
            src={item.src}
            alt={`ReSip gallery photo ${item.index + 1}`}
            className="max-h-[calc(100vh-128px)] max-w-full object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          <video
            ref={videoRef}
            src={item.src}
            controls
            playsInline
            className="max-h-[calc(100vh-128px)] max-w-full rounded-lg bg-black"
            aria-label={`ReSip gallery video ${item.index + 1}`}
          />
        )}
      </div>
    </motion.div>
  );
}

function ImageTile({
  src,
  index,
  onOpen,
}: {
  src: string;
  index: number;
  onOpen: (item: LightboxItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen({ type: 'image', src, index })}
      className="group relative aspect-square overflow-hidden rounded-2xl border border-brand-blue/10 bg-white shadow-sm transition-all duration-300 hover:border-brand-gold/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-blue)]"
      aria-label={`View gallery photo ${index + 1} in full screen`}
    >
      <OptimizedImage
        src={src}
        displayWidth={IMG_WIDTHS.CARD}
        alt={`ReSip gallery photo ${index + 1}`}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </button>
  );
}

function VideoTile({
  src,
  index,
  onOpen,
}: {
  src: string;
  index: number;
  onOpen: (item: LightboxItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen({ type: 'video', src, index })}
      className="group relative aspect-square overflow-hidden rounded-2xl border border-brand-blue/10 bg-[color-mix(in_srgb,var(--color-brand-blue)_8%,var(--color-charcoal))] shadow-sm transition-all duration-300 hover:border-brand-gold/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-blue)]"
      aria-label={`Play gallery video ${index + 1} in full screen`}
    >
      <video
        src={src}
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color-mix(in_srgb,var(--color-charcoal)_35%,transparent)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--color-charcoal)_25%,transparent)]"
        aria-hidden
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-gold)] text-white shadow-lg">
          <Play size={24} fill="currentColor" className="ml-1" />
        </span>
      </span>
    </button>
  );
}

const Gallery = () => {
  const reduceMotion = useReducedMotion() ?? false;
  const [activeTab, setActiveTab] = useState<GalleryTab>('images');
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);

  const openLightbox = useCallback((item: LightboxItem) => {
    setLightboxItem(item);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxItem(null);
  }, []);

  const tabs: { id: GalleryTab; label: string }[] = [
    { id: 'images', label: 'Images' },
    { id: 'videos', label: 'Videos' },
  ];

  return (
    <div className="min-h-screen bg-brand-bg pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
            Visual stories
          </p>
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-charcoal md:text-5xl lg:text-6xl">
            <span className="text-brand-blue">Gallery</span>
          </h1>
          <p className="text-base font-light leading-relaxed text-charcoal/65 md:text-lg">
            Studio shots, pours, and behind-the-scenes moments from the ReSip workshop.
          </p>
        </header>

        <nav
          role="tablist"
          aria-label="Gallery media type"
          className="mx-auto mb-12 flex max-w-md justify-center gap-2 rounded-full border border-brand-blue/10 bg-white p-2 shadow-sm"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`gallery-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`gallery-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-1 items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-blue)]',
                  isActive
                    ? 'bg-brand-blue text-white'
                    : 'text-charcoal/70 hover:bg-brand-blue/5 hover:text-charcoal',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <section
          role="tabpanel"
          id={`gallery-panel-${activeTab}`}
          aria-labelledby={`gallery-tab-${activeTab}`}
          className="mx-auto"
        >
          {activeTab === 'images' ? (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {GALLERY_IMAGES.map((src, index) => (
                <li key={src}>
                  <ImageTile src={src} index={index} onOpen={openLightbox} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {GALLERY_VIDEOS.map((src, index) => (
                <li key={src}>
                  <VideoTile src={src} index={index} onOpen={openLightbox} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <AnimatePresence>
        {lightboxItem && (
          <GalleryLightbox
            item={lightboxItem}
            onClose={closeLightbox}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
