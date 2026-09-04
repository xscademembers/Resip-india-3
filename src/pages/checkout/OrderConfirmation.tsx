import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package } from 'lucide-react';
import { PageContainer, Spinner, inr } from '../../components/ui';
import { ordersApi } from '../../api/orders';
import SEOHead from '../../components/SEOHead';
import type { ApiOrder } from '../../api/types';
import type { ApiErrorShape } from '../../api/client';

const CONFIRM_KEY = 'resip_order_confirm';

export function storeOrderConfirm(orderId: string, accessToken: string) {
  try {
    sessionStorage.setItem(CONFIRM_KEY, JSON.stringify({ orderId, accessToken }));
  } catch {
    /* ignore */
  }
}

export function readOrderConfirm(): { orderId: string; accessToken: string } | null {
  try {
    const raw = sessionStorage.getItem(CONFIRM_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId') || readOrderConfirm()?.orderId || '';
  const token = params.get('token') || readOrderConfirm()?.accessToken || '';

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !token) {
      setError('Missing order confirmation details. Please check your email for the order link.');
      setLoading(false);
      return;
    }
    ordersApi
      .confirm(orderId, token)
      .then((o) => {
        setOrder(o);
        storeOrderConfirm(orderId, token);
      })
      .catch((err) => setError((err as ApiErrorShape).message || 'Could not load order'))
      .finally(() => setLoading(false));
  }, [orderId, token]);

  if (loading) {
    return (
      <PageContainer>
        <Spinner />
      </PageContainer>
    );
  }

  if (error || !order) {
    return (
      <PageContainer className="max-w-2xl text-center">
        <SEOHead title="Order Confirmation" noindex />
        <Package className="mx-auto text-charcoal/30" size={64} />
        <h1 className="mt-6 font-display text-2xl font-bold text-brand-blue">Order not found</h1>
        <p className="mt-3 text-charcoal/60">{error}</p>
        <Link to="/shop" className="mt-8 inline-block rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white">
          Continue Shopping
        </Link>
      </PageContainer>
    );
  }

  const addr = order.shippingAddress || {};

  return (
    <PageContainer className="max-w-2xl">
      <SEOHead title={`Order ${order.orderId}`} noindex />
      <div className="text-center">
        <CheckCircle2 className="mx-auto text-green-600" size={64} />
        <h1 className="mt-4 font-display text-3xl font-bold text-brand-blue">Thank you for your order!</h1>
        <p className="mt-2 text-charcoal/60">
          Order <strong className="text-brand-blue">{order.orderId}</strong>
          {order.paymentMethod === 'cod'
            ? ' — Cash on Delivery. A confirmation email is on its way.'
            : ' — A confirmation email is on its way.'}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-brand-blue">Order summary</h2>
        <ul className="mt-4 divide-y divide-brand-blue/10 text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between py-3">
              <span>
                {item.name} <span className="text-charcoal/40">× {item.quantity}</span>
              </span>
              <span className="font-semibold">{inr(item.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-brand-blue/10 pt-3 text-base font-bold">
          <span>Total</span>
          <span className="text-brand-blue">{inr(order.totalAmount)}</span>
        </div>
        <p className="mt-2 text-xs text-charcoal/50">
          Status: {order.orderStatus}
          {order.paymentMethod === 'cod' ? ' · Pay on delivery' : ` · Payment ${order.paymentStatus || ''}`}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-brand-blue/10 bg-white p-6 text-sm shadow-sm">
        <h2 className="font-display text-lg font-bold text-brand-blue">Shipping to</h2>
        <p className="mt-2">
          <strong>{addr.fullName}</strong> · {addr.phone}
          <br />
          {addr.addressLine1}
          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
          <br />
          {addr.city}, {addr.state} {addr.pincode}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/shop"
          className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold"
        >
          Continue Shopping
        </Link>
        <Link
          to="/login"
          state={{ from: '/account/orders' }}
          className="rounded-xl border border-brand-blue/20 px-6 py-3 text-sm font-bold text-brand-blue transition-colors hover:bg-brand-blue/5"
        >
          Sign in for Carbon Points
        </Link>
      </div>
    </PageContainer>
  );
}
