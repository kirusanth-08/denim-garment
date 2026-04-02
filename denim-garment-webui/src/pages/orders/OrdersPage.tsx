import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Package2, ShoppingBag } from 'lucide-react';
import { useStorefrontData } from '../../app/context/StorefrontDataContext';
import { SearchField } from '../../components/forms/SearchField';
import { SelectField } from '../../components/forms/SelectField';
import { Card } from '../../components/ui/Card';
import { OrderStatusBadge } from '../../features/orders/components/OrderStatusBadge';
import { CustomerOrder } from '../../features/orders/types/order';
import { useApiResource } from '../../hooks/useApiResource';
import { formatDateTime } from '../../lib/format';

export const OrdersPage = () => {
  const { refreshKey } = useStorefrontData();
  const { data, loading, error } = useApiResource<CustomerOrder[]>('/customer/orders', [refreshKey]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const orders = data ?? [];
  const totalSpend = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalUnits = orders.reduce((sum, order) => sum + order.totalUnits, 0);
  const filteredOrders = orders.filter((order) => {
    const normalizedQuery = search.trim().toLowerCase();
    const matchesStatus = !status || order.status === status;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [order.id, order.company, order.status, ...order.items.map((item) => item.name)]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });
  const statuses = [...new Set(orders.map((order) => order.status))];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="grid gap-6 bg-[linear-gradient(135deg,#EDF7F3_0%,#F7F1E6_55%,#FFF8ED_100%)] p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Order History</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Track every customer order placed through the portal.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Review confirmed orders, inspect item-level totals, and move between order summary and delivery details without leaving the application.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] bg-white/85 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500">Orders placed</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{orders.length}</p>
            </div>
            <div className="rounded-[28px] bg-white/85 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500">Units purchased</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{totalUnits}</p>
            </div>
            <div className="rounded-[28px] bg-forest p-5 text-white shadow-lg shadow-forest/15 sm:col-span-3 lg:col-span-1">
              <p className="text-sm text-white/70">Total value</p>
              <p className="mt-2 text-3xl font-semibold">Rs. {Math.round(totalSpend).toLocaleString('en-US')}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <SearchField value={search} onChange={setSearch} placeholder="Search orders by ID, status, company, or item name" />
          <SelectField
            value={status}
            onChange={setStatus}
            options={[
              { label: 'All statuses', value: '' },
              ...statuses.map((option) => ({ label: option, value: option })),
            ]}
          />
        </div>
      </Card>

      {loading ? (
        <Card className="p-8 text-center text-slate-600">Loading your customer orders...</Card>
      ) : error ? (
        <Card className="p-8 text-center text-red-700">{error}</Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center">
            <ShoppingBag size={28} className="text-accent" />
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">No orders matched this view</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Try widening your filters or place a new denim order from the product catalog.</p>
            <Link to="/products" className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
              Browse products
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#f8f4ec] px-3 py-2 text-sm font-semibold text-slate-700">{order.id}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-slate-950">{order.company}</h2>
                  <p className="mt-2 text-sm text-slate-500">Placed by {order.customerName} on {formatDateTime(order.createdAt)}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[24px] bg-[#f8f4ec] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Units</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">{order.totalUnits}</p>
                  </div>
                  <div className="rounded-[24px] bg-[#f8f4ec] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Amount</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">{order.totalAmountLabel}</p>
                  </div>
                  <div className="rounded-[24px] bg-[#f8f4ec] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Est. arrival</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950">{order.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {order.items.slice(0, 3).map((item) => (
                  <span key={`${order.id}-${item.productId}`} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                    <Package2 size={14} className="text-accent" />
                    {item.name} x {item.units}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest/90"
                >
                  View order details
                </Link>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#f8f4ec] px-4 py-3 text-sm text-slate-600">
                  <ClipboardCheck size={16} className="text-accent" />
                  Payment {order.paymentStatus.toLowerCase()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
