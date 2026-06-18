import React, { useEffect, useState } from 'react';
import { Plus, Star, Trash2 } from 'lucide-react';
import { PageContainer, Spinner, TextField, SubmitButton } from '../../components/ui';
import { userApi } from '../../api/user';
import { useToast } from '../../context/ToastContext';
import AccountNav from './AccountNav';
import SEOHead from '../../components/SEOHead';
import type { ApiAddress } from '../../api/types';
import type { ApiErrorShape } from '../../api/client';

const emptyForm = {
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

export default function Addresses() {
  const toast = useToast();
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () =>
    userApi
      .getAddresses()
      .then(setAddresses)
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await userApi.addAddress({ ...form, isDefault: addresses.length === 0 });
      setAddresses((a) => [...a, saved]);
      setForm(emptyForm);
      setShowForm(false);
      toast.success('Address added');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (addrId: string) => {
    try {
      await userApi.deleteAddress(addrId);
      setAddresses((a) => a.filter((x) => x._id !== addrId));
      toast.success('Address removed');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    }
  };

  const setDefault = async (addrId: string) => {
    try {
      await userApi.setDefaultAddress(addrId);
      setAddresses((a) => a.map((x) => ({ ...x, isDefault: x._id === addrId })));
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    }
  };

  return (
    <PageContainer>
      <SEOHead title="My Addresses" noindex />
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">My Account</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <AccountNav />
        </div>
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-brand-blue">Saved Addresses</h2>
            <button
              type="button"
              onClick={() => setShowForm((s) => !s)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-gold"
            >
              <Plus size={16} /> Add Address
            </button>
          </div>

          {showForm && (
            <form onSubmit={save} className="mb-6 rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
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
              <SubmitButton type="submit" loading={saving} className="mt-2 sm:w-auto sm:px-8">
                Save Address
              </SubmitButton>
            </form>
          )}

          {loading ? (
            <Spinner />
          ) : addresses.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-brand-blue/20 bg-white/60 p-8 text-center text-sm text-charcoal/50">
              No saved addresses yet.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((a) => (
                <li key={a._id} className="rounded-2xl border border-brand-blue/10 bg-white p-5 text-sm shadow-sm">
                  <div className="flex items-start justify-between">
                    <p className="font-bold text-charcoal">{a.fullName}</p>
                    {a.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 px-2 py-1 text-xs font-bold text-brand-gold">
                        <Star size={12} /> Default
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-charcoal/70">
                    {a.addressLine1}
                    {a.addressLine2 ? `, ${a.addressLine2}` : ''}
                    <br />
                    {a.city}, {a.state} {a.pincode}
                    <br />
                    {a.phone}
                  </p>
                  <div className="mt-4 flex items-center gap-4 border-t border-brand-blue/10 pt-3">
                    {!a.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefault(a._id)}
                        className="text-xs font-semibold text-brand-blue hover:underline"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(a._id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
