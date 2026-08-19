import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Recycle,
  Droplets,
  Leaf,
  Trash2,
  Instagram,
  ChevronRight,
  Wine,
  UserRound,
  Truck,
  BadgeCheck,
  Scissors,
  FlaskConical,
  Package,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard, MediaPartnersMarquee } from './components';
import { getVisibleProducts, CATEGORIES, INSTAGRAM_PROFILE_URL, getShopCategoryPath } from './constants';
import OptimizedImage from './OptimizedImage';
import { optimizedSrc, IMG_WIDTHS } from './image-utils';

const HERO_SLIDES = [
  'https://static.wixstatic.com/media/9356bd_c8da8f804c0040c6917734181d2df3df~mv2.jpeg',
  'https://static.wixstatic.com/media/9356bd_a9b37b9f80984ce6ad7158b2ffc20bca~mv2.jpeg',
  'https://static.wixstatic.com/media/9356bd_6d4b2e5ba5d24c67917bd840a5fc3f05~mv2.jpeg',
] as const;

const HERO_SLIDE_INTERVAL_MS = 6000;

function HeroBackgroundSlideshow({ reduceMotion }: { reduceMotion: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || HERO_SLIDES.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, HERO_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const slideSrc = useMemo(
    () => HERO_SLIDES.map((src) => optimizedSrc(src, IMG_WIDTHS.HERO, 75)),
    []
  );

  return (
    <div className="absolute inset-0 z-0" aria-hidden>
      {slideSrc.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt=""
          animate={{ opacity: reduceMotion ? (i === 0 ? 1 : 0) : i === activeIndex ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 h-full w-full object-cover"
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding={i === 0 ? 'sync' : 'async'}
          fetchPriority={i === 0 ? 'high' : undefined}
        />
      ))}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}

const UPCYCLE_STEPS: { step: number; title: string; description: string; Icon: LucideIcon }[] = [
  {
    step: 1,
    title: 'Origin: The Dump Bottle',
    description:
      'Every piece starts as a bottle left behind we intercept it before it becomes landfill.',
    Icon: Wine,
  },
  {
    step: 2,
    title: 'The Ragman',
    description: 'Local collectors recover glass from bars, cafés, and streets with care.',
    Icon: UserRound,
  },
  {
    step: 3,
    title: 'Resip Collection',
    description: 'Our trucks bring each batch safely to the workshop for the next chapter.',
    Icon: Truck,
  },
  {
    step: 4,
    title: 'Washing & Sanitizing',
    description: 'Deep wash and sanitization so every surface is spotless and food-safe.',
    Icon: Droplets,
  },
  {
    step: 5,
    title: 'Quality Check',
    description: 'Trained eyes inspect thickness, integrity, and feel before any cut.',
    Icon: BadgeCheck,
  },
  {
    step: 6,
    title: 'Cutting & Smoothing',
    description: 'Precision cutting edges and careful smoothing for a refined rim and silhouette.',
    Icon: Scissors,
  },
  {
    step: 7,
    title: 'Biochemical Treatment',
    description: 'A controlled finish that protects clarity and strength for everyday use.',
    Icon: FlaskConical,
  },
  {
    step: 8,
    title: 'Packaging with Care',
    description: 'Thoughtful, protective packing ready to travel without a scratch.',
    Icon: Package,
  },
  {
    step: 9,
    title: 'Delivered to Happy Families',
    description: 'From our bench to your table made to be loved for years.',
    Icon: Users,
  },
];

function UpcycleStepCard({
  step,
  reduceMotion,
}: {
  step: (typeof UPCYCLE_STEPS)[number];
  reduceMotion: boolean;
}) {
  const Icon = step.Icon;
  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-32px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group flex h-full flex-col rounded-2xl border border-brand-blue/10 bg-white p-5 shadow-sm transition-all duration-300 hover:border-brand-gold/50 hover:shadow-md md:p-6"
    >
      <div className="flex gap-4 md:gap-5">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold font-display text-base font-bold text-brand-blue shadow-sm">
            {step.step}
          </span>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
            <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            {step.step === 3 ? (
              <Recycle
                className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-brand-gold drop-shadow"
                strokeWidth={2}
                aria-hidden
              />
            ) : null}
          </div>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="font-display text-lg font-bold leading-snug text-charcoal md:text-xl">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{step.description}</p>
        </div>
      </div>
    </motion.article>
  );
}

const Home = () => {
  const reduceMotion = useReducedMotion();

  /* First six catalog products visuals align with site; tiles link to @resip_india on Instagram. */
  const instagramSpotlight = useMemo(
    () =>
      getVisibleProducts().slice(0, 6).map((p) => ({
        id: p.id,
        src: p.image,
        name: p.name,
        alt: `${p.name} ReSip India handcrafted glassware`,
      })),
    []
  );

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden" style={{ contentVisibility: 'visible' }}>
        <HeroBackgroundSlideshow reduceMotion={!!reduceMotion} />

        {/* Glass Reflection Overlay */}
        <div className="glass-reflection pointer-events-none absolute inset-0 z-10 opacity-30" />

        <div className="relative z-20 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="mb-6 inline-block font-display text-sm font-bold uppercase tracking-[0.4em] text-brand-gold">
              Sustainable Luxury
            </span>
            <h1 className="mb-8 text-5xl leading-[0.9] tracking-tighter text-white md:text-8xl">
              From Discarded Bottles to <span className="text-brand-gold italic">Designer</span> Glassware
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-white/80 md:text-xl">
              Handcrafted. Sustainable. Timeless. We reimagine waste into premium lifestyle pieces for the modern home.
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link to="/shop" className="group flex items-center gap-3 rounded-full bg-brand-blue px-10 py-5 text-lg font-bold text-white transition-all duration-500 hover:bg-brand-gold">
                Shop Now <ArrowRight size={20} className="transition-transform group-hover:translate-x-2 motion-reduce:transform-none" />
              </Link>
              <Link to="/gallery" className="flex items-center gap-3 border-b border-white/20 pb-1 text-lg font-bold text-white transition-colors hover:text-brand-gold">
                Gallery
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{
            y: reduceMotion ? 0 : [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: reduceMotion ? 0 : Infinity,
          }}
          className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-white/50"
          aria-hidden
        >
          <div className="mx-auto h-16 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-32 px-6 bg-brand-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-brand-blue font-display font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                Collections
              </span>
              <h2 className="text-4xl md:text-5xl">Shop by Category</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:text-brand-gold transition-colors">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={getShopCategoryPath(cat.name)}
                className="group relative block aspect-square overflow-hidden rounded-2xl shadow-lg outline-none transition-transform duration-300 ease-out hover:-translate-y-2 motion-reduce:transform-none motion-reduce:hover:translate-y-0 focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                <OptimizedImage
                  src={cat.image}
                  displayWidth={IMG_WIDTHS.CARD}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/85 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="mb-2 text-2xl font-bold text-white">{cat.name}</h3>
                  <span className="flex items-center gap-2 text-sm font-bold text-brand-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100">
                    Explore <ChevronRight size={16} aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-blue font-display font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              Curated Selection
            </span>
            <h2 className="text-4xl md:text-5xl mb-6">Featured Products</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getVisibleProducts().slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section nine steps, simple 1→9 flow */}
      <section
        id="process"
        className="border-t border-brand-blue/10 bg-gradient-to-b from-brand-bg via-white to-brand-bg py-32 px-6"
        aria-labelledby="process-heading"
      >
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
            <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
              Bottle to table
            </p>
            <h2 id="process-heading" className="mb-6 font-display text-4xl font-bold tracking-tight text-charcoal md:text-5xl lg:text-6xl">
              The art of <span className="text-brand-blue">upcycling</span>
            </h2>
            <p className="text-base font-light leading-relaxed text-charcoal/65 md:text-lg">
              Nine deliberate stages from the dump bottle to delivery so every glass earns its place in your home.
            </p>
          </header>

          <ol className="mx-auto grid max-w-6xl list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {UPCYCLE_STEPS.map((s) => (
              <li key={s.step} className="min-w-0">
                <UpcycleStepCard step={s} reduceMotion={!!reduceMotion} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-32 px-6 bg-brand-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-4xl md:text-5xl mb-6">Our <span className="text-brand-blue">Impact</span></h2>
              <p className="text-charcoal/60 font-light leading-relaxed">
                Sustainability isn't just a buzzword for us. It's the foundation of everything we build. Every glass you buy directly contributes to a cleaner planet.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-3xl border border-brand-blue/10 shadow-sm">
                <div className="text-brand-gold mb-4"><Recycle size={40} aria-hidden /></div>
                <h3 className="text-5xl font-display font-bold text-brand-blue mb-2">6,000+</h3>
                <p className="text-charcoal/50 uppercase tracking-widest text-xs font-bold">Bottle Upcycled</p>
              </div>
              <div className="bg-white p-10 rounded-3xl border border-brand-blue/10 shadow-sm">
                <div className="text-brand-gold mb-4"><Leaf size={40} aria-hidden /></div>
                <h3 className="text-5xl font-display font-bold text-brand-blue mb-2">204kg</h3>
                <p className="text-charcoal/50 uppercase tracking-widest text-xs font-bold">CO2 Reduce</p>
              </div>
              <div className="bg-white p-10 rounded-3xl border border-brand-blue/10 shadow-sm">
                <div className="text-brand-gold mb-4"><Droplets size={40} aria-hidden /></div>
                <h3 className="text-5xl font-display font-bold text-brand-blue mb-2">31,800 L</h3>
                <p className="text-charcoal/50 uppercase tracking-widest text-xs font-bold">Saved Water</p>
              </div>
              <div className="bg-white p-10 rounded-3xl border border-brand-blue/10 shadow-sm">
                <div className="text-brand-gold mb-4"><Trash2 size={40} aria-hidden /></div>
                <h3 className="text-5xl font-display font-bold text-brand-blue mb-2">2.5+ Tonnes</h3>
                <p className="text-charcoal/50 uppercase tracking-widest text-xs font-bold">Landfilled Diverted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Partners */}
      <section className="border-t border-brand-blue/10 bg-white py-24 px-6 md:py-28" aria-labelledby="media-partners-heading">
        <div className="mx-auto max-w-7xl">
          <header className="mb-12 text-center md:mb-16">
            <span className="mb-4 block font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-blue">
              As seen in
            </span>
            <h2 id="media-partners-heading" className="text-4xl md:text-5xl">
              Our Partners
            </h2>
            <div className="mx-auto mt-6 h-1 w-24 bg-brand-gold" aria-hidden />
            <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-charcoal/60">
              Proudly collaborating with brands and platforms that share our vision for sustainability.
            </p>
          </header>
          <MediaPartnersMarquee />
        </div>
      </section>

      {/* Instagram */}
      <section className="py-32 px-6 bg-white" aria-labelledby="instagram-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-16">
            <div>
              <p className="text-brand-gold font-display font-bold tracking-[0.25em] uppercase text-xs mb-3">
                Follow us
              </p>
              <h2 id="instagram-heading" className="text-3xl md:text-4xl font-bold">
                On Instagram
              </h2>
              <p className="mt-3 max-w-xl text-charcoal/60 font-light leading-relaxed">
                Real pours, studio shots, and new drops see everything on{' '}
                <a
                  href={INSTAGRAM_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-blue underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold"
                >
                  @resip_india
                </a>
                .
              </p>
            </div>
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-blue bg-white px-6 py-3 text-sm font-bold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              <Instagram size={20} aria-hidden /> Open Instagram profile
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {instagramSpotlight.map((item) => (
              <a
                key={item.id}
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square rounded-xl overflow-hidden group relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                aria-label={`See ${item.name} and more on @resip_india on Instagram`}
              >
                <OptimizedImage
                  src={item.src}
                  displayWidth={IMG_WIDTHS.THUMB}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-110 motion-reduce:group-hover:scale-100"
                />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-brand-blue/90 via-brand-blue/35 to-transparent px-3 pb-4 pt-14 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:group-hover:opacity-0">
                  <Instagram className="mb-2 shrink-0 text-white" size={22} aria-hidden />
                  <p className="w-full truncate text-center text-xs font-bold text-white drop-shadow-sm">{item.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-brand-blue text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 glass-reflection opacity-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl mb-8 leading-tight">Drink Better. <br /><span className="text-brand-gold">Waste Less.</span></h2>
          <p className="text-xl text-white/60 mb-12 font-light">Join the movement of conscious luxury. Elevate your drinking experience while protecting the planet.</p>
          <Link to="/shop" className="inline-block bg-white text-brand-blue px-12 py-6 rounded-full font-bold text-xl hover:bg-brand-gold hover:text-white transition-all duration-500">
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
