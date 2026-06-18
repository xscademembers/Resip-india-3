import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { PageContainer } from '../../components/ui';
import { paymentsApi } from '../../api/orders';
import SEOHead from '../../components/SEOHead';

export default function PaymentPending() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = params.get('transactionId') || params.get('txn') || '';
  const [attempts, setAttempts] = useState(0);

  // Poll the payment status a handful of times, then settle on success/failure.
  useEffect(() => {
    if (!transactionId) return;
    const id = window.setInterval(async () => {
      try {
        const res = await paymentsApi.status(transactionId);
        if (res.status === 'success') {
          navigate(`/payment/success?transactionId=${transactionId}`, { replace: true });
        } else if (res.status === 'failed') {
          navigate('/payment/failed', { replace: true });
        }
      } catch {
        /* keep polling */
      }
      setAttempts((a) => a + 1);
    }, 4000);
    return () => window.clearInterval(id);
  }, [transactionId, navigate]);

  return (
    <PageContainer className="max-w-2xl text-center">
      <SEOHead title="Payment Pending" noindex />
      <Clock className="mx-auto animate-pulse text-brand-gold" size={72} aria-hidden />
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-brand-blue">Confirming your payment…</h1>
      <p className="mt-3 text-charcoal/60">
        Please wait while we confirm your payment with PhonePe. This usually takes a few seconds.
        {attempts > 6 && ' Still processing — you can safely check your orders later.'}
      </p>
      <div className="mt-8">
        <Link
          to="/account/orders"
          className="rounded-xl border border-brand-blue/20 px-6 py-3 text-sm font-bold text-brand-blue transition-colors hover:bg-brand-blue/5"
        >
          Go to My Orders
        </Link>
      </div>
    </PageContainer>
  );
}
