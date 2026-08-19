import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { categoriesApi } from '../../api/products';
import { useToast } from '../../context/ToastContext';
import { Spinner, inr } from '../../components/ui';
import { AdminHeading, Table, Th, Td, Modal, Field, inputClass, PrimaryButton } from './adminUi';
import type { ApiErrorShape } from '../../api/client';

interface Category {
  _id: string;
  name: string;
}

const SectionHeading: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <div className="mb-3 mt-6 border-t border-brand-blue/10 pt-4 first:mt-0 first:border-0 first:pt-0">
    <h3 className="text-sm font-bold text-brand-blue">{title}</h3>
    {hint && <p className="mt-1 text-xs text-charcoal/50">{hint}</p>}
  </div>
);

const emptyForm = {
  name: '',
  description: '',
  story: '',
  price: '',
  category: '',
  stock: '100',
  images: '',
  beforeImage: '',
  features: '',
  whyChooseHeading: '',
  // Variant pricing: '' = none, '24' = Set of 2 & 4, '612' = Set of 6 & 12
  glassSetFormat: '' as '' | '24' | '612',
  setOf2: '',
  setOf4: '',
  setOf6: '',
  setOf12: '',
  // Candle options
  fragrances: '',
  labelImageSurcharge: '',
  isFeatured: false,
  isTrending: false,
  isActive: true,
  hidden: false,
};

export default function AdminProducts() {
  const toast = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.products({ search, limit: 100 });
      setProducts(res.products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    categoriesApi
      .list()
      .then((r) => setCategories(r.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?._id || '' });
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p._id);
    const gsp = p.glassSetPricing || {};
    setForm({
      name: p.name || '',
      description: p.description || '',
      story: p.story || '',
      price: String(p.price ?? ''),
      category: typeof p.category === 'object' ? p.category?._id : p.category || '',
      stock: String(p.stock ?? '0'),
      images: (p.images || []).join('\n'),
      beforeImage: p.beforeImage || '',
      features: (p.features || []).join('\n'),
      whyChooseHeading: p.whyChooseHeading || '',
      glassSetFormat: gsp.format === '24' || gsp.format === '612' ? gsp.format : '',
      setOf2: gsp.setOf2 != null ? String(gsp.setOf2) : '',
      setOf4: gsp.setOf4 != null ? String(gsp.setOf4) : '',
      setOf6: gsp.setOf6 != null ? String(gsp.setOf6) : '',
      setOf12: gsp.setOf12 != null ? String(gsp.setOf12) : '',
      fragrances: (p.fragrances || []).join('\n'),
      labelImageSurcharge: p.labelImageSurcharge != null ? String(p.labelImageSurcharge) : '',
      isFeatured: !!p.isFeatured,
      isTrending: !!p.isTrending,
      isActive: p.isActive !== false,
      hidden: !!p.hidden,
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const toLines = (s: string) =>
      s.split('\n').map((x) => x.trim()).filter(Boolean);
    const num = (s: string) => parseFloat(s) || 0;

    // Build the set-pricing object based on the chosen format. `null` clears it.
    let glassSetPricing: Record<string, unknown> | null = null;
    if (form.glassSetFormat === '24') {
      glassSetPricing = { format: '24', setOf2: num(form.setOf2), setOf4: num(form.setOf4) };
    } else if (form.glassSetFormat === '612') {
      glassSetPricing = { format: '612', setOf6: num(form.setOf6), setOf12: num(form.setOf12) };
    }

    const payload = {
      name: form.name,
      description: form.description,
      story: form.story,
      price: parseFloat(form.price) || 0,
      category: form.category,
      stock: parseInt(form.stock) || 0,
      images: toLines(form.images),
      beforeImage: form.beforeImage.trim(),
      features: toLines(form.features),
      whyChooseHeading: form.whyChooseHeading.trim(),
      glassSetPricing,
      fragrances: toLines(form.fragrances),
      labelImageSurcharge: num(form.labelImageSurcharge),
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      isActive: form.isActive,
      hidden: form.hidden,
    };
    try {
      if (editingId) {
        await adminApi.updateProduct(editingId, payload);
        toast.success('Product updated');
      } else {
        await adminApi.createProduct(payload);
        toast.success('Product created');
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
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await adminApi.deleteProduct(id);
      setProducts((p) => p.filter((x) => x._id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    }
  };

  return (
    <>
      <AdminHeading
        title="Products"
        action={
          <PrimaryButton onClick={openCreate}>
            <Plus size={16} /> Add Product
          </PrimaryButton>
        }
      />

      <div className="mb-4 flex max-w-sm items-center gap-2 rounded-xl border border-brand-blue/15 bg-white px-3">
        <Search size={16} className="text-charcoal/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-transparent py-2 text-sm focus:outline-none"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Table
          head={
            <tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th className="text-right">Price</Th>
              <Th className="text-right">Stock</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          }
        >
          {products.map((p) => (
            <tr key={p._id}>
              <Td>
                <div className="flex items-center gap-3">
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" loading="lazy" />
                  )}
                  <span className="font-semibold text-charcoal">{p.name}</span>
                </div>
              </Td>
              <Td className="text-charcoal/60">{p.categoryName || p.category?.name}</Td>
              <Td className="text-right font-semibold">{inr(p.price)}</Td>
              <Td className={`text-right font-semibold ${p.stock < 10 ? 'text-red-500' : ''}`}>{p.stock}</Td>
              <Td>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-bold ${
                    p.hidden || p.isActive === false ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {p.hidden ? 'Hidden' : p.isActive === false ? 'Inactive' : 'Active'}
                </span>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-brand-blue hover:bg-brand-blue/5" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => remove(p._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <Td>No products found.</Td>
              <Td /><Td /><Td /><Td /><Td />
            </tr>
          )}
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={save}>
          <SectionHeading title="Basic details" />
          <Field label="Name">
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Description">
            <textarea className={inputClass} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </Field>
          <Field label="Story">
            <textarea className={inputClass} rows={2} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Base price (₹)">
              <input type="number" className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </Field>
            <Field label="Stock">
              <input type="number" className={inputClass} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </Field>
          </div>
          <p className="-mt-2 mb-3 text-xs text-charcoal/50">
            For products sold in sets, set the base price to the lowest tier (Set of 2 or Set of 6).
          </p>
          <Field label="Category">
            <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <SectionHeading title="Images" />
          <Field label="Image URLs (one per line)">
            <textarea className={inputClass} rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
          </Field>
          <Field label="Before image URL (optional the original bottle photo)">
            <input className={inputClass} value={form.beforeImage} onChange={(e) => setForm({ ...form, beforeImage: e.target.value })} />
          </Field>

          <SectionHeading
            title="Set pricing / variants"
            hint="Choose a set format to sell this product in multiple quantities. Leave as “No sets” for a single-price product."
          />
          <Field label="Set format">
            <select
              className={inputClass}
              value={form.glassSetFormat}
              onChange={(e) => setForm({ ...form, glassSetFormat: e.target.value as '' | '24' | '612' })}
            >
              <option value="">No sets (single price)</option>
              <option value="24">Set of 2 &amp; Set of 4</option>
              <option value="612">Set of 6 &amp; Set of 12</option>
            </select>
          </Field>
          {form.glassSetFormat === '24' && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Set of 2 price (₹)">
                <input type="number" className={inputClass} value={form.setOf2} onChange={(e) => setForm({ ...form, setOf2: e.target.value })} required />
              </Field>
              <Field label="Set of 4 price (₹)">
                <input type="number" className={inputClass} value={form.setOf4} onChange={(e) => setForm({ ...form, setOf4: e.target.value })} required />
              </Field>
            </div>
          )}
          {form.glassSetFormat === '612' && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Set of 6 price (₹)">
                <input type="number" className={inputClass} value={form.setOf6} onChange={(e) => setForm({ ...form, setOf6: e.target.value })} required />
              </Field>
              <Field label="Set of 12 price (₹)">
                <input type="number" className={inputClass} value={form.setOf12} onChange={(e) => setForm({ ...form, setOf12: e.target.value })} required />
              </Field>
            </div>
          )}

          <SectionHeading
            title="Candle options"
            hint="Only used for scented candles. Leave fragrances blank for non-candle products."
          />
          <Field label="Fragrances (one per line)">
            <textarea
              className={inputClass}
              rows={2}
              placeholder={'Lemon\nRose\nMogra'}
              value={form.fragrances}
              onChange={(e) => setForm({ ...form, fragrances: e.target.value })}
            />
          </Field>
          <Field label="Custom-label surcharge (₹ per set)">
            <input type="number" className={inputClass} value={form.labelImageSurcharge} onChange={(e) => setForm({ ...form, labelImageSurcharge: e.target.value })} />
          </Field>

          <SectionHeading title="Highlights" />
          <Field label="Features (one per line)">
            <textarea
              className={inputClass}
              rows={3}
              placeholder={'Hand cut\nVolume: 350ml\nEco-friendly'}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </Field>
          <Field label="“Why choose” heading (optional)">
            <input className={inputClass} value={form.whyChooseHeading} onChange={(e) => setForm({ ...form, whyChooseHeading: e.target.value })} />
          </Field>

          <SectionHeading title="Visibility" />
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isTrending} onChange={(e) => setForm({ ...form, isTrending: e.target.checked })} /> Trending
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.hidden} onChange={(e) => setForm({ ...form, hidden: e.target.checked })} /> Hidden
            </label>
          </div>
          <PrimaryButton type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editingId ? 'Update Product' : 'Create Product'}
          </PrimaryButton>
        </form>
      </Modal>
    </>
  );
}
