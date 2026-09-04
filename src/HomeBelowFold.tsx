import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Recycle,
  Droplets,
  Leaf,
  Trash2,
  Instagram,
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
import { getVisibleProducts, INSTAGRAM_PROFILE_URL } from './constants';
import OptimizedImage from './OptimizedImage';
import { IMG_WIDTHS } from './image-utils';

export type ImpactStats = {
  bottlesValue: string;
  bottlesLabel: string;
  co2Value: string;
  co2Label: string;
  waterValue: string;
  waterLabel: string;
  landfillValue: string;
  landfillLabel: string;
};

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

export default function HomeBelowFold({ impact }: { impact: ImpactStats }) {
  const reduceMotion = useReducedMotion();

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

  const featured = useMemo(() => getVisibleProducts().slice(0, 4), []);

  return (
    <>
      <section className="bg-white px-6 py-24 md:py-32" style={{ contentVisibility: 'auto' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center md:mb-20">
            <span className="mb-4 block font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-blue">
              Curated Selection
            </span>
            <h2 className="mb-6 text-4xl md:text-5xl">Featured Products</h2>
            <div className="mx-auto h-1 w-24 bg-brand-gold" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="process"
        className="border-t border-brand-blue/10 bg-gradient-to-b from-brand-bg via-white to-brand-bg px-6 py-24 md:py-32"
        aria-labelledby="process-heading"
        style={{ contentVisibility: 'auto' }}
      >
        <div className="mx-auto max-w-7xl">
          <header className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
            <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
              Bottle to table
            </p>
            <h2
              id="process-heading"
              className="mb-6 font-display text-4xl font-bold tracking-tight text-charcoal md:text-5xl lg:text-6xl"
            >
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

      <section className="relative overflow-hidden bg-brand-bg px-6 py-24 md:py-32" style={{ contentVisibility: 'auto' }}>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h2 className="mb-6 text-4xl md:text-5xl">
                Our <span className="text-brand-blue">Impact</span>
              </h2>
              <p className="font-light leading-relaxed text-charcoal/60">
                Sustainability isn't just a buzzword for us. It's the foundation of everything we build. Every glass
                you buy directly contributes to a cleaner planet.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2">
              <div className="rounded-3xl border border-brand-blue/10 bg-white p-10 shadow-sm">
                <div className="mb-4 text-brand-gold">
                  <Recycle size={40} aria-hidden />
                </div>
                <h3 className="mb-2 font-display text-5xl font-bold text-brand-blue">{impact.bottlesValue}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">{impact.bottlesLabel}</p>
              </div>
              <div className="rounded-3xl border border-brand-blue/10 bg-white p-10 shadow-sm">
                <div className="mb-4 text-brand-gold">
                  <Leaf size={40} aria-hidden />
                </div>
                <h3 className="mb-2 font-display text-5xl font-bold text-brand-blue">{impact.co2Value}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">{impact.co2Label}</p>
              </div>
              <div className="rounded-3xl border border-brand-blue/10 bg-white p-10 shadow-sm">
                <div className="mb-4 text-brand-gold">
                  <Droplets size={40} aria-hidden />
                </div>
                <h3 className="mb-2 font-display text-5xl font-bold text-brand-blue">{impact.waterValue}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">{impact.waterLabel}</p>
              </div>
              <div className="rounded-3xl border border-brand-blue/10 bg-white p-10 shadow-sm">
                <div className="mb-4 text-brand-gold">
                  <Trash2 size={40} aria-hidden />
                </div>
                <h3 className="mb-2 font-display text-5xl font-bold text-brand-blue">{impact.landfillValue}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">{impact.landfillLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-t border-brand-blue/10 bg-white px-6 py-24 md:py-28"
        aria-labelledby="media-partners-heading"
        style={{ contentVisibility: 'auto' }}
      >
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

      <section className="bg-white px-6 py-24 md:py-32" aria-labelledby="instagram-heading" style={{ contentVisibility: 'auto' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-16">
            <div>
              <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">Follow us</p>
              <h2 id="instagram-heading" className="text-3xl font-bold md:text-4xl">
                On Instagram
              </h2>
              <p className="mt-3 max-w-xl font-light leading-relaxed text-charcoal/60">
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {instagramSpotlight.map((item) => (
              <a
                key={item.id}
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                aria-label={`See ${item.name} and more on @resip_india on Instagram`}
              >
                <OptimizedImage
                  src={item.src}
                  displayWidth={IMG_WIDTHS.THUMB}
                  quality={60}
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

      <section className="relative overflow-hidden bg-brand-blue px-6 py-24 text-center text-white md:py-32">
        <div className="pointer-events-none absolute inset-0 glass-reflection opacity-10" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-8 text-5xl leading-tight md:text-7xl">
            Drink Better. <br />
            <span className="text-brand-gold">Waste Less.</span>
          </h2>
          <p className="mb-12 text-xl font-light text-white/60">
            Join the movement of conscious luxury. Elevate your drinking experience while protecting the planet.
          </p>
          <Link
            to="/shop"
            className="inline-block rounded-full bg-white px-12 py-6 text-xl font-bold text-brand-blue transition-all duration-500 hover:bg-brand-gold hover:text-white"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </>
  );
}
