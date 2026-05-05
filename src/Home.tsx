import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Recycle,
  Award,
  Droplets,
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
import { BeforeAfterSlider, ProductCard } from './components';
import { PRODUCTS, CATEGORIES, INSTAGRAM_PROFILE_URL } from './constants';

const UPCYCLE_STEPS: { step: number; title: string; description: string; Icon: LucideIcon }[] = [
  {
    step: 1,
    title: 'Origin: The Dump Bottle',
    description:
      'Every piece starts as a bottle left behind—we intercept it before it becomes landfill.',
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
    description: 'Thoughtful, protective packing—ready to travel without a scratch.',
    Icon: Package,
  },
  {
    step: 9,
    title: 'Delivered to Happy Families',
    description: 'From our bench to your table—made to be loved for years.',
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
  const heroSlides = useMemo(
    () => [
      {
        src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1920',
        alt: 'Handcrafted glassware hero slide',
      },
      {
        src: 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?auto=format&fit=crop&q=80&w=1920',
        alt: 'Upcycled glasses hero slide',
      },
      {
        src: 'https://images.unsplash.com/photo-1528823872057-9c018a7f07f9?auto=format&fit=crop&q=80&w=1920',
        alt: 'Premium glassware hero slide',
      },
    ],
    []
  );

  /* First six catalog products — visuals align with site; tiles link to @resip_india on Instagram. */
  const instagramSpotlight = useMemo(
    () =>
      PRODUCTS.slice(0, 6).map((p) => ({
        id: p.id,
        src: p.image,
        name: p.name,
        alt: `${p.name} — ReSip India handcrafted glassware`,
      })),
    []
  );

  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const goToHeroSlide = (index: number) => {
    const clamped = ((index % heroSlides.length) + heroSlides.length) % heroSlides.length;
    setActiveHeroSlide(clamped);
  };

  const goToNextHeroSlide = () => goToHeroSlide(activeHeroSlide + 1);
  const goToPrevHeroSlide = () => goToHeroSlide(activeHeroSlide - 1);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const id = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(id);
  }, [heroSlides.length, prefersReducedMotion]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroSlides[activeHeroSlide]?.src}
              src={heroSlides[activeHeroSlide]?.src}
              alt={heroSlides[activeHeroSlide]?.alt}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-brand-blue/45" />
        </div>

        {/* Glass Reflection Overlay */}
        <div className="absolute inset-0 glass-reflection opacity-30 z-10 pointer-events-none" />

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block text-brand-gold font-display font-bold tracking-[0.4em] uppercase text-sm mb-6">
              Sustainable Luxury
            </span>
            <h1 className="text-5xl md:text-8xl text-white mb-8 leading-[0.9] tracking-tighter">
              From Discarded Bottles to <span className="text-brand-gold italic">Designer</span> Glassware
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-12 font-light max-w-2xl mx-auto">
              Handcrafted. Sustainable. Timeless. We reimagine waste into premium lifestyle pieces for the modern home.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/shop" className="group bg-brand-blue text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-gold transition-all duration-500 flex items-center gap-3">
                Shop Now <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <a href="#process" className="text-white font-bold text-lg hover:text-brand-gold transition-colors flex items-center gap-3 border-b border-white/20 pb-1">
                Our Process
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{
            y: prefersReducedMotion ? 0 : [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: prefersReducedMotion ? 0 : Infinity,
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent mx-auto" />
        </motion.div>

        {/* Hero Slider Controls (Bottom Right) */}
        <div className="absolute bottom-8 right-8 z-30 flex items-center gap-4">
          <button
            type="button"
            onClick={goToPrevHeroSlide}
            aria-label="Previous slide"
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="mx-auto rotate-180" size={20} />
          </button>

          <div className="flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToHeroSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeHeroSlide ? 'true' : undefined}
                className={[
                  'h-2.5 rounded-full transition-all',
                  i === activeHeroSlide ? 'w-8 bg-brand-gold' : 'w-2.5 bg-white/50 hover:bg-white/70',
                ].join(' ')}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNextHeroSlide}
            aria-label="Next slide"
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="mx-auto" size={20} />
          </button>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-blue font-display font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              The Signature Experience
            </span>
            <h2 className="text-4xl md:text-6xl mb-8 leading-tight">
              Waste. <br /><span className="text-brand-blue">Reimagined.</span>
            </h2>
            <p className="text-lg text-charcoal/70 mb-10 leading-relaxed font-light">
              Every piece at Resip India tells a story of transformation. We take what the world discards and apply artisanal craftsmanship to create something truly exceptional.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-blue shrink-0">
                  <Recycle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Eco-Conscious</h4>
                  <p className="text-charcoal/60 text-sm">Reducing landfill waste one bottle at a time.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-blue shrink-0">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Premium Quality</h4>
                  <p className="text-charcoal/60 text-sm">Fire-polished edges and weighted bases for a luxury feel.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <BeforeAfterSlider 
              before="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800"
              after="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800"
            />
          </motion.div>
        </div>
      </section>

      {/* Process Section — nine steps, simple 1→9 flow */}
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
              Nine deliberate stages—from the dump bottle to delivery—so every glass earns its place in your home.
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
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative block aspect-square overflow-hidden rounded-2xl shadow-lg outline-none transition-transform duration-300 ease-out hover:-translate-y-2 motion-reduce:transform-none motion-reduce:hover:translate-y-0 focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  referrerPolicy="no-referrer"
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
            {PRODUCTS.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
                <div className="text-brand-gold mb-4"><Recycle size={40} /></div>
                <h3 className="text-5xl font-display font-bold text-brand-blue mb-2">50,000+</h3>
                <p className="text-charcoal/50 uppercase tracking-widest text-xs font-bold">Bottles Recycled</p>
              </div>
              <div className="bg-white p-10 rounded-3xl border border-brand-blue/10 shadow-sm">
                <div className="text-brand-gold mb-4"><Droplets size={40} /></div>
                <h3 className="text-5xl font-display font-bold text-brand-blue mb-2">12 Tons</h3>
                <p className="text-charcoal/50 uppercase tracking-widest text-xs font-bold">Waste Diverted</p>
              </div>
            </div>
          </div>
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
                Real pours, studio shots, and new drops — see everything on{' '}
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
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-110 motion-reduce:group-hover:scale-100"
                  referrerPolicy="no-referrer"
                  loading="lazy"
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
