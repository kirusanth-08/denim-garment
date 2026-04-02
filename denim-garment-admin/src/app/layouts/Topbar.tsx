import { Bell, CircleUserRound, Search } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const Topbar = () => {
  const { admin } = useAdminAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div />
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500 sm:flex sm:min-w-[280px] lg:min-w-[320px]">
          <Search size={18} />
          <span className="text-base">Search stock incomes, suppliers...</span>
        </div>
        <button className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className="hidden h-10 w-px bg-slate-200 sm:block" />
        <div className="flex items-center gap-3">
          <CircleUserRound size={38} className="text-accent" />
          <div>
            <p className="text-xl font-semibold text-slate-900">{admin?.name ?? 'Admin User'}</p>
            <p className="text-sm text-slate-500">{admin?.roleLabel ?? 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
