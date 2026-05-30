import React from 'react';
import { Link } from 'react-router-dom';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_URL,
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

const DELIVERY_ESTIMATES = [
  { location: 'Metro Cities', time: '3–5 business days' },
  { location: 'Other Cities & Towns', time: '3–7 business days' },
  { location: 'Remote/Rural Areas', time: '5–10 business days' },
] as const;

const ShippingPolicy = () => {
  return (
    <article className="min-h-screen bg-brand-bg px-6 pb-32 pt-40">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 text-center">
          <p className="mb-4 font-display text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
            Customer care
          </p>
          <h1 className="text-4xl leading-tight md:text-5xl lg:text-6xl">
            Shipping <span className="text-brand-blue">Policy</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-charcoal/65 md:text-lg">
            At ReSip India, we are committed to delivering your orders safely and on time across
            India. Please read our shipping policy carefully before placing an order.
          </p>
          <div className="mx-auto mt-8 h-1 w-24 bg-brand-gold" aria-hidden />
        </header>

        <div className="space-y-8">
          <PolicySection title="1. Shipping Coverage">
            <p>
              We currently ship to most serviceable pin codes across India. Delivery availability
              depends on courier partner coverage in your area.
            </p>
          </PolicySection>

          <PolicySection title="2. Order Processing Time">
            <ul className="list-disc space-y-2 pl-6">
              <li>Orders are typically processed within 1–2 business days after payment confirmation.</li>
              <li>Orders placed on Sundays or public holidays will be processed on the next working day.</li>
              <li>Customized or bulk orders may require additional processing time.</li>
            </ul>
          </PolicySection>

          <PolicySection title="3. Estimated Delivery Time">
            <p>Estimated delivery timelines after dispatch:</p>
            <div className="overflow-x-auto rounded-2xl border border-brand-blue/10">
              <table className="w-full min-w-[280px] text-left text-sm md:text-base">
                <thead>
                  <tr className="border-b border-brand-blue/10 bg-brand-bg">
                    <th scope="col" className="px-6 py-4 font-bold text-charcoal">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-4 font-bold text-charcoal">
                      Delivery Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DELIVERY_ESTIMATES.map((row) => (
                    <tr key={row.location} className="border-b border-brand-blue/10 last:border-b-0">
                      <td className="px-6 py-4">{row.location}</td>
                      <td className="px-6 py-4">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Delivery timelines may vary due to weather conditions, courier delays, festivals, or
              unforeseen circumstances.
            </p>
          </PolicySection>

          <PolicySection title="4. Shipping Charges">
            <ul className="list-disc space-y-2 pl-6">
              <li>Free shipping on prepaid orders above ₹999.</li>
              <li>A standard shipping fee may apply to orders below the free shipping threshold.</li>
              <li>Cash on Delivery (COD), if available, may include an additional handling fee.</li>
            </ul>
            <p>
              Shipping charges, if applicable, will be displayed at checkout before payment
              confirmation.
            </p>
          </PolicySection>

          <PolicySection title="5. Order Tracking">
            <p>Once your order is shipped, you will receive:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>A shipping confirmation via email/SMS</li>
              <li>Tracking details and courier information</li>
            </ul>
            <p>Customers can track their shipment using the tracking link provided.</p>
          </PolicySection>

          <PolicySection title="6. Delivery Attempts">
            <p>Our courier partners usually make multiple delivery attempts. If the package is undelivered due to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Incorrect shipping address</li>
              <li>Unreachable contact number</li>
              <li>Customer unavailable at delivery</li>
            </ul>
            <p>the shipment may be returned to us. Re-shipping charges may apply in such cases.</p>
          </PolicySection>

          <PolicySection title="7. Damaged or Missing Items">
            <p>If you receive a damaged package or if items are missing:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Contact us within 48 hours of delivery</li>
              <li>Share clear photos/videos of the package and products</li>
            </ul>
            <p>We will review the issue and assist with replacement or resolution.</p>
          </PolicySection>

          <PolicySection title="8. Delays Beyond Our Control">
            <p>ReSip India is not responsible for delays caused by:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Natural disasters</li>
              <li>Government restrictions</li>
              <li>Courier service disruptions</li>
              <li>Festivals or peak sale periods</li>
            </ul>
            <p>However, we will do our best to keep you informed about any delays.</p>
          </PolicySection>

          <PolicySection title="9. Contact Us">
            <p>For shipping-related support, please contact us:</p>
            <ul className="space-y-3 pl-0">
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
                <strong className="font-bold text-charcoal">Phone/WhatsApp:</strong>{' '}
                <a
                  href={CONTACT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-blue underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold"
                >
                  {CONTACT_PHONE}
                </a>
                {' · '}
                <a
                  href={CONTACT_PHONE_TEL}
                  className="font-bold text-brand-blue underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-gold"
                >
                  Call
                </a>
              </li>
            </ul>
            <p>We are happy to assist you with your order status and shipping queries.</p>
          </PolicySection>
        </div>

        <p className="mt-12 text-center text-sm text-charcoal/50">
          Returns &amp; exchanges?{' '}
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

export default ShippingPolicy;
