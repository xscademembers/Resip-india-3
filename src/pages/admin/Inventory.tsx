import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/ui';
import { AdminHeading, Table, Th, Td, inputClass } from './adminUi';
import type { ApiErrorShape } from '../../api/client';

export default function AdminInventory() {
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, { stock: string; lowStockThreshold: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .inventory()
      .then((list) => {
        setItems(list);
        const initial: typeof edits = {};
        list.forEach((p: any) => {
          initial[p._id] = { stock: String(p.stock ?? 0), lowStockThreshold: String(p.lowStockThreshold ?? 10) };
        });
        setEdits(initial);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const save = async (id: string) => {
    setSavingId(id);
    try {
      await adminApi.updateInventory(id, {
        stock: parseInt(edits[id].stock) || 0,
        lowStockThreshold: parseInt(edits[id].lowStockThreshold) || 0,
      });
      toast.success('Stock updated');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <AdminHeading title="Inventory" subtitle="Low-stock items are highlighted in red" />
      {loading ? (
        <Spinner />
      ) : (
        <Table
          head={
            <tr>
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th>Stock</Th>
              <Th>Low-stock threshold</Th>
              <Th className="text-right">Save</Th>
            </tr>
          }
        >
          {items.map((p) => {
            const edit = edits[p._id] || { stock: '0', lowStockThreshold: '10' };
            const isLow = (parseInt(edit.stock) || 0) <= (parseInt(edit.lowStockThreshold) || 0);
            return (
              <tr key={p._id} className={isLow ? 'bg-red-50/50' : ''}>
                <Td className="font-semibold text-charcoal">{p.name}</Td>
                <Td className="text-charcoal/50">{p.sku || ' '}</Td>
                <Td>
                  <input
                    type="number"
                    className={`${inputClass} w-24 ${isLow ? 'border-red-300' : ''}`}
                    value={edit.stock}
                    onChange={(e) => setEdits({ ...edits, [p._id]: { ...edit, stock: e.target.value } })}
                  />
                </Td>
                <Td>
                  <input
                    type="number"
                    className={`${inputClass} w-24`}
                    value={edit.lowStockThreshold}
                    onChange={(e) => setEdits({ ...edits, [p._id]: { ...edit, lowStockThreshold: e.target.value } })}
                  />
                </Td>
                <Td className="text-right">
                  <button
                    onClick={() => save(p._id)}
                    disabled={savingId === p._id}
                    className="inline-flex items-center gap-1 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-gold disabled:opacity-60"
                  >
                    <Save size={14} /> Save
                  </button>
                </Td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <Td>No products.</Td>
              <Td /><Td /><Td /><Td />
            </tr>
          )}
        </Table>
      )}
    </>
  );
}
