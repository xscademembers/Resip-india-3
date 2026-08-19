import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BeforeAfterSlider } from './components';
import OptimizedImage from './OptimizedImage';
import { optimizedSrc, IMG_WIDTHS } from './image-utils';

const FOUNDER_IMAGE =
  'https://static.wixstatic.com/media/9356bd_056570f4881f46918db118d36f4bc82e~mv2.png';

const WORKSHOP_BEFORE =
  'https://static.wixstatic.com/media/9356bd_46a0b0d3228c424b878fc1861ebe1b98~mv2.jpeg';
const WORKSHOP_AFTER =
  'https://static.wixstatic.com/media/9356bd_2020ef2c27744d69909d387e222958a0~mv2.png';

const ARTISANS = [
  {
    id: '01',
    name: 'Mrs. Manda Lanjewar',
    role: 'Segregation & Cleaning',
    image:
      'https://static.wixstatic.com/media/9356bd_bab8755b17374bce8689a7a356fc0dba~mv2.jpeg',
    description:
      'The process begins with our first artisan, who carefully segregates collected bottles based on brand, shape, size, and color. Each bottle is then thoroughly washed and cleaned to prepare it for the upcycling journey.',
  },
  {
    id: '02',
    name: 'Mr. Ankush Borkar',
    role: 'Cutting & Shaping',
    image:
      'https://static.wixstatic.com/media/9356bd_14371afc05204fd58a7578165332d9b9~mv2.jpeg',
    description:
      'The second artisan precisely cuts the bottles using specialised cutting machines. After cutting, every piece is sent through the lap machine process to remove roughness and prepare the glass for edge finishing.',
  },
  {
    id: '03',
    name: 'Mrs. Varsha Kamble',
    role: 'Edge Finishing',
    image:
      'https://static.wixstatic.com/media/9356bd_82ccf3a77cd249edb25ca282b19db15b~mv2.jpeg',
    description:
      'The third artisan focuses on creating smooth and safe rims. Every glass is carefully polished to ensure the edges are clean, refined, and comfortable to use while maintaining a premium finish.',
  },
] as const;

const FOUNDER_STORY = [
  'ReSip India was born from a desire to create meaningful change. After working in Business Development, I felt a strong pull to do something impactful for my community and the environment. While studying Hotel Management, I envisioned creating local jobs and promoting sustainability, but my career path took me in different directions.',
  'The turning point came during a casual evening with friends, where I noticed the staggering number of glass bottles discarded by hotels. This sparked a realisation that entrepreneurship isn\'t just for graduates from top-tier colleges; it\'s for anyone with a vision.',
  'At ReSip India, our mission is simple yet powerful: we upcycle waste glass bottles into useful products, protect our environment, and generate employment in my village. ReSip India is about transforming everyday problems into opportunities and proving that anyone can build a business that creates positive change. We hope our journey inspires others to believe in themselves and make a difference.',
];

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  accent: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
  headingId?: string;
};

function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  light = false,
  headingId,
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <header className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-xl'}>
      <p
        className={`mb-3 font-display text-xs font-bold uppercase tracking-[0.28em] ${
          light ? 'text-brand-gold' : 'text-brand-blue'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        id={headingId}
        className={`text-3xl leading-tight md:text-4xl lg:text-5xl ${
          light ? 'text-white' : 'text-charcoal'
        }`}
      >
        {title}{' '}
        <span className={light ? 'text-brand-gold' : 'text-brand-blue'}>{accent}</span>
      </h2>
      <div
        className={`mt-6 h-1 w-16 bg-brand-gold ${centered ? 'mx-auto' : ''}`}
        aria-hidden
      />
      {description ? (
        <p
          className={`mt-6 text-base font-light leading-relaxed md:text-lg ${
            light ? 'text-white/70' : 'text-charcoal/65'
          }`}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}

const About = () => {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-48px' },
          transition: { duration: 0.55, delay, ease: 'easeOut' as const },
        };

  return (
    <div className="overflow-hidden bg-brand-bg">
      {/* Page intro */}
      <section className="border-b border-brand-blue/10 bg-white px-6 pt-40 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.32em] text-brand-gold">
            Upcycling with a cause
          </p>
          <h1 className="text-4xl tracking-tight md:text-5xl lg:text-6xl">
            About <span className="text-brand-blue">Us</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-charcoal/65 md:text-lg">
            The people, place, and craft behind every ReSip piece from a founder&apos;s vision to
            the hands that shape each bottle.
          </p>
        </div>
      </section>

      {/* About Founders */}
      <section className="px-6 py-24 md:py-32" aria-labelledby="founders-heading">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-24">
            <motion.div {...fadeUp()} className="lg:col-span-6 lg:pt-8">
              <SectionHeader
                eyebrow="Our story"
                title="About"
                accent="Founders"
                headingId="founders-heading"
              />
              <p className="mt-8 font-display text-2xl font-bold text-brand-blue md:text-3xl">
                Vaibhav Pakhmode
              </p>
              <div className="mt-8 space-y-6 text-base font-light leading-relaxed text-charcoal/70 md:text-lg">
                {FOUNDER_STORY.slice(0, 2).map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
              <blockquote className="mt-10 rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm md:p-8">
                <p className="text-base font-light leading-relaxed text-charcoal/75 md:text-lg">
                  {FOUNDER_STORY[2]}
                </p>
              </blockquote>
            </motion.div>

            <motion.div
              {...fadeUp(0.1)}
              className="relative lg:col-span-6 lg:col-start-7"
            >
              <div
                className="absolute -right-4 -top-4 -z-10 hidden h-full w-full rounded-3xl bg-brand-gold/20 lg:block"
                aria-hidden
              />
              <div className="overflow-hidden rounded-3xl bg-charcoal p-6 shadow-xl ring-1 ring-brand-blue/10 md:p-8">
                <OptimizedImage
                  src={FOUNDER_IMAGE}
                  displayWidth={IMG_WIDTHS.DETAIL}
                  alt="Vaibhav Pakhmode, founder of ReSip India"
                  className="mx-auto aspect-[3/4] w-full max-w-sm object-contain object-bottom lg:max-w-none"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Workshop */}
      <section
        className="border-y border-brand-blue/10 bg-white px-6 py-24 md:py-32"
        aria-labelledby="workshop-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-16">
            <motion.div {...fadeUp()} className="order-2 lg:order-1 lg:col-span-7">
              <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-brand-blue/10">
                <BeforeAfterSlider
                  before={optimizedSrc(WORKSHOP_BEFORE, IMG_WIDTHS.HERO)}
                  after={optimizedSrc(WORKSHOP_AFTER, IMG_WIDTHS.HERO)}
                  beforeLabel="Before"
                  afterLabel="After"
                />
              </div>
              <p className="mt-4 text-center text-xs font-medium uppercase tracking-widest text-charcoal/45">
                Drag the slider to compare
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.1)} className="order-1 lg:order-2 lg:col-span-5">
              <SectionHeader
                eyebrow="Where it happens"
                title="Our"
                accent="Workshop"
                headingId="workshop-heading"
              />
              <div className="mt-10 space-y-6">
                <p className="text-base font-light leading-relaxed text-charcoal/70 md:text-lg">
                  In our village workshop, discarded glass bottles arrive as waste and leave as
                  refined, usable products. What you see in the comparison above is where we
                  started a modest space built with purpose and how that same ground now holds
                  a thriving hub of upcycling, local employment, and craft.
                </p>
                <p className="text-base font-light leading-relaxed text-charcoal/70 md:text-lg">
                  Every beam, every bench, and every bottle processed here represents a commitment
                  to turning environmental challenge into community opportunity one piece of
                  glass at a time.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Artisans */}
      <section
        className="bg-brand-blue-deep px-6 py-24 text-white md:py-32"
        aria-labelledby="artisans-heading"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp()} className="mb-16 md:mb-24">
            <SectionHeader
              eyebrow="The hands behind every piece"
              title="Our"
              accent="Artisans"
              description="Three skilled craftspeople guide each bottle through segregation, cutting, and finishing the heart of every ReSip product."
              align="center"
              light
              headingId="artisans-heading"
            />
          </motion.div>

          <ul className="grid list-none grid-cols-1 gap-16 p-0 md:grid-cols-3 md:gap-0">
            {ARTISANS.map((artisan, index) => (
              <motion.li
                key={artisan.id}
                {...fadeUp(index * 0.08)}
                className={`flex flex-col md:px-8 ${
                  index > 0 ? 'md:border-l md:border-white/15' : ''
                } ${index === 0 ? 'md:pl-0' : ''} ${index === ARTISANS.length - 1 ? 'md:pr-0' : ''}`}
              >
                <div className="mb-8 overflow-hidden rounded-2xl bg-black/20 ring-1 ring-white/10">
                  <OptimizedImage
                    src={artisan.image}
                    displayWidth={IMG_WIDTHS.CARD}
                    alt={`${artisan.name} ${artisan.role}`}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 motion-reduce:transition-none motion-reduce:hover:scale-100 hover:scale-[1.02]"
                  />
                </div>
                <p className="mb-2 font-display text-[11px] font-bold uppercase tracking-[0.28em] text-brand-gold">
                  {artisan.role}
                </p>
                <h3 className="mb-4 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {artisan.name}
                </h3>
                <p className="text-sm font-light leading-relaxed text-white/75 md:text-base">
                  {artisan.description}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;
