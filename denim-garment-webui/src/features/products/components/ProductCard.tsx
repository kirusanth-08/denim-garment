import { useEffect, useState } from 'react';
import { Clock3, Minus, Package2, Plus, ShoppingBag, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Product } from '../types/product';

type ProductCardProps = {
  product: Product;
  cartUnits: number;
  onSaveUnits: (product: Product, units: number) => void;
};

const normalizeUnits = (product: Product, value: string) => {
  const parsed = Math.floor(Number(value));

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return product.minUnits;
  }

  return Math.max(product.minUnits, Math.min(product.availableUnits, parsed));
};

export const ProductCard = ({ product, cartUnits, onSaveUnits }: ProductCardProps) => {
  const [draftUnits, setDraftUnits] = useState(String(cartUnits || product.minUnits));

  useEffect(() => {
    setDraftUnits(String(cartUnits || product.minUnits));
  }, [cartUnits, product.minUnits]);

  const hasStock = product.availableUnits > 0;
  const nextUnits = normalizeUnits(product, draftUnits);

  return (
    <Card className="overflow-hidden">
      <div className="h-3 w-full" style={{ backgroundColor: product.color }} />
      <div className="space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{product.category}</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">{product.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{product.sku}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {product.badge ? <span className="rounded-full bg-[#fff3e3] px-3 py-1 text-xs font-semibold text-accent">{product.badge}</span> : null}
            <div className="rounded-2xl bg-[#eff5f3] p-3 text-forest">
              <Package2 size={20} />
            </div>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600">{product.description}</p>

        <div className="grid gap-3 rounded-[24px] bg-[#f8f4ec] p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Unit Price</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{product.priceLabel}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Available</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{product.availableUnits} units</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Minimum</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{product.minUnits} units</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-mist bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Fabric</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{product.fabric}</p>
          </div>
          <div className="rounded-[24px] border border-mist bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Fit</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{product.fit}</p>
          </div>
          <div className="rounded-[24px] border border-mist bg-white/80 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Lead Time</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Clock3 size={14} className="text-accent" />
              {product.leadTimeDays} days
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center rounded-full border border-mist bg-white px-2 py-2">
              <button
                type="button"
                className="grid h-9 w-9 place-content-center rounded-full text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setDraftUnits(String(Math.max(product.minUnits, nextUnits - 1)))}
                disabled={!hasStock}
                aria-label={`Reduce ${product.name} units`}
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min={product.minUnits}
                max={product.availableUnits}
                value={draftUnits}
                onChange={(event) => setDraftUnits(event.target.value)}
                className="w-20 border-0 bg-transparent text-center text-base font-semibold text-slate-950 outline-none"
              />
              <button
                type="button"
                className="grid h-9 w-9 place-content-center rounded-full text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setDraftUnits(String(Math.min(product.availableUnits, nextUnits + 1)))}
                disabled={!hasStock || nextUnits >= product.availableUnits}
                aria-label={`Increase ${product.name} units`}
              >
                <Plus size={16} />
              </button>
            </div>

            {cartUnits > 0 ? (
              <span className="rounded-full bg-forest px-3 py-2 text-sm font-medium text-white">{cartUnits} units in cart</span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#eff5f3] px-3 py-2 text-sm font-medium text-forest">
                <Sparkles size={14} />
                Ready to add
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="min-w-[11rem]"
              onClick={() => onSaveUnits(product, nextUnits)}
              disabled={!hasStock}
            >
              <ShoppingBag size={16} />
              {cartUnits > 0 ? 'Update cart' : 'Add to cart'}
            </Button>

            {cartUnits > 0 ? (
              <Button variant="ghost" onClick={() => onSaveUnits(product, 0)}>
                <Trash2 size={16} />
                Remove
              </Button>
            ) : null}

            {!hasStock ? <span className="text-sm font-medium text-red-600">Currently out of stock</span> : null}
          </div>
        </div>
      </div>
    </Card>
  );
};
