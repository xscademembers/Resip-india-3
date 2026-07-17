import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PageContainer, TextField, Spinner, inr } from '../../components/ui';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { userApi } from '../../api/user';
import { ordersApi, paymentsApi } from '../../api/orders';
import { couponStore } from './couponStore';
import SEOHead from '../../components/SEOHead';
import type { ApiAddress } from '../../api/types';
import type { ApiErrorShape } from '../../api/client';

type Step = 'address' | 'review';

const emptyAddress = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  landmark: '',
};

type PayMethod = 'cashfree' | 'cod';

export default function Checkout() {
  const { cart, subtotal, taxPercent, getTotals, refresh, codEnabled } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('address');
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAddress);
  const [useNew, setUseNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>('cashfree');

  const coupon = couponStore.get();
  const totals = getTotals(coupon?.discount || 0, paymentMethod === 'cod');
  const grandTotal = totals.total;

  useEffect(() => {
    userApi
      .getAddresses()
      .then((list) => {
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) setSelectedId(def._id);
        else setUseNew(true);
      })
      .catch(() => setUseNew(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && (!cart.items || cart.items.length === 0)) {
      navigate('/cart', { replace: true });
    }
  }, [loading, cart.items, navigate]);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const resolveShippingAddress = async (): Promise<Record<string, any> | null> => {
    if (useNew) {
      const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'] as const;
      for (const field of required) {
        if (!form[field]?.trim()) {
          toast.error('Please complete all required address fields');
          return null;
        }
      }
      try {
        const saved = await userApi.addAddress({ ...form, isDefault: addresses.length === 0 });
        setAddresses((a) => [...a, saved]);
        setSelectedId(saved._id);
        return saved as unknown as Record<string, any>;
      } catch (err) {
        toast.error((err as ApiErrorShape).message);
        return null;
      }
    }
    const addr = addresses.find((a) => a._id === selectedId);
    if (!addr) {
      toast.error('Please select a delivery address');
      return null;
    }
    return addr as unknown as Record<string, any>;
  };

  const [shippingAddress, setShippingAddress] = useState<Record<string, any> | null>(null);

  const continueToReview = async () => {
    const addr = await resolveShippingAddress();
    if (addr) {
      setShippingAddress(addr);
      setStep('review');
    }
  };

  const loadCashfreeSdk = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Cashfree) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    if (!shippingAddress) return;
    setPlacing(true);

    // Cash on Delivery: create the order and go straight to the order page —
    // there is no online payment step.
    if (paymentMethod === 'cod') {
      try {
        const { order } = await ordersApi.create({
          shippingAddress,
          couponCode: coupon?.code,
          paymentMethod: 'cod',
        });
        couponStore.clear();
        await refresh();
        toast.success('Order placed successfully! Pay on delivery.');
        navigate(`/account/orders/${order.orderId}`);
      } catch (err) {
        toast.error((err as ApiErrorShape).message);
      } finally {
        setPlacing(false);
      }
      return;
    }

    try {
      const { order } = await ordersApi.create({
        shippingAddress,
        couponCode: coupon?.code,
        paymentMethod: 'cashfree',
      });
      try {
        const pay = await paymentsApi.initiate(order._id);
        couponStore.clear();

        // Dynamically load SDK before initializing
        const isLoaded = await loadCashfreeSdk();
        
        if (isLoaded) {
          const cashfree = (window as any).Cashfree({
            mode: import.meta.env.PROD ? 'production' : 'sandbox',
          });
          
          if (cashfree && pay.paymentSessionId) {
            cashfree.checkout({
              paymentSessionId: pay.paymentSessionId,
              returnUrl: `${window.location.origin}/payment/pending?order_id=${pay.merchantOrderId}`,
            });
            return;
          }
        }

        // Fallback: navigate to pending page for manual polling if SDK fails to load or init
        navigate(`/payment/pending?order_id=${pay.merchantOrderId}`, {
          state: { orderId: order.orderId },
        });
      } catch (payErr) {
        // Order was created but payment gateway is unavailable.
        toast.error((payErr as ApiErrorShape).message || 'Payment could not be started');
        await refresh();
        navigate(`/account/orders/${order.orderId}`);
      }
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Spinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SEOHead title="Checkout" noindex />
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">Checkout</h1>

      {/* Steps */}
      <ol className="mt-6 flex items-center gap-4 text-sm font-semibold">
        {(['address', 'review'] as Step[]).map((s, i) => {
          const active = step === s;
          const done = step === 'review' && s === 'address';
          return (
            <li key={s} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  active || done ? 'bg-brand-blue text-white' : 'bg-brand-blue/10 text-brand-blue/50'
                }`}
              >
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className={active ? 'text-brand-blue' : 'text-charcoal/40'}>
                {s === 'address' ? 'Shipping' : 'Review & Pay'}
              </span>
              {i === 0 && <span className="mx-2 h-px w-8 bg-brand-blue/20" />}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 'address' ? (
            <div className="rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brand-blue">Delivery Address</h2>

              {addresses.length > 0 && (
                <div className="mt-4 space-y-3">
                  {addresses.map((a) => (
                    <label
                      key={a._id}
                      className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                        !useNew && selectedId === a._id ? 'border-brand-blue bg-brand-blue/5' : 'border-brand-blue/15'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        className="mt-1"
                        checked={!useNew && selectedId === a._id}
                        onChange={() => {
                          setUseNew(false);
                          setSelectedId(a._id);
                        }}
                      />
                      <span className="text-sm">
                        <strong>{a.fullName}</strong> · {a.phone}
                        <br />
                        {a.addressLine1}
                        {a.addressLine2 ? `, ${a.addressLine2}` : ''}, {a.city}, {a.state} {a.pincode}
                      </span>
                    </label>
                  ))}
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-blue/15 p-4 text-sm">
                    <input type="radio" name="address" checked={useNew} onChange={() => setUseNew(true)} />
                    Use a new address
                  </label>
                </div>
              )}

              {useNew && (
                <div className="mt-6 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                  <TextField id="fullName" label="Full Name *" value={form.fullName} onChange={update('fullName')} />
                  <TextField id="phone" label="Phone *" value={form.phone} onChange={update('phone')} />
                  <div className="sm:col-span-2">
                    <TextField id="addressLine1" label="Address Line 1 *" value={form.addressLine1} onChange={update('addressLine1')} />
                  </div>
                  <div className="sm:col-span-2">
                    <TextField id="addressLine2" label="Address Line 2" value={form.addressLine2} onChange={update('addressLine2')} />
                  </div>
                  <TextField id="city" label="City *" value={form.city} onChange={update('city')} />
                  <TextField id="state" label="State *" value={form.state} onChange={update('state')} />
                  <TextField id="pincode" label="Pincode *" value={form.pincode} onChange={update('pincode')} />
                  <TextField id="landmark" label="Landmark" value={form.landmark} onChange={update('landmark')} />
                </div>
              )}

              <button
                type="button"
                onClick={continueToReview}
                className="mt-6 rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold"
              >
                Continue to Review
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brand-blue">Review your order</h2>
              {shippingAddress && (
                <div className="mt-4 rounded-xl bg-brand-bg p-4 text-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal/50">Shipping to</p>
                  <p className="mt-1">
                    <strong>{shippingAddress.fullName}</strong> · {shippingAddress.phone}
                    <br />
                    {shippingAddress.addressLine1}
                    {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}, {shippingAddress.city},{' '}
                    {shippingAddress.state} {shippingAddress.pincode}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="mt-2 text-xs font-semibold text-brand-blue underline-offset-4 hover:underline"
                  >
                    Change
                  </button>
                </div>
              )}
              <ul className="mt-4 divide-y divide-brand-blue/10">
                {cart.items.map((item) => (
                  <li key={item._id} className="flex items-center justify-between py-3 text-sm">
                    <span>
                      {item.product?.name} <span className="text-charcoal/40">× {item.quantity}</span>
                    </span>
                    <span className="font-semibold">{inr(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              {/* Payment method */}
              <h3 className="mt-6 font-display text-base font-bold text-brand-blue">Payment Method</h3>
              <div className="mt-3 space-y-3">
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                    paymentMethod === 'cashfree' ? 'border-brand-blue bg-brand-blue/5' : 'border-brand-blue/15'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="mt-1"
                    checked={paymentMethod === 'cashfree'}
                    onChange={() => setPaymentMethod('cashfree')}
                  />
                  <span className="text-sm">
                    <strong>Pay Online</strong>
                    <br />
                    <span className="text-charcoal/50">Credit/Debit Card, UPI, Netbanking — secured by Cashfree</span>
                  </span>
                </label>

                {codEnabled && (
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      paymentMethod === 'cod' ? 'border-brand-blue bg-brand-blue/5' : 'border-brand-blue/15'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="mt-1"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className="text-sm">
                      <strong>Cash on Delivery</strong>
                      {totals.codCharge > 0 && (
                        <span className="ml-1 rounded-full bg-brand-gold/15 px-2 py-0.5 text-xs font-semibold text-brand-gold">
                          +{inr(totals.codCharge)} handling fee
                        </span>
                      )}
                      <br />
                      <span className="text-charcoal/50">Pay in cash when your order is delivered</span>
                    </span>
                  </label>
                )}
              </div>

              <button
                type="button"
                onClick={placeOrder}
                disabled={placing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold disabled:opacity-60"
              >
                {placing && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                {paymentMethod === 'cod' ? `Place Order · ${inr(grandTotal)}` : `Pay ${inr(grandTotal)} Securely`}
              </button>
              <p className="mt-3 text-center text-xs text-charcoal/40">
                {paymentMethod === 'cod'
                  ? 'Your order will be confirmed and payment collected on delivery.'
                  : "You will be redirected to Cashfree's secure payment page."}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-brand-blue">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Subtotal</dt>
                <dd className="font-semibold">{inr(subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Coupon ({coupon?.code})</dt>
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
              {totals.codCharge > 0 && (
                <div className="flex justify-between">
                  <dt className="text-charcoal/60">COD Charges</dt>
                  <dd className="font-semibold">{inr(totals.codCharge)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-brand-blue/10 pt-3 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold text-brand-blue">{inr(grandTotal)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
