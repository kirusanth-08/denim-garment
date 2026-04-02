import { ChevronLeft, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { NAVIGATION_ITEMS } from '../../constants/navigation';
import { cn } from '../../lib/cn';

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export const Sidebar = ({ collapsed, onToggleCollapse }: SidebarProps) => {
  const { admin, logout } = useAdminAuth();
  const visibleNavigationItems = NAVIGATION_ITEMS.filter(
    (item) => !item.allowedRoles || (admin ? item.allowedRoles.includes(admin.role) : false),
  );

  return (
    <aside className={cn('sticky top-0 flex h-screen shrink-0 flex-col bg-sidebar text-slate-100', collapsed ? 'w-[88px]' : 'w-[260px]')}>
      <div className={cn('border-b border-slate-800', collapsed ? 'px-3 py-5' : 'px-5 py-6')}>
        <div className="flex items-center gap-4">
          <div className="grid h-11 w-11 place-content-center rounded-xl bg-accent text-lg font-bold text-white shadow-lg shadow-amber-500/20">DA</div>
          {!collapsed ? (
            <div>
              <p className="text-xl font-semibold leading-tight">Dermas Apparel</p>
              <p className="mt-1 text-sm leading-tight text-slate-300">Stock Intake System</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-5">
        {!collapsed ? <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Menu</p> : null}
        <nav className="space-y-1.5">
          {visibleNavigationItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
                  collapsed ? 'justify-center' : 'gap-2.5',
                  isActive ? 'bg-accent text-white shadow-lg shadow-amber-500/20' : 'text-slate-200 hover:bg-slate-800/80',
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} />
              {!collapsed ? label : null}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={cn('mt-auto space-y-2 px-5 py-4', collapsed ? 'px-3' : 'px-5')}>
        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn('flex text-sm text-slate-400 transition hover:text-white', collapsed ? 'justify-center' : 'items-center gap-2.5')}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <ChevronLeft size={18} className={collapsed ? 'rotate-180' : undefined} /> {!collapsed ? 'Collapse' : null}
        </button>
        <button
          type="button"
          onClick={logout}
          className={cn('flex text-sm text-slate-100 transition hover:text-white', collapsed ? 'justify-center' : 'items-center gap-2.5')}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} /> {!collapsed ? 'Logout' : null}
        </button>
      </div>
    </aside>
  );
};
