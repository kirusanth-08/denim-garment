import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3, Filter, Package2, ShoppingBag } from 'lucide-react';
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
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
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
  const displayedProducts = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      if (availability === 'in-stock') {
        return product.availableUnits > 0;
      }

      if (availability === 'fast-dispatch') {
        return product.leadTimeDays <= 3;
      }

      return true;
    });

    const sortedProducts = [...filteredProducts];

    if (sortBy === 'price-low') {
      sortedProducts.sort((left, right) => left.pricePerUnit - right.pricePerUnit);
    } else if (sortBy === 'price-high') {
      sortedProducts.sort((left, right) => right.pricePerUnit - left.pricePerUnit);
    } else if (sortBy === 'lead-time') {
      sortedProducts.sort((left, right) => left.leadTimeDays - right.leadTimeDays);
    } else if (sortBy === 'name') {
      sortedProducts.sort((left, right) => left.name.localeCompare(right.name));
    } else {
      sortedProducts.sort((left, right) => {
        if (left.featured !== right.featured) {
          return left.featured ? -1 : 1;
        }

        return left.name.localeCompare(right.name);
      });
    }

    return sortedProducts;
  }, [availability, products, sortBy]);

  const totalInventory = displayedProducts.reduce((sum, product) => sum + product.availableUnits, 0);
  const fastDispatchCount = products.filter((product) => product.leadTimeDays <= 3).length;
  const featuredCount = products.filter((product) => product.featured).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Catalog Workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Product catalog</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Browse available products, refine the list quickly, and move straight to checkout once the unit counts are right.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/checkout"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
          >
            Proceed to checkout
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#fffdfa]"
          >
            Order history
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Visible products</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{displayedProducts.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Units available</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{totalInventory}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Fast dispatch items</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{fastDispatchCount}</p>
        </Card>
        <Card className="bg-forest p-5 text-white">
          <p className="text-sm text-white/70">Cart subtotal</p>
          <p className="mt-2 text-3xl font-semibold">{formatCurrency(totalAmount)}</p>
          <p className="mt-2 text-sm text-white/80">{totalUnits} units selected</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-accent" />
              <h2 className="text-lg font-semibold text-slate-950">Browse tools</h2>
            </div>

            <div className="mt-5 space-y-4">
              <SearchField value={search} onChange={setSearch} placeholder="Search name, SKU, fit, or fabric" />
              <SelectField
                label="Category"
                value={category}
                onChange={setCategory}
                options={[
                  { label: 'All categories', value: '' },
                  ...categories.map((option) => ({ label: option, value: option })),
                ]}
              />
              <SelectField
                label="Availability"
                value={availability}
                onChange={setAvailability}
                options={[
                  { label: 'All products', value: 'all' },
                  { label: 'In stock only', value: 'in-stock' },
                  { label: 'Fast dispatch', value: 'fast-dispatch' },
                ]}
              />
              <SelectField
                label="Sort by"
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { label: 'Featured first', value: 'featured' },
                  { label: 'Price: low to high', value: 'price-low' },
                  { label: 'Price: high to low', value: 'price-high' },
                  { label: 'Lead time', value: 'lead-time' },
                  { label: 'Name', value: 'name' },
                ]}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('');
                setAvailability('all');
                setSortBy('featured');
              }}
              className="mt-5 text-sm font-semibold text-accent transition hover:opacity-80"
            >
              Clear filters
            </button>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-950">Purchase snapshot</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-[22px] bg-[#f8f4ec] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Featured in catalog</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{featuredCount} products</p>
              </div>
              <div className="rounded-[22px] bg-[#f8f4ec] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Selected now</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{totalUnits} units</p>
              </div>
              <div className="rounded-[22px] bg-[#f8f4ec] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current subtotal</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-950">Buying guidance</h2>
            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
              <p className="inline-flex items-start gap-2">
                <Package2 size={16} className="mt-1 shrink-0 text-accent" />
                Minimum unit counts are enforced per product directly in the catalog.
              </p>
              <p className="inline-flex items-start gap-2">
                <Clock3 size={16} className="mt-1 shrink-0 text-accent" />
                Checkout delivery timing is based on the longest lead-time item in the order.
              </p>
              <p className="inline-flex items-start gap-2">
                <ShoppingBag size={16} className="mt-1 shrink-0 text-accent" />
                Use the cart drawer for quick adjustments, then confirm payment on the dedicated checkout page.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-panel sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                {displayedProducts.length} product{displayedProducts.length === 1 ? '' : 's'} shown
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {category ? `${category} category selected` : 'All categories'}{availability !== 'all' ? ` • ${availability.replace('-', ' ')}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {category ? <span className="rounded-full bg-[#f8f4ec] px-3 py-2 text-xs font-semibold text-slate-700">{category}</span> : null}
              {availability !== 'all' ? (
                <span className="rounded-full bg-[#eff5f3] px-3 py-2 text-xs font-semibold text-forest">{availability.replace('-', ' ')}</span>
              ) : null}
              {search.trim() ? <span className="rounded-full bg-[#fff3e3] px-3 py-2 text-xs font-semibold text-accent">Search: {search.trim()}</span> : null}
            </div>
          </div>

          {loading ? (
            <Card className="p-8 text-center text-slate-600">Loading the product catalog...</Card>
          ) : error ? (
            <Card className="p-8 text-center text-red-700">{error}</Card>
          ) : displayedProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-lg font-semibold text-slate-950">No products matched your current filters.</p>
              <p className="mt-2 text-sm text-slate-600">Clear a few filters or search more broadly to see more catalog items.</p>
            </Card>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartUnits={getItemUnits(product.id)}
                  onSaveUnits={setItemQuantity}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
