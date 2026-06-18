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

const emptyForm = {
  name: '',
  description: '',
  story: '',
  price: '',
  category: '',
  stock: '100',
  images: '',
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
    setForm({
      name: p.name || '',
      description: p.description || '',
      story: p.story || '',
      price: String(p.price ?? ''),
      category: typeof p.category === 'object' ? p.category?._id : p.category || '',
      stock: String(p.stock ?? '0'),
      images: (p.images || []).join('\n'),
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
    const payload = {
      name: form.name,
      description: form.description,
      story: form.story,
      price: parseFloat(form.price) || 0,
      category: form.category,
      stock: parseInt(form.stock) || 0,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
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
            <Field label="Price (₹)">
              <input type="number" className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </Field>
            <Field label="Stock">
              <input type="number" className={inputClass} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </Field>
          </div>
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
          <Field label="Image URLs (one per line)">
            <textarea className={inputClass} rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
          </Field>
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
