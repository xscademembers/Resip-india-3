import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/ui';
import { AdminHeading, Table, Th, Td, Modal, Field, inputClass, PrimaryButton } from './adminUi';
import type { ApiErrorShape } from '../../api/client';

const emptyForm = {
  title: '',
  subtitle: '',
  image: '',
  mobileImage: '',
  link: '',
  position: 'hero',
  sortOrder: '0',
  isActive: true,
};

export default function AdminBanners() {
  const toast = useToast();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () =>
    adminApi
      .banners()
      .then(setBanners)
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (b: any) => {
    setEditingId(b._id);
    setForm({
      title: b.title || '',
      subtitle: b.subtitle || '',
      image: b.image || '',
      mobileImage: b.mobileImage || '',
      link: b.link || '',
      position: b.position || 'hero',
      sortOrder: String(b.sortOrder ?? 0),
      isActive: b.isActive !== false,
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      mobileImage: form.mobileImage.trim(),
      sortOrder: parseInt(form.sortOrder) || 0,
    };
    try {
      if (editingId) {
        await adminApi.updateBanner(editingId, payload);
        toast.success('Banner updated');
      } else {
        await adminApi.createBanner(payload);
        toast.success('Banner created');
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
    if (!window.confirm('Delete this banner?')) return;
    try {
      await adminApi.deleteBanner(id);
      setBanners((b) => b.filter((x) => x._id !== id));
      toast.success('Banner deleted');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    }
  };

  return (
    <>
      <AdminHeading
        title="Banners"
        subtitle="Home hero slideshow — set a desktop image and an optional mobile image per slide"
        action={
          <PrimaryButton onClick={openCreate}>
            <Plus size={16} /> Add Banner
          </PrimaryButton>
        }
      />

      {loading ? (
        <Spinner />
      ) : (
        <Table
          head={
            <tr>
              <Th>Desktop</Th>
              <Th>Mobile</Th>
              <Th>Title</Th>
              <Th>Position</Th>
              <Th>Order</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          }
        >
          {banners.map((b) => (
            <tr key={b._id}>
              <Td>
                {b.image && <img src={b.image} alt="" className="h-10 w-20 rounded object-cover" loading="lazy" />}
              </Td>
              <Td>
                {(b.mobileImage || b.image) && (
                  <img
                    src={b.mobileImage || b.image}
                    alt=""
                    className="h-10 w-12 rounded object-cover"
                    loading="lazy"
                  />
                )}
                {!b.mobileImage && <span className="ml-1 text-[10px] text-charcoal/40">same</span>}
              </Td>
              <Td className="font-semibold text-charcoal">{b.title || '(untitled)'}</Td>
              <Td className="text-charcoal/60">{b.position}</Td>
              <Td>{b.sortOrder}</Td>
              <Td>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-bold ${
                    b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {b.isActive ? 'Active' : 'Inactive'}
                </span>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => openEdit(b)}
                    className="rounded-lg p-2 text-brand-blue hover:bg-brand-blue/5"
                    aria-label="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(b._id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
          {banners.length === 0 && (
            <tr>
              <Td>No banners.</Td>
              <Td />
              <Td />
              <Td />
              <Td />
              <Td />
              <Td />
            </tr>
          )}
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Banner' : 'Add Banner'}>
        <form onSubmit={save}>
          <Field label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Subtitle">
            <input
              className={inputClass}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
          </Field>
          <Field label="Desktop image URL">
            <input
              className={inputClass}
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
              placeholder="https://… (wide / landscape)"
            />
            <p className="mt-1 text-xs text-charcoal/50">Used on tablets and desktop (md and up).</p>
          </Field>
          {form.image && (
            <img src={form.image} alt="" className="mb-4 h-24 w-full rounded-lg object-cover" />
          )}
          <Field label="Mobile image URL (optional)">
            <input
              className={inputClass}
              value={form.mobileImage}
              onChange={(e) => setForm({ ...form, mobileImage: e.target.value })}
              placeholder="https://… (portrait / cropped for phones)"
            />
            <p className="mt-1 text-xs text-charcoal/50">
              Shown on small screens. Leave blank to reuse the desktop image.
            </p>
          </Field>
          {form.mobileImage && (
            <img src={form.mobileImage} alt="" className="mb-4 mx-auto h-40 w-28 rounded-lg object-cover" />
          )}
          <Field label="Link">
            <input
              className={inputClass}
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="/shop"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Position">
              <select
                className={inputClass}
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              >
                <option value="hero">Hero</option>
                <option value="promotional">Promotional</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </Field>
            <Field label="Sort Order">
              <input
                type="number"
                className={inputClass}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
            </Field>
          </div>
          <label className="mb-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />{' '}
            Active
          </label>
          <PrimaryButton type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editingId ? 'Update Banner' : 'Create Banner'}
          </PrimaryButton>
        </form>
      </Modal>
    </>
  );
}
