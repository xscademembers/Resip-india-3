import React from 'react';
import { PageContainer } from '../../components/ui';
import SEOHead from '../../components/SEOHead';

export default function TermsAndConditions() {
  return (
    <PageContainer>
      <SEOHead title="Terms and Conditions" description="Terms and Conditions for ReSip India" />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">Terms & Conditions</h1>
        <p className="mt-4 text-sm text-charcoal/60">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="mt-8 space-y-8 text-charcoal/80">
          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">2. Products and Services</h2>
            <p>
              We reserve the right to modify or discontinue any product or service without notice. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">3. Pricing and Payment</h2>
            <p>
              All prices are subject to change without notice. We reserve the right to refuse any order you place with us. Payments are processed securely via Cashfree.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">4. Shipping and Delivery</h2>
            <p>
              Please refer to our Shipping Policy for details on delivery times and costs. We are not responsible for delays caused by the courier service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">5. Returns and Refunds</h2>
            <p>
              Please review our Return & Exchange Policy before making any purchases. Custom orders are generally non-refundable.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">6. Contact Information</h2>
            <p>
              Questions about the Terms of Service should be sent to us at sales@crossroadsautoparts.us.
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
