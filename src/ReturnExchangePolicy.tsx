import React from 'react';
import { Link } from 'react-router-dom';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_URL,
  RETURN_ADDRESS,
} from './constants';

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-brand-blue/10 bg-white p-8 shadow-sm md:p-10">
      <h2 className="mb-6 font-display text-2xl font-bold text-charcoal md:text-3xl">{title}</h2>
      <div className="space-y-4 text-base font-light leading-relaxed text-charcoal/75">{children}</div>
    </section>
  );
}

const ReturnExchangePolicy = () => {
  return (
    <article className="min-h-screen bg-brand-bg px-6 pb-32 pt-40">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 text-center">
          <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
            Customer care
          </p>
          <h1 className="text-4xl leading-tight md:text-5xl lg:text-6xl">
            Return &amp; Exchange <span className="text-brand-blue">Policy</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-charcoal/65 md:text-lg">
            At ReSip India, every product is handcrafted with care and attention. We strive to provide
            a smooth and transparent shopping experience for all our customers.
          </p>
          <div className="mx-auto mt-8 h-1 w-24 bg-brand-gold" aria-hidden />
        </header>

        <div className="space-y-8">
          <PolicySection title="1. Eligibility for Returns & Exchanges">
            <p>Return or exchange requests must be raised within 48 hours of delivery.</p>
            <p>Products must be:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Unused</li>
              <li>Unwashed</li>
              <li>Unworn</li>
              <li>In original packaging</li>
              <li>With all tags intact</li>
            </ul>
            <p>Exchanges are subject to product availability.</p>
            <p>International orders are not eligible for return or exchange.</p>
          </PolicySection>

          <PolicySection title="2. Prepaid Orders">
            <p>For prepaid orders, customers are eligible for:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Easy return or exchange within 48 hours of delivery.</li>
              <li>Free reverse pickup arranged by ReSip India.</li>
              <li>Full store credit after successful quality inspection.</li>
            </ul>
            <p>Even sale purchases receive the same customer support and assistance.</p>
            <p className="rounded-2xl border border-brand-blue/10 bg-brand-bg px-6 py-4 text-sm text-charcoal/70">
              <strong className="font-bold text-charcoal">Note:</strong> If the return or exchange is
              requested for reasons other than an error from our side, shipping charges may be borne
              by the customer.
            </p>
          </PolicySection>

          <PolicySection title="3. Cash on Delivery (COD) Orders">
            <p>COD orders are eligible for return or exchange only in cases of:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Wrong item received</li>
              <li>Damaged product</li>
              <li>Size issue from our side</li>
            </ul>
            <p className="font-bold text-charcoal">Additional conditions:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Sale items are eligible only for size exchange.</li>
              <li>Customers must self-ship the product to our return address.</li>
              <li>Store credit or exchange will be processed after quality inspection.</li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Non-Returnable Items">
            <p>The following are not eligible for return or refund:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>International orders</li>
              <li>Used or washed products</li>
              <li>Products without tags or original packaging</li>
              <li>Requests raised after 48 hours of delivery</li>
            </ul>
          </PolicySection>

          <PolicySection title="5. How to Request a Return or Exchange">
            <p>Customers can contact ReSip India through:</p>
            <ul className="space-y-3 pl-0">
              <li>
                <strong className="font-bold text-charcoal">WhatsApp:</strong>{' '}
                <a
                  href={CONTACT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-blue underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold"
                >
                  {CONTACT_PHONE}
                </a>
              </li>
              <li>
                <strong className="font-bold text-charcoal">Email:</strong>{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-bold text-brand-blue underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            <p>Please include:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Order ID</li>
              <li>Delivery address</li>
              <li>Contact details</li>
              <li>Requested size (if applicable)</li>
              <li>Reason for return or exchange</li>
            </ul>
          </PolicySection>

          <PolicySection title="6. Refunds / Store Credit">
            <p>
              Once the returned product passes quality inspection, store credit or exchange will be
              processed.
            </p>
            <p>
              Refund timelines may vary depending on payment method and processing timelines.
            </p>
          </PolicySection>

          <PolicySection title="7. Return Address">
            <address className="not-italic">
              <p className="font-bold text-charcoal">ReSip India</p>
              <p className="mt-2">{RETURN_ADDRESS}</p>
              <p className="mt-4">
                <strong className="font-bold text-charcoal">Contact:</strong>{' '}
                <a href={CONTACT_PHONE_TEL} className="text-brand-blue hover:text-brand-gold">
                  {CONTACT_PHONE}
                </a>
              </p>
            </address>
          </PolicySection>
        </div>

        <p className="mt-12 text-center text-sm text-charcoal/50">
          Questions?{' '}
          <Link to="/contact" className="font-bold text-brand-blue hover:text-brand-gold">
            Contact us
          </Link>
        </p>
      </div>
    </article>
  );
};

export default ReturnExchangePolicy;
