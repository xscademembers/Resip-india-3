import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { PageContainer } from '../../components/ui';
import { paymentsApi } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import { readOrderConfirm, storeOrderConfirm } from './OrderConfirmation';
import SEOHead from '../../components/SEOHead';

export default function PaymentPending() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { orderId?: string; accessToken?: string } };
  const { isAuthenticated } = useAuth();

  const transactionId =
    params.get('order_id') || params.get('transactionId') || params.get('txn') || '';
  const token =
    params.get('token') ||
    location.state?.accessToken ||
    readOrderConfirm()?.accessToken ||
    '';

  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!transactionId) return;
    const id = window.setInterval(async () => {
      try {
        const res = await paymentsApi.status(transactionId, token || undefined);
        const status = res.payment?.status;
        const order = res.payment?.order;
        if (order?.orderId && (order.accessToken || token)) {
          storeOrderConfirm(order.orderId, order.accessToken || token);
        }
        if (status === 'success') {
          const qs = new URLSearchParams({ transactionId });
          if (token) qs.set('token', token);
          navigate(`/payment/success?${qs.toString()}`, { replace: true });
        } else if (status === 'failed') {
          navigate('/payment/failed', { replace: true });
        }
      } catch {
        /* keep polling */
      }
      setAttempts((a) => a + 1);
    }, 4000);
    return () => window.clearInterval(id);
  }, [transactionId, token, navigate]);

  const ordersLink = isAuthenticated
    ? '/account/orders'
    : readOrderConfirm()
      ? `/order/confirmation?orderId=${encodeURIComponent(readOrderConfirm()!.orderId)}&token=${encodeURIComponent(readOrderConfirm()!.accessToken)}`
      : '/shop';

  return (
    <PageContainer className="max-w-2xl text-center">
      <SEOHead title="Payment Pending" noindex />
      <Clock className="mx-auto animate-pulse text-brand-gold" size={72} aria-hidden />
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-brand-blue">Confirming your payment…</h1>
      <p className="mt-3 text-charcoal/60">
        Please wait while we confirm your payment with Cashfree. This usually takes a few seconds.
        {attempts > 6 && ' Still processing — you can safely check your confirmation email later.'}
      </p>
      <div className="mt-8">
        <Link
          to={ordersLink}
          className="rounded-xl border border-brand-blue/20 px-6 py-3 text-sm font-bold text-brand-blue transition-colors hover:bg-brand-blue/5"
        >
          {isAuthenticated ? 'Go to My Orders' : 'View order status'}
        </Link>
      </div>
    </PageContainer>
  );
}
