import React from 'react';
import { Link } from 'react-router-dom';

const CARE_GUIDELINES = [
  'Hand wash recommended for most products to maintain finish and durability.',
  'Use mild liquid soap and a soft sponge or cloth.',
  'Avoid using abrasive scrubbers, steel wool, or harsh chemicals.',
  'Handle carefully, as handcrafted glass may have natural variations and should be treated gently.',
  'Some products are top-rack dishwasher safe, but hand washing is still preferred for longer life.',
  'Do not expose the glasses to sudden extreme temperature changes (e.g., pouring boiling liquid into cold glass).',
  'Store in a dry place and avoid stacking heavily to prevent scratches or chips.',
] as const;

const CareInstructions = () => {
  return (
    <article className="min-h-screen bg-brand-bg px-6 pb-32 pt-40">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 text-center">
          <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
            Product care
          </p>
          <h1 className="text-4xl leading-tight md:text-5xl lg:text-6xl">
            Care Instructions for <span className="text-brand-blue">ReSip India</span> Products
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-charcoal/65 md:text-lg">
            To keep your handmade upcycled glassware looking beautiful and long-lasting, follow these
            care guidelines for products from ReSip India.
          </p>
          <div className="mx-auto mt-8 h-1 w-24 bg-brand-gold" aria-hidden />
        </header>

        <section className="rounded-3xl border border-brand-blue/10 bg-white p-8 shadow-sm md:p-10">
          <h2 className="sr-only">Care guidelines</h2>
          <ul className="space-y-4">
            {CARE_GUIDELINES.map((item) => (
              <li
                key={item}
                className="flex gap-4 text-base font-light leading-relaxed text-charcoal/75"
              >
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-gold"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-2xl border border-brand-blue/10 bg-brand-bg px-6 py-4 text-base font-light leading-relaxed text-charcoal/75">
            Because ReSip India products are handmade from upcycled bottles, each piece may have
            slight variations in colour, texture, or shape; this is part of their unique artisanal
            character.
          </p>
        </section>

        <p className="mt-12 text-center text-sm text-charcoal/50">
          Need help with an order?{' '}
          <Link to="/returns-exchange" className="font-bold text-brand-blue hover:text-brand-gold">
            View our return policy
          </Link>
          {' · '}
          <Link to="/contact" className="font-bold text-brand-blue hover:text-brand-gold">
            Contact us
          </Link>
        </p>
      </div>
    </article>
  );
};

export default CareInstructions;
