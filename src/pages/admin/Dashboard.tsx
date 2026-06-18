import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingCart, Users, Package, AlertTriangle } from 'lucide-react';
import { adminApi, type DashboardData } from '../../api/admin';
import { Spinner, inr } from '../../components/ui';
import { AdminHeading, StatCard, Card, Table, Th, Td } from './adminUi';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .dashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <p className="text-charcoal/60">Failed to load dashboard.</p>;

  const maxMonthly = Math.max(1, ...(data.monthlyRevenue || []).map((m) => m.total));

  return (
    <>
      <AdminHeading title="Dashboard" subtitle="Store performance at a glance" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={inr(data.totalRevenue)} icon={<IndianRupee size={18} />} />
        <StatCard label="Orders" value={data.totalOrders} icon={<ShoppingCart size={18} />} />
        <StatCard label="Customers" value={data.totalCustomers} icon={<Users size={18} />} />
        <StatCard label="Products" value={data.totalProducts} icon={<Package size={18} />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-brand-blue">Revenue (last 12 months)</h2>
          <div className="mt-6 flex h-48 items-end gap-2">
            {(data.monthlyRevenue || []).map((m, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-brand-blue/80"
                  style={{ height: `${(m.total / maxMonthly) * 100}%` }}
                  title={inr(m.total)}
                />
                <span className="text-[10px] text-charcoal/40">{String(m._id?.month ?? m._id ?? i + 1)}</span>
              </div>
            ))}
            {(!data.monthlyRevenue || data.monthlyRevenue.length === 0) && (
              <p className="text-sm text-charcoal/40">No revenue data yet.</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold text-brand-blue">Orders by Status</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(data.ordersByStatus || {}).map(([status, count]) => (
              <li key={status} className="flex justify-between">
                <span className="text-charcoal/60">{status}</span>
                <span className="font-bold text-brand-blue">{count}</span>
              </li>
            ))}
            {Object.keys(data.ordersByStatus || {}).length === 0 && (
              <li className="text-charcoal/40">No orders yet.</li>
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-brand-blue">Recent Orders</h2>
          <Table
            head={
              <tr>
                <Th>Order</Th>
                <Th>Status</Th>
                <Th className="text-right">Total</Th>
              </tr>
            }
          >
            {(data.recentOrders || []).map((o: any) => (
              <tr key={o._id}>
                <Td>
                  <Link to={`/admin/orders`} className="font-semibold text-brand-blue">
                    #{o.orderId}
                  </Link>
                </Td>
                <Td>{o.orderStatus}</Td>
                <Td className="text-right font-semibold">{inr(o.totalAmount)}</Td>
              </tr>
            ))}
            {(!data.recentOrders || data.recentOrders.length === 0) && (
              <tr>
                <Td>No recent orders.</Td>
                <Td />
                <Td />
              </tr>
            )}
          </Table>
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-brand-blue">
            <AlertTriangle size={18} className="text-brand-gold" /> Low Stock
          </h2>
          <Table
            head={
              <tr>
                <Th>Product</Th>
                <Th className="text-right">Stock</Th>
              </tr>
            }
          >
            {(data.lowStockProducts || []).map((p: any) => (
              <tr key={p._id}>
                <Td>{p.name}</Td>
                <Td className="text-right font-bold text-red-500">{p.stock}</Td>
              </tr>
            ))}
            {(!data.lowStockProducts || data.lowStockProducts.length === 0) && (
              <tr>
                <Td>All products well stocked.</Td>
                <Td />
              </tr>
            )}
          </Table>
        </div>
      </div>
    </>
  );
}
