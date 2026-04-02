import { Bell, CircleUserRound, Search } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const Topbar = () => {
  const { admin } = useAdminAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur sm:px-5 lg:px-6">
      <div />
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-500 sm:flex sm:min-w-[240px] lg:min-w-[280px]">
          <Search size={16} />
          <span className="text-sm">Search stock incomes, suppliers...</span>
        </div>
        <button className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
        <div className="flex items-center gap-3">
          <CircleUserRound size={34} className="text-accent" />
          <div>
            <p className="text-base font-semibold text-slate-900">{admin?.name ?? 'Admin User'}</p>
            <p className="text-xs text-slate-500">{admin?.roleLabel ?? 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
