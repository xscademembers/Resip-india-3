import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Spinner, inr } from '../../components/ui';
import { AdminHeading, Table, Th, Td, Modal, Field, inputClass, PrimaryButton } from './adminUi';
import { OrderStatusBadge } from '../user/OrderStatusBadge';
import type { ApiErrorShape } from '../../api/client';

const STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'];

export default function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [status, setStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<string[]>([]);
  const [pickupLocation, setPickupLocation] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.orders({ status: filter || undefined, limit: 100 });
      setOrders(res.orders);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    adminApi
      .delhiveryPickupLocations()
      .then((res) => {
        setPickupLocations(res.locations);
        setPickupLocation(res.default);
      })
      .catch(() => {
        setPickupLocations([]);
        setPickupLocation('');
      });
  }, []);

  const openOrder = (o: any) => {
    setSelected(o);
    setStatus(o.orderStatus);
    setTracking(o.trackingNumber || '');
    setNote('');
  };

  const saveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await adminApi.updateOrderStatus(selected._id, { status, trackingNumber: tracking, note });
      toast.success('Order updated');
      setSelected(null);
      load();
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setSaving(false);
    }
  };

  const shipWithDelhivery = async () => {
    if (!selected) return;
    setShipping(true);
    try {
      const res = await adminApi.shipWithDelhivery(
        selected._id,
        pickupLocations.length > 1 ? pickupLocation : undefined
      );
      toast.success(`Delhivery AWB: ${res.delhivery.waybill}`);
      setSelected(null);
      load();
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setShipping(false);
    }
  };

  const canShipWithDelhivery =
    selected &&
    !selected.trackingNumber &&
    ['Confirmed', 'Packed'].includes(selected.orderStatus);

  return (
    <>
      <AdminHeading title="Orders" />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${!filter ? 'bg-brand-blue text-white' : 'bg-white text-charcoal/60'}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === s ? 'bg-brand-blue text-white' : 'bg-white text-charcoal/60'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Table
          head={
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th className="text-right">Total</Th>
              <Th>Status</Th>
            </tr>
          }
        >
          {orders.map((o) => (
            <tr key={o._id} className="cursor-pointer hover:bg-brand-blue/5" onClick={() => openOrder(o)}>
              <Td className="font-semibold text-brand-blue">#{o.orderId}</Td>
              <Td>{o.user?.name || ' '}</Td>
              <Td className="text-charcoal/60">{new Date(o.createdAt).toLocaleDateString('en-IN')}</Td>
              <Td className="text-right font-semibold">{inr(o.totalAmount)}</Td>
              <Td>
                <OrderStatusBadge status={o.orderStatus} />
              </Td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <Td>No orders.</Td>
              <Td /><Td /><Td /><Td />
            </tr>
          )}
        </Table>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Order #${selected.orderId}` : ''}>
        {selected && (
          <form onSubmit={saveStatus}>
            <div className="mb-4 rounded-xl bg-brand-bg p-4 text-sm">
              <p className="font-semibold">{selected.user?.name}</p>
              <p className="text-charcoal/60">{selected.user?.email}</p>
              <p className="mt-2">Total: <strong>{inr(selected.totalAmount)}</strong></p>
            </div>
            <ul className="mb-4 divide-y divide-brand-blue/10 text-sm">
              {selected.items?.map((it: any, i: number) => (
                <li key={i} className="flex justify-between py-2">
                  <span>{it.name} × {it.quantity}</span>
                  <span className="font-semibold">{inr(it.subtotal)}</span>
                </li>
              ))}
            </ul>
            <Field label="Status">
              <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Tracking Number">
              <input className={inputClass} value={tracking} onChange={(e) => setTracking(e.target.value)} />
            </Field>
            <Field label="Note (optional)">
              <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
            {canShipWithDelhivery && pickupLocations.length > 1 && (
              <Field label="Pickup Location">
                <select
                  className={inputClass}
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                >
                  {pickupLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </Field>
            )}
            {canShipWithDelhivery && (
              <button
                type="button"
                onClick={shipWithDelhivery}
                disabled={shipping || saving}
                className="mb-3 w-full rounded-xl border border-brand-blue/20 bg-brand-blue/5 px-4 py-3 text-sm font-bold text-brand-blue hover:bg-brand-blue/10 disabled:opacity-50"
              >
                {shipping ? 'Creating Delhivery shipment…' : 'Ship with Delhivery'}
              </button>
            )}
            <PrimaryButton type="submit" disabled={saving || shipping} className="w-full">
              {saving ? 'Saving…' : 'Update Status'}
            </PrimaryButton>
          </form>
        )}
      </Modal>
    </>
  );
}
