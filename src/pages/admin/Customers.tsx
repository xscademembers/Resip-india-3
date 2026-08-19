import React, { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { Spinner, inr } from '../../components/ui';
import { AdminHeading, Table, Th, Td, Modal } from './adminUi';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<{ customer: any; orders: any[] } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.customers({ search: search || undefined, limit: 100 });
      setCustomers(res.customers);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = async (id: string) => {
    try {
      const res = await adminApi.customerDetail(id);
      setDetail({ customer: res.customer, orders: res.orders });
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <AdminHeading title="Customers" />

      <div className="mb-4 flex max-w-sm items-center gap-2 rounded-xl border border-brand-blue/15 bg-white px-3">
        <Search size={16} className="text-charcoal/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full bg-transparent py-2 text-sm focus:outline-none"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Table
          head={
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Joined</Th>
            </tr>
          }
        >
          {customers.map((c) => (
            <tr key={c._id} className="cursor-pointer hover:bg-brand-blue/5" onClick={() => openDetail(c._id)}>
              <Td className="font-semibold text-charcoal">{c.name}</Td>
              <Td className="text-charcoal/60">{c.email}</Td>
              <Td className="text-charcoal/60">{c.phone || ' '}</Td>
              <Td className="text-charcoal/60">{new Date(c.createdAt).toLocaleDateString('en-IN')}</Td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <Td>No customers.</Td>
              <Td /><Td /><Td />
            </tr>
          )}
        </Table>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.customer?.name || ''}>
        {detail && (
          <div>
            <div className="mb-4 rounded-xl bg-brand-bg p-4 text-sm">
              <p>{detail.customer.email}</p>
              <p className="text-charcoal/60">{detail.customer.phone || 'No phone'}</p>
            </div>
            <h3 className="mb-2 text-sm font-bold text-brand-blue">Recent Orders ({detail.orders.length})</h3>
            <ul className="divide-y divide-brand-blue/10 text-sm">
              {detail.orders.map((o) => (
                <li key={o._id} className="flex justify-between py-2">
                  <span>#{o.orderId} · {o.orderStatus}</span>
                  <span className="font-semibold">{inr(o.totalAmount)}</span>
                </li>
              ))}
              {detail.orders.length === 0 && <li className="py-2 text-charcoal/40">No orders yet.</li>}
            </ul>
          </div>
        )}
      </Modal>
    </>
  );
}
