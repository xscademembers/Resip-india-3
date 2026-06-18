import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { PageContainer, EmptyState, Spinner, inr } from '../../components/ui';
import { userApi } from '../../api/user';
import AccountNav from './AccountNav';
import { OrderStatusBadge } from './OrderStatusBadge';
import SEOHead from '../../components/SEOHead';
import type { ApiOrder } from '../../api/types';

export default function OrderHistory() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer>
      <SEOHead title="My Orders" noindex />
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">My Account</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <AccountNav />
        </div>
        <div className="lg:col-span-3">
          <h2 className="mb-4 font-display text-xl font-bold text-brand-blue">Order History</h2>
          {loading ? (
            <Spinner />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={<Package size={48} />}
              title="No orders yet"
              description="When you place an order it will appear here."
              action={
                <Link
                  to="/shop"
                  className="inline-flex rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold"
                >
                  Start Shopping
                </Link>
              }
            />
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order._id}>
                  <Link
                    to={`/account/orders/${order.orderId}`}
                    className="block rounded-2xl border border-brand-blue/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-lg font-bold text-charcoal">#{order.orderId}</p>
                        <p className="text-xs text-charcoal/50">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.orderStatus} />
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-brand-blue/10 pt-3">
                      <span className="text-sm text-charcoal/50">Total</span>
                      <span className="font-bold text-brand-blue">{inr(order.totalAmount)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
