import { useState } from 'react';
import { Bell, CircleUserRound, Search } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export const Topbar = () => {
  const { admin } = useAdminAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isSearchablePage = ['/stock-incomes', '/purchases', '/suppliers'].includes(location.pathname);
  const query = searchParams.get('query') ?? '';

  const placeholder =
    location.pathname === '/suppliers' ? 'Search suppliers...' : 'Search by income ID or supplier...';

  const handleSearchChange = (value: string) => {
    if (!isSearchablePage) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    const normalizedValue = value.trim();

    if (normalizedValue) {
      nextSearchParams.set('query', value);
    } else {
      nextSearchParams.delete('query');
    }

    setSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur sm:px-5 lg:px-6">
      <div />
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-500 sm:flex sm:min-w-[240px] lg:min-w-[280px]">
          <Search size={16} />
          <input
            type="text"
            value={isSearchablePage ? query : ''}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={isSearchablePage ? placeholder : 'Search is unavailable on this page'}
            disabled={!isSearchablePage}
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400"
            aria-label="Header search"
          />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((currentValue) => !currentValue)}
            className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={20} />
          </button>
          {showNotifications ? (
            <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[260px] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Notifications</p>
              <p className="mt-2 text-sm text-slate-600">No new notifications. Stock intake actions are up to date.</p>
            </div>
          ) : null}
        </div>
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
