import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { PageContainer } from '../../components/ui';
import SEOHead from '../../components/SEOHead';

export default function PaymentFailed() {
  return (
    <PageContainer className="max-w-2xl text-center">
      <SEOHead title="Payment Failed" noindex />
      <XCircle className="mx-auto text-red-500" size={72} aria-hidden />
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-brand-blue">Payment Failed</h1>
      <p className="mt-3 text-charcoal/60">
        Unfortunately your payment could not be processed. No amount has been deducted. You can try again from your cart.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/cart"
          className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold"
        >
          Back to Cart
        </Link>
        <Link
          to="/account/orders"
          className="rounded-xl border border-brand-blue/20 px-6 py-3 text-sm font-bold text-brand-blue transition-colors hover:bg-brand-blue/5"
        >
          My Orders
        </Link>
      </div>
    </PageContainer>
  );
}
