import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Card } from '../../components/ui/Card';
import type { AdminRole } from '../../features/auth/types/admin';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { PurchasesPage } from '../../pages/purchases/PurchasesPage';
import { SuppliersPage } from '../../pages/suppliers/SuppliersPage';
import { ReportsPage } from '../../pages/reports/ReportsPage';
import { LoginPage } from '../../pages/login/LoginPage';

const LoadingScreen = ({ label }: { label: string }) => (
  <div className="grid min-h-screen place-items-center px-6">
    <Card className="max-w-xl p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Denim Garment Management</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Preparing admin workspace</h1>
      <p className="mt-2.5 text-sm text-slate-600">{label}</p>
    </Card>
  </div>
);

const AccessDenied = () => (
  <div className="grid min-h-screen place-items-center px-6">
    <Card className="max-w-xl p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">Restricted Access</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">You do not have permission for this area.</h1>
      <p className="mt-2.5 text-sm text-slate-600">Sign in with an administrator role to access this management page.</p>
    </Card>
  </div>
);

const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <LoadingScreen label="Verifying your saved admin session." />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
};

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: AdminRole[] }) => {
  const { admin, isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <LoadingScreen label="Loading stock intake operations." />;
  }

  if (!isAuthenticated || !admin) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    return <AccessDenied />;
  }

  return <AppShell />;
};

export const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<GuestRoute />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/stock-incomes" element={<PurchasesPage />} />
      <Route path="/purchases" element={<Navigate to="/stock-incomes" replace />} />
      <Route path="/suppliers" element={<SuppliersPage />} />
    </Route>
    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
      <Route path="/reports" element={<ReportsPage />} />
    </Route>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
