import React from 'react';
import { PageContainer } from '../../components/ui';
import SEOHead from '../../components/SEOHead';

export default function PrivacyPolicy() {
  return (
    <PageContainer>
      <SEOHead title="Privacy Policy" description="Privacy Policy for ReSip India" />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-charcoal/60">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="mt-8 space-y-8 text-charcoal/80">
          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you make a purchase, create an account, or contact us. This may include your name, email address, phone number, shipping address, and payment information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Process and fulfill your orders, including sending emails to confirm your order status and shipment.</li>
              <li>Communicate with you about products, services, offers, and promotions.</li>
              <li>Provide customer support.</li>
              <li>Improve and optimize our website and services.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">3. Information Sharing</h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share your information with trusted third-party service providers (such as payment processors and shipping companies) strictly for the purpose of fulfilling your orders.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">4. Security</h2>
            <p>
              We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-blue mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at sales@crossroadsautoparts.us.
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
