import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/ui';
import { AdminHeading, Table, Th, Td, Modal, Field, inputClass, PrimaryButton } from './adminUi';
import type { ApiErrorShape } from '../../api/client';

const emptyForm = {
  code: '',
  type: 'percentage',
  value: '',
  minOrderValue: '',
  maxDiscount: '',
  expiryDate: '',
  usageLimit: '',
  isActive: true,
};

export default function AdminCoupons() {
  const toast = useToast();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () =>
    adminApi
      .coupons()
      .then(setCoupons)
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c: any) => {
    setEditingId(c._id);
    setForm({
      code: c.code,
      type: c.type,
      value: String(c.value),
      minOrderValue: String(c.minOrderValue || ''),
      maxDiscount: String(c.maxDiscount || ''),
      expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : '',
      usageLimit: String(c.usageLimit || ''),
      isActive: c.isActive,
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: parseFloat(form.value) || 0,
      minOrderValue: parseFloat(form.minOrderValue) || 0,
      maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
      expiryDate: new Date(form.expiryDate).toISOString(),
      usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
      isActive: form.isActive,
    };
    try {
      if (editingId) {
        await adminApi.updateCoupon(editingId, payload);
        toast.success('Coupon updated');
      } else {
        await adminApi.createCoupon(payload);
        toast.success('Coupon created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await adminApi.deleteCoupon(id);
      setCoupons((c) => c.filter((x) => x._id !== id));
      toast.success('Coupon deleted');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    }
  };

  return (
    <>
      <AdminHeading
        title="Coupons"
        action={
          <PrimaryButton onClick={openCreate}>
            <Plus size={16} /> Add Coupon
          </PrimaryButton>
        }
      />

      {loading ? (
        <Spinner />
      ) : (
        <Table
          head={
            <tr>
              <Th>Code</Th>
              <Th>Type</Th>
              <Th>Value</Th>
              <Th>Expiry</Th>
              <Th>Used</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          }
        >
          {coupons.map((c) => (
            <tr key={c._id}>
              <Td className="font-bold text-brand-blue">{c.code}</Td>
              <Td className="text-charcoal/60">{c.type}</Td>
              <Td>{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</Td>
              <Td className="text-charcoal/60">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-IN') : ' '}</Td>
              <Td>{c.usedCount || 0}{c.usageLimit ? `/${c.usageLimit}` : ''}</Td>
              <Td>
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {c.isActive ? 'Active' : 'Inactive'}
                </span>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-brand-blue hover:bg-brand-blue/5" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => remove(c._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
          {coupons.length === 0 && (
            <tr>
              <Td>No coupons.</Td>
              <Td /><Td /><Td /><Td /><Td /><Td />
            </tr>
          )}
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Coupon' : 'Add Coupon'}>
        <form onSubmit={save}>
          <Field label="Code">
            <input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </Field>
            <Field label="Value">
              <input type="number" className={inputClass} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min Order (₹)">
              <input type="number" className={inputClass} value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
            </Field>
            <Field label="Max Discount (₹)">
              <input type="number" className={inputClass} value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry Date">
              <input type="date" className={inputClass} value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} required />
            </Field>
            <Field label="Usage Limit">
              <input type="number" className={inputClass} value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
            </Field>
          </div>
          <label className="mb-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
          </label>
          <PrimaryButton type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editingId ? 'Update Coupon' : 'Create Coupon'}
          </PrimaryButton>
        </form>
      </Modal>
    </>
  );
}
