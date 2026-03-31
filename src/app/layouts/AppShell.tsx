import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const sectionMap: Record<string, string> = {
  '/dashboard': 'Denim Garment Management System',
  '/purchases': 'Purchase Management',
  '/suppliers': 'Supplier Management',
  '/reports': 'Reports & Analytics',
};

export const AppShell = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <div className="border-b border-slate-200 px-6 py-4 text-3xl text-slate-500">{sectionMap[pathname] ?? ''}</div>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
