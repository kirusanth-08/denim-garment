import { Bell, CircleUserRound, Search } from 'lucide-react';

export const Topbar = () => (
  <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
    <div />
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-2 text-slate-500">
        <Search size={24} />
        <span className="text-3xl">Search...</span>
      </div>
      <Bell size={24} className="text-slate-500" />
      <div className="h-10 w-px bg-slate-200" />
      <div className="flex items-center gap-3">
        <CircleUserRound size={42} className="text-accent" />
        <div>
          <p className="text-3xl text-slate-900">Admin</p>
          <p className="text-2xl text-slate-500">Manager</p>
        </div>
      </div>
    </div>
  </header>
);
