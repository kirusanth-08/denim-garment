import { LogOut, ShoppingBag } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { cn } from '../../lib/cn';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/format';

type TopNavProps = {
  onOpenCart: () => void;
};

export const TopNav = ({ onOpenCart }: TopNavProps) => {
  const navigate = useNavigate();
  const { customer, logout } = useAuth();
  const { totalAmount, totalUnits } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[#fbf6ed]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/products" className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-content-center rounded-2xl bg-forest text-lg font-bold text-white shadow-lg shadow-forest/20">DA</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Dermas Apparel</p>
              <p className="text-xl font-semibold text-slate-950">Customer Commerce Portal</p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-900/5 transition hover:bg-white"
            >
              <ShoppingBag size={17} />
              <span>Cart</span>
              <span className="hidden text-slate-400 sm:inline">{formatCurrency(totalAmount)}</span>
              <span className="grid h-7 min-w-7 place-content-center rounded-full bg-accent px-2 text-xs text-white">{totalUnits}</span>
            </button>

            <div className="hidden rounded-full border border-white/70 bg-white/70 px-4 py-2 text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{customer?.name}</p>
              <p className="text-xs text-slate-500">
                {customer?.company}
                {customer?.tier ? ` • ${customer.tier}` : ''}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate('/', { replace: true });
              }}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {NAVIGATION_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                  isActive ? 'bg-forest text-white shadow-lg shadow-forest/15' : 'bg-white/70 text-slate-700 hover:bg-white',
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};
