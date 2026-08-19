import React, { useEffect, useState } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/ui';
import { AdminHeading, Table, Th, Td } from './adminUi';
import type { ApiErrorShape } from '../../api/client';

export default function AdminReviews() {
  const toast = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    adminApi
      .reviews({ limit: 100 })
      .then((res) => setReviews(res.reviews))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const setApproval = async (id: string, isApproved: boolean) => {
    try {
      await adminApi.updateReview(id, { isApproved });
      setReviews((r) => r.map((x) => (x._id === id ? { ...x, isApproved } : x)));
      toast.success(isApproved ? 'Review approved' : 'Review hidden');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await adminApi.deleteReview(id);
      setReviews((r) => r.filter((x) => x._id !== id));
      toast.success('Review deleted');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    }
  };

  return (
    <>
      <AdminHeading title="Reviews" subtitle="Moderate customer reviews" />
      {loading ? (
        <Spinner />
      ) : (
        <Table
          head={
            <tr>
              <Th>Product</Th>
              <Th>Customer</Th>
              <Th>Rating</Th>
              <Th>Comment</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          }
        >
          {reviews.map((r) => (
            <tr key={r._id}>
              <Td className="font-semibold text-charcoal">{r.product?.name || ' '}</Td>
              <Td className="text-charcoal/60">{r.user?.name || ' '}</Td>
              <Td>
                <span className="inline-flex items-center gap-1 text-brand-gold">
                  <Star size={14} fill="currentColor" /> {r.rating}
                </span>
              </Td>
              <Td className="max-w-xs truncate text-charcoal/70">{r.comment}</Td>
              <Td>
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${r.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {r.isApproved ? 'Approved' : 'Pending'}
                </span>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  {r.isApproved ? (
                    <button onClick={() => setApproval(r._id, false)} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50" aria-label="Hide">
                      <X size={16} />
                    </button>
                  ) : (
                    <button onClick={() => setApproval(r._id, true)} className="rounded-lg p-2 text-green-600 hover:bg-green-50" aria-label="Approve">
                      <Check size={16} />
                    </button>
                  )}
                  <button onClick={() => remove(r._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <Td>No reviews.</Td>
              <Td /><Td /><Td /><Td /><Td />
            </tr>
          )}
        </Table>
      )}
    </>
  );
}
