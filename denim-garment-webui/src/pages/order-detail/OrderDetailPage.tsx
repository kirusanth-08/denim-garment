import { ArrowLeft, CreditCard, MapPin, Package2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { OrderStatusBadge } from '../../features/orders/components/OrderStatusBadge';
import { CustomerOrder } from '../../features/orders/types/order';
import { useApiResource } from '../../hooks/useApiResource';
import { formatDate, formatDateTime } from '../../lib/format';

const ORDER_TIMELINE_STEPS = ['Processing', 'Packed', 'Dispatched', 'Delivered'];

const getStepState = (orderStatus: string, step: string) => {
  const orderRank = orderStatus === 'Delivered' ? 3 : orderStatus === 'Dispatched' ? 2 : orderStatus === 'Packed' ? 1 : 0;
  const stepRank = ORDER_TIMELINE_STEPS.indexOf(step);
  return stepRank <= orderRank;
};

export const OrderDetailPage = () => {
  const { orderId = '' } = useParams();
  const { data, loading, error } = useApiResource<CustomerOrder>(`/customer/orders/${orderId}`, [orderId]);

  if (loading) {
    return <Card className="p-8 text-center text-slate-600">Loading order details...</Card>;
  }

  if (error || !data) {
    return <Card className="p-8 text-center text-red-700">{error ?? 'Order could not be loaded.'}</Card>;
  }

  return (
    <div className="space-y-6">
      <Link to="/orders" className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#fffdfa]">
        <ArrowLeft size={16} />
        Back to order history
      </Link>

      <Card className="overflow-hidden">
        <div className="grid gap-6 bg-[linear-gradient(135deg,#FFF8ED_0%,#F6F0E4_58%,#EDF7F3_100%)] p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#f8f4ec] px-3 py-2 text-sm font-semibold text-slate-700">{data.id}</span>
              <OrderStatusBadge status={data.status} />
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">Customer order detail</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Ordered by {data.customerName} for {data.company} on {formatDateTime(data.createdAt)}.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] bg-white/85 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500">Total amount</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{data.totalAmountLabel}</p>
            </div>
            <div className="rounded-[28px] bg-white/85 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500">Units</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{data.totalUnits}</p>
            </div>
            <div className="rounded-[28px] bg-forest p-5 text-white shadow-lg shadow-forest/15 sm:col-span-3 lg:col-span-1">
              <p className="text-sm text-white/70">Estimated delivery</p>
              <p className="mt-2 text-3xl font-semibold">{formatDate(data.estimatedDelivery)}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-950">Line items</h2>
            <div className="mt-6 grid gap-4">
              {data.items.map((item) => (
                <div key={item.productId} className="rounded-[24px] border border-mist bg-[#fffdfa] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{item.category}</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{item.sku}</p>
                    </div>
                    <Package2 size={18} className="text-accent" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Units</p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{item.units}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Unit price</p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{item.unitPriceLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Line total</p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{item.lineTotalLabel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-950">Order progress</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {ORDER_TIMELINE_STEPS.map((step) => {
                const active = getStepState(data.status, step);
                return (
                  <div key={step} className={`rounded-[24px] px-4 py-5 ${active ? 'bg-forest text-white' : 'bg-[#f8f4ec] text-slate-500'}`}>
                    <p className="text-xs uppercase tracking-[0.22em]">{step}</p>
                    <p className="mt-3 text-sm font-semibold">{active ? 'Reached' : 'Pending'}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-950">Totals</h2>
            <div className="mt-6 space-y-3 rounded-[24px] bg-[#f8f4ec] p-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{data.subtotalLabel}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span>{data.shippingFeeLabel}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Tax</span>
                <span>{data.taxAmountLabel}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/70 pt-3 text-base font-semibold text-slate-950">
                <span>Total paid</span>
                <span>{data.totalAmountLabel}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-accent" />
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Delivery and billing</h2>
                <p className="text-sm text-slate-500">{data.shippingMethod} • estimated arrival {formatDate(data.estimatedDelivery)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] bg-[#fffdfa] p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">Shipping address</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {data.shippingAddress.company}
                  <br />
                  {data.shippingAddress.recipient}
                  <br />
                  {data.shippingAddress.line1}
                  {data.shippingAddress.line2 ? <><br />{data.shippingAddress.line2}</> : null}
                  <br />
                  {data.shippingAddress.city}, {data.shippingAddress.region} {data.shippingAddress.postalCode}
                  <br />
                  {data.shippingAddress.country}
                  <br />
                  {data.shippingAddress.phone}
                </p>
              </div>

              <div className="rounded-[24px] bg-[#fffdfa] p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">Billing address</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {data.billingAddress.company}
                  <br />
                  {data.billingAddress.recipient}
                  <br />
                  {data.billingAddress.line1}
                  {data.billingAddress.line2 ? <><br />{data.billingAddress.line2}</> : null}
                  <br />
                  {data.billingAddress.city}, {data.billingAddress.region} {data.billingAddress.postalCode}
                  <br />
                  {data.billingAddress.country}
                  <br />
                  {data.billingAddress.phone}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-accent" />
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Payment summary</h2>
                <p className="text-sm text-slate-500">{data.paymentStatus} via {data.paymentSummary.label}</p>
              </div>
            </div>

            {data.notes ? (
              <div className="mt-6 rounded-[24px] bg-[#f8f4ec] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Order notes</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{data.notes}</p>
              </div>
            ) : null}

            <Link to="/products" className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
              Continue shopping
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
