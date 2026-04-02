import { ChevronLeft, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { cn } from '../../lib/cn';

export const Sidebar = () => (
  <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col bg-sidebar text-slate-100">
    <div className="border-b border-slate-800 px-6 py-7">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-content-center rounded-2xl bg-accent text-2xl font-bold text-white shadow-lg shadow-amber-500/20">DA</div>
        <div>
          <p className="text-2xl font-semibold leading-tight">Dermas Apparel</p>
          <p className="mt-1 text-lg leading-tight text-slate-300">Purchase System</p>
        </div>
      </div>
    </div>

    <div className="px-4 py-6">
      <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Menu</p>
      <nav className="space-y-1.5">
        {NAVIGATION_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-medium transition',
                isActive ? 'bg-accent text-white shadow-lg shadow-amber-500/20' : 'text-slate-200 hover:bg-slate-800/80',
              )
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>

    <div className="mt-auto space-y-2 px-6 py-5">
      <button className="flex items-center gap-3 text-base text-slate-400 transition hover:text-white">
        <ChevronLeft size={18} /> Collapse
      </button>
      <button className="flex items-center gap-3 text-base text-slate-100 transition hover:text-white">
        <LogOut size={18} /> Logout
      </button>
    </div>
  </aside>
);
