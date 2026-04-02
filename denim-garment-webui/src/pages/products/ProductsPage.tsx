import { useDeferredValue, useEffect, useState } from 'react';
import { ArrowRight, PackageCheck, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../app/context/CartContext';
import { useStorefrontData } from '../../app/context/StorefrontDataContext';
import { SearchField } from '../../components/forms/SearchField';
import { SelectField } from '../../components/forms/SelectField';
import { Card } from '../../components/ui/Card';
import { ProductCard } from '../../features/products/components/ProductCard';
import { ProductsResponse } from '../../features/products/types/product';
import { useApiResource } from '../../hooks/useApiResource';
import { withQuery } from '../../lib/api';
import { formatCurrency } from '../../lib/format';

export const ProductsPage = () => {
  const { getItemUnits, totalAmount, totalUnits, setItemQuantity, syncProducts } = useCart();
  const { refreshKey } = useStorefrontData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const deferredSearch = useDeferredValue(search);

  const { data, loading, error } = useApiResource<ProductsResponse>(
    withQuery('/products', {
      query: deferredSearch,
      category,
    }),
    [refreshKey],
  );

  useEffect(() => {
    if (data?.products) {
      syncProducts(data.products);
    }
  }, [data]);

  const products = data?.products ?? [];
  const categories = data?.categories ?? [];
  const featuredProducts = products.filter((product) => product.featured);
  const totalInventory = products.reduce((sum, product) => sum + product.availableUnits, 0);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="grid gap-6 bg-[linear-gradient(135deg,#FFF8ED_0%,#FFF5E2_52%,#EDF7F3_100%)] p-8 lg:grid-cols-[1.3fr_0.7fr] lg:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Product Catalog</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Browse denim products, set unit counts, and build the order before you ever hit payment.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              The catalog is optimized for repeat buying: inventory is visible, minimums are clear, and the cart stays live while you plan your purchase.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/checkout"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Go to payment
                <ArrowRight size={16} />
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-3 text-sm font-medium text-slate-700">
                <SlidersHorizontal size={16} className="text-accent" />
                Search, filter, and compare before checkout
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[28px] bg-white/80 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500">Products in view</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{products.length}</p>
            </div>
            <div className="rounded-[28px] bg-white/80 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500">Units available</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{totalInventory}</p>
            </div>
            <div className="rounded-[28px] bg-forest p-5 text-white shadow-lg shadow-forest/15 sm:col-span-2 lg:col-span-1">
              <p className="text-sm text-white/70">Cart subtotal</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(totalAmount)}</p>
              <p className="mt-2 text-sm text-white/80">{totalUnits} units ready for payment</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <SearchField value={search} onChange={setSearch} placeholder="Search by product name, SKU, category, fit, or fabric" />
            <SelectField
              value={category}
              onChange={setCategory}
              options={[
                { label: 'All categories', value: '' },
                ...categories.map((option) => ({ label: option, value: option })),
              ]}
            />
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Featured Right Now</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {featuredProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="rounded-[22px] bg-[#f8f4ec] px-4 py-4">
                <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                <p className="mt-1 text-sm text-slate-500">{product.badge}</p>
                <p className="mt-3 text-sm font-medium text-accent">{product.priceLabel}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {loading ? (
        <Card className="p-8 text-center text-slate-600">Loading the product catalog...</Card>
      ) : error ? (
        <Card className="p-8 text-center text-red-700">{error}</Card>
      ) : products.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-lg font-semibold text-slate-950">No products matched your search.</p>
          <p className="mt-2 text-sm text-slate-600">Try widening the filters to see more of the denim catalog.</p>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartUnits={getItemUnits(product.id)}
              onSaveUnits={setItemQuantity}
            />
          ))}
        </div>
      )}

      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Buying Flow</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">From selection to order confirmation in three clear steps</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f8f4ec] px-4 py-2">
              <ShoppingBag size={16} className="text-accent" />
              Add exact unit counts
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f8f4ec] px-4 py-2">
              <ArrowRight size={16} className="text-accent" />
              Review payment and delivery
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f8f4ec] px-4 py-2">
              <PackageCheck size={16} className="text-accent" />
              Track the order in history
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
