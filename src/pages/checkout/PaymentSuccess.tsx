import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { PageContainer } from '../../components/ui';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { paymentsApi } from '../../api/orders';
import { readOrderConfirm, storeOrderConfirm } from './OrderConfirmation';
import SEOHead from '../../components/SEOHead';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const { refresh } = useCart();
  const { isAuthenticated } = useAuth();
  const transactionId = params.get('transactionId') || params.get('txn') || params.get('order_id') || '';
  const token = params.get('token') || readOrderConfirm()?.accessToken || '';
  const [orderId, setOrderId] = useState<string | null>(readOrderConfirm()?.orderId || null);
  const [accessToken, setAccessToken] = useState(token);

  useEffect(() => {
    refresh();
    if (transactionId) {
      paymentsApi
        .status(transactionId, token || undefined)
        .then((res) => {
          const oid = res.payment?.order?.orderId || null;
          const at = res.payment?.order?.accessToken || token;
          if (oid) setOrderId(oid);
          if (at) {
            setAccessToken(at);
            if (oid) storeOrderConfirm(oid, at);
          }
        })
        .catch(() => undefined);
    }
  }, [transactionId, token, refresh]);

  const viewOrderTo = isAuthenticated
    ? orderId
      ? `/account/orders/${orderId}`
      : '/account/orders'
    : orderId && accessToken
      ? `/order/confirmation?orderId=${encodeURIComponent(orderId)}&token=${encodeURIComponent(accessToken)}`
      : '/shop';

  return (
    <PageContainer className="max-w-2xl text-center">
      <SEOHead title="Payment Successful" noindex />
      <CheckCircle2 className="mx-auto text-green-600" size={72} aria-hidden />
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-brand-blue">Payment Successful!</h1>
      <p className="mt-3 text-charcoal/60">
        Thank you for your order. A confirmation email is on its way with all the details.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to={viewOrderTo}
          className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold"
        >
          View Order
        </Link>
        <Link
          to="/shop"
          className="rounded-xl border border-brand-blue/20 px-6 py-3 text-sm font-bold text-brand-blue transition-colors hover:bg-brand-blue/5"
        >
          Continue Shopping
        </Link>
      </div>
    </PageContainer>
  );
}
