import { ArrowRight } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { cn } from '../../lib/cn';

export const TopNav = () => (
  <header className="sticky top-0 z-40 border-b border-white/70 bg-[#fbf6ed]/85 backdrop-blur">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
      <Link to="/dashboard" className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-content-center rounded-2xl bg-forest text-lg font-bold text-white shadow-lg shadow-forest/20">DA</div>
        <div>
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-accent">Dermas Apparel</p>
          <p className="text-xl font-semibold text-slate-950">Customer Purchase Portal</p>
        </div>
      </Link>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <nav className="flex flex-wrap items-center gap-2">
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
        </nav>

        <Link
          to="/purchases?new=1"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
        >
          New Purchase
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </header>
);

