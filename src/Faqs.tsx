import React from 'react';
import { Link } from 'react-router-dom';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_URL,
} from './constants';

const FAQ_ITEMS = [
  {
    question: 'What is ReSip India?',
    answer:
      'ReSip India is a sustainable lifestyle brand that transforms discarded glass bottles into handcrafted drinkware and home décor products. The brand focuses on eco-friendly craftsmanship and upcycling.',
  },
  {
    question: 'Are ReSip India products handmade?',
    answer:
      'Yes. Every product is handcrafted by skilled artisans, making each piece unique with slight variations in shape, texture, or finish.',
  },
  {
    question: 'What materials are used in ReSip India products?',
    answer:
      'Most products are made from upcycled glass bottles that are carefully cleaned, cut, polished, and redesigned into reusable lifestyle products.',
  },
  {
    question: 'Are the glasses safe for daily use?',
    answer:
      'Yes. ReSip India glassware is designed for regular use and finished with smooth edges for safe handling.',
  },
  {
    question: 'Are the products dishwasher safe?',
    answer:
      'Some products may be top-rack dishwasher safe, but hand washing is recommended to maintain durability and finish for longer use.',
  },
  {
    question: 'How should I clean my ReSip India products?',
    answer:
      'Use mild soap, lukewarm water, and a soft sponge or cloth. Avoid harsh scrubbers or abrasive cleaners.',
  },
  {
    question: 'Do you offer customization?',
    answer:
      'Yes. ReSip India offers customization on request for gifting, events, cafés, restaurants, and bulk orders.',
  },
  {
    question: 'Do you ship across India?',
    answer: 'Yes. ReSip India offers PAN-India delivery.',
  },
  {
    question: 'Is free shipping available?',
    answer:
      'Yes. Free shipping is available on eligible orders above the minimum cart value mentioned on the website (₹999 on prepaid orders).',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Delivery timelines may vary depending on the location, but most orders are delivered within standard courier timelines after dispatch.',
  },
  {
    question: 'Can I return or exchange a product?',
    answer:
      'Returns or exchanges are generally accepted only for damaged or incorrect items. Customers should contact support with order details for assistance.',
  },
  {
    question: 'What should I do if my product arrives damaged?',
    answer:
      'Please contact customer support within 24–48 hours of delivery with photos of the damaged product and your order details.',
  },
  {
    question: 'How can I contact ReSip India?',
    answer: 'contact',
  },
  {
    question: 'Where is ReSip India located?',
    answer: 'Lakhani, Dist- Bhandara, Maharashtra, India.',
  },
  {
    question: 'Why choose upcycled glassware?',
    answer:
      'Upcycled products help reduce landfill waste, encourage sustainable living, and support environmentally responsible craftsmanship.',
  },
] as const;

function FaqAnswer({ item }: { item: (typeof FAQ_ITEMS)[number] }) {
  if (item.answer !== 'contact') {
    return <p>{item.answer}</p>;
  }

  return (
    <>
      <p>You can reach ReSip India through:</p>
      <ul className="space-y-2 pl-0">
        <li>
          <strong className="font-bold text-charcoal">Email:</strong>{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-bold text-brand-blue underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold"
          >
            {CONTACT_EMAIL}
          </a>
        </li>
        <li>
          <strong className="font-bold text-charcoal">Phone:</strong>{' '}
          <a
            href={CONTACT_PHONE_TEL}
            className="font-bold text-brand-blue underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold"
          >
            {CONTACT_PHONE}
          </a>
          {' · '}
          <a
            href={CONTACT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-blue underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold"
          >
            WhatsApp
          </a>
        </li>
      </ul>
    </>
  );
}

const Faqs = () => {
  return (
    <article className="min-h-screen bg-brand-bg px-6 pb-32 pt-40">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 text-center">
          <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
            Help centre
          </p>
          <h1 className="text-4xl leading-tight md:text-5xl lg:text-6xl">
            Frequently Asked <span className="text-brand-blue">Questions</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-charcoal/65 md:text-lg">
            Quick answers about ReSip India products, shipping, care, and support.
          </p>
          <div className="mx-auto mt-8 h-1 w-24 bg-brand-gold" aria-hidden />
        </header>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={item.question}
              className="group rounded-3xl border border-brand-blue/10 bg-white shadow-sm open:shadow-md motion-reduce:open:shadow-sm"
              {...(index === 0 ? { open: true } : {})}
            >
              <summary className="cursor-pointer list-none px-8 py-6 font-display text-lg font-bold text-charcoal marker:content-none md:text-xl [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="mr-2 text-brand-gold">{index + 1}.</span>
                    {item.question}
                  </span>
                  <span
                    className="mt-1 shrink-0 text-brand-blue transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none motion-reduce:group-open:rotate-0"
                    aria-hidden
                  >
                    ▾
                  </span>
                </span>
              </summary>
              <div className="space-y-4 border-t border-brand-blue/10 px-8 pb-8 pt-4 text-base font-light leading-relaxed text-charcoal/75">
                <FaqAnswer item={item} />
              </div>
            </details>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-charcoal/50">
          <Link to="/shipping-policy" className="font-bold text-brand-blue hover:text-brand-gold">
            Shipping policy
          </Link>
          {' · '}
          <Link to="/returns-exchange" className="font-bold text-brand-blue hover:text-brand-gold">
            Returns &amp; exchanges
          </Link>
          {' · '}
          <Link to="/care-instructions" className="font-bold text-brand-blue hover:text-brand-gold">
            Care instructions
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

export default Faqs;
