import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { PageContainer, EmptyState, Spinner, inr } from '../../components/ui';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { couponsApi } from '../../api/orders';
import { couponStore } from './couponStore';
import SEOHead from '../../components/SEOHead';
import type { ApiErrorShape } from '../../api/client';

export default function CartPage() {
  const { cart, loading, subtotal, totalItems, taxPercent, getTotals, updateItem, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState(couponStore.get()?.code || '');
  const [discount, setDiscount] = useState(couponStore.get()?.discount || 0);
  const [applying, setApplying] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!isAuthenticated) {
      toast.info('Please sign in to apply a coupon');
      return;
    }
    setApplying(true);
    try {
      const res = await couponsApi.validate(couponCode.trim().toUpperCase(), subtotal);
      setDiscount(res.discount);
      couponStore.set({ code: couponCode.trim().toUpperCase(), discount: res.discount });
      toast.success(`Coupon applied — you saved ${inr(res.discount)}`);
    } catch (err) {
      setDiscount(0);
      couponStore.clear();
      toast.error((err as ApiErrorShape).message);
    } finally {
      setApplying(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    couponStore.clear();
  };

  const goToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <PageContainer>
        <Spinner />
      </PageContainer>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <PageContainer>
        <SEOHead title="Your Cart" noindex />
        <EmptyState
          icon={<ShoppingBag size={48} />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Explore our handcrafted upcycled collection."
          action={
            <Link
              to="/shop"
              className="inline-flex rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold"
            >
              Shop Collection
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const totals = getTotals(discount);

  return (
    <PageContainer>
      <SEOHead title="Your Cart" noindex />
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">
        Your Cart <span className="text-lg font-medium text-charcoal/40">({totalItems} items)</span>
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <ul className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <li
              key={item._id}
              className="flex gap-4 rounded-2xl border border-brand-blue/10 bg-white p-4 shadow-sm"
            >
              <img
                src={item.product?.image || item.product?.images?.[0]}
                alt={item.product?.name}
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
                loading="lazy"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/product/${item.product?.legacyId || item.product?.slug}`}
                    className="font-display text-lg font-bold leading-tight text-charcoal hover:text-brand-blue"
                  >
                    {item.product?.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    className="rounded-lg p-2 text-charcoal/40 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="mt-1 text-xs text-charcoal/50">
                  {item.setSize ? `Set of ${item.setSize}` : null}
                  {item.fragrance ? ` · ${item.fragrance}` : null}
                  {item.labelType === 'image' ? ' · Custom label' : null}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center gap-1 rounded-full border border-brand-blue/15">
                    <button
                      type="button"
                      onClick={() => updateItem(item._id, item.quantity - 1)}
                      className="rounded-full p-2 text-brand-blue hover:bg-brand-blue/5"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateItem(item._id, item.quantity + 1)}
                      className="rounded-full p-2 text-brand-blue hover:bg-brand-blue/5"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-base font-bold text-brand-blue">{inr(item.price * item.quantity)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-brand-blue">Order Summary</h2>

            <div className="mt-4">
              <label htmlFor="coupon" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-charcoal/60">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="w-full rounded-xl border border-brand-blue/15 bg-brand-bg px-3 py-2 text-sm uppercase tracking-wide focus:border-brand-blue focus:outline-none"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={applying}
                  className="shrink-0 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-gold disabled:opacity-60"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600"
                >
                  <Tag size={12} /> {inr(discount)} off applied — remove
                </button>
              )}
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Subtotal</dt>
                <dd className="font-semibold">{inr(subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Coupon discount</dt>
                  <dd className="font-semibold">−{inr(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-charcoal/60">GST ({taxPercent}%)</dt>
                <dd className="font-semibold">{inr(totals.tax)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Shipping</dt>
                <dd className="font-semibold">{totals.shipping === 0 ? 'Free' : inr(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-brand-blue/10 pt-3 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold text-brand-blue">{inr(totals.total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={goToCheckout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/shop"
              className="mt-3 block text-center text-sm font-semibold text-brand-blue underline-offset-4 hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
