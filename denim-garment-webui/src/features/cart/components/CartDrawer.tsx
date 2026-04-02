import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../app/context/CartContext';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { formatCurrency } from '../../../lib/format';

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const navigate = useNavigate();
  const { items, totalAmount, totalUnits, incrementItem, decrementItem, removeItem, clearCart } = useCart();
  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    onClose();
    navigate('/checkout');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="drawer"
      title="Cart summary"
      description="Adjust your unit counts here, then continue to the payment page when the order looks right."
      footer={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">{totalUnits} total units</p>
            <p className="text-2xl font-semibold text-slate-950">{formatCurrency(totalAmount)}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Shipping and tax added at payment</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={clearCart} disabled={items.length === 0}>
              Clear cart
            </Button>
            <Button onClick={handleCheckout} disabled={items.length === 0}>
              <ShoppingBag size={16} />
              Continue to payment
            </Button>
          </div>
        </div>
      }
    >
      {items.length === 0 ? (
        <div className="rounded-[28px] bg-[#f8f4ec] px-6 py-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Your cart is empty</p>
          <p className="mt-2 text-sm text-slate-600">Add products from the catalog to build a unit-wise purchase order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="rounded-[28px] border border-mist bg-[#fffdfa] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{item.category}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.sku}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="rounded-full border border-mist bg-white p-2 text-slate-500 transition hover:text-red-600"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center rounded-full border border-mist bg-white px-2 py-2">
                  <button
                    type="button"
                    className="grid h-9 w-9 place-content-center rounded-full text-slate-500 transition hover:bg-slate-100"
                    onClick={() => decrementItem(item.productId)}
                    aria-label={`Reduce ${item.name} units`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-16 text-center text-base font-semibold text-slate-950">{item.units}</span>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-content-center rounded-full text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => incrementItem(item.productId)}
                      disabled={item.units >= item.availableUnits}
                    aria-label={`Increase ${item.name} units`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500">{item.priceLabel} per unit</p>
                  <p className="text-xl font-semibold text-slate-950">{formatCurrency(item.pricePerUnit * item.units)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
