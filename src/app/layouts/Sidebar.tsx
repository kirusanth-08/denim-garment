import { ChevronLeft, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { cn } from '../../lib/cn';

export const Sidebar = () => (
  <aside className="flex h-screen w-72 flex-col bg-sidebar text-slate-100">
    <div className="border-b border-slate-800 p-5">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-content-center rounded-2xl bg-accent text-3xl font-bold">DA</div>
        <div>
          <p className="text-3xl font-semibold">Dermas Apparel</p>
          <p className="text-3xl text-slate-300">Purchase System</p>
        </div>
      </div>
    </div>

    <div className="p-4">
      <p className="mb-4 text-xl font-semibold uppercase tracking-widest text-slate-400">Menu</p>
      <nav className="space-y-2">
        {NAVIGATION_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-3xl transition', isActive ? 'bg-accent text-white' : 'text-slate-200 hover:bg-slate-800')
            }
          >
            <Icon size={24} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>

    <div className="mt-auto space-y-4 p-5 text-3xl">
      <button className="flex items-center gap-3 text-slate-400 hover:text-white">
        <ChevronLeft size={22} /> Collapse
      </button>
      <button className="flex items-center gap-3 text-slate-100 hover:text-white">
        <LogOut size={22} /> Logout
      </button>
    </div>
  </aside>
);
