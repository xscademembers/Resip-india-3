import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageContainer, Spinner, EmptyState, inr } from '../../components/ui';
import { ordersApi } from '../../api/orders';
import { useToast } from '../../context/ToastContext';
import { OrderStatusBadge } from './OrderStatusBadge';
import SEOHead from '../../components/SEOHead';
import type { ApiOrder } from '../../api/types';
import type { ApiErrorShape } from '../../api/client';

export default function OrderDetail() {
  const { id = '' } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    ordersApi
      .get(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const cancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const updated = await ordersApi.cancel(order.orderId);
      setOrder(updated);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Spinner />
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer>
        <EmptyState
          title="Order not found"
          action={
            <Link to="/account/orders" className="font-semibold text-brand-blue underline-offset-4 hover:underline">
              Back to orders
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

  return (
    <PageContainer className="max-w-4xl">
      <SEOHead title={`Order ${order.orderId}`} noindex />
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue underline-offset-4 hover:underline"
      >
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue">Order #{order.orderId}</h1>
        <OrderStatusBadge status={order.orderStatus} />
      </div>
      <p className="mt-1 text-sm text-charcoal/50">
        Placed on{' '}
        {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-brand-blue">Items</h2>
            <ul className="mt-4 divide-y divide-brand-blue/10">
              {order.items.map((item, i) => (
                <li key={i} className="flex gap-4 py-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" loading="lazy" />
                  )}
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="font-semibold text-charcoal">{item.name}</p>
                      <p className="text-xs text-charcoal/50">
                        Qty {item.quantity}
                        {item.setSize ? ` · Set of ${item.setSize}` : ''}
                        {item.fragrance ? ` · ${item.fragrance}` : ''}
                      </p>
                    </div>
                    <p className="font-bold text-brand-blue">{inr(item.subtotal)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="mt-6 rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-brand-blue">Tracking</h2>
              <ol className="mt-4 space-y-4">
                {order.statusHistory.map((h, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-blue" />
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{h.status}</p>
                      <p className="text-xs text-charcoal/50">
                        {new Date(h.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        {h.note ? ` — ${h.note}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <aside>
          <div className="rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-brand-blue">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Subtotal</dt>
                <dd>{inr(order.subtotal)}</dd>
              </div>
              {order.couponDiscount ? (
                <div className="flex justify-between text-green-600">
                  <dt>Discount</dt>
                  <dd>−{inr(order.couponDiscount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-charcoal/60">GST</dt>
                <dd>{inr(order.taxAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Shipping</dt>
                <dd>{order.shippingCharge === 0 ? 'Free' : inr(order.shippingCharge)}</dd>
              </div>
              <div className="flex justify-between border-t border-brand-blue/10 pt-2 text-base font-bold">
                <dt>Total</dt>
                <dd className="text-brand-blue">{inr(order.totalAmount)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-charcoal/50">
              Payment: {order.paymentStatus} · {order.paymentMethod}
            </p>
          </div>

          {order.shippingAddress && (
            <div className="mt-6 rounded-2xl border border-brand-blue/10 bg-white p-6 text-sm shadow-sm">
              <h2 className="font-display text-lg font-bold text-brand-blue">Shipping Address</h2>
              <p className="mt-2 text-charcoal/70">
                <strong>{order.shippingAddress.fullName}</strong>
                <br />
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                <br />
                {order.shippingAddress.phone}
              </p>
            </div>
          )}

          {canCancel && (
            <button
              type="button"
              onClick={cancel}
              disabled={cancelling}
              className="mt-6 w-full rounded-xl border border-red-200 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              Cancel Order
            </button>
          )}
        </aside>
      </div>
    </PageContainer>
  );
}
