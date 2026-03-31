import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { PurchasesPage } from '../../pages/purchases/PurchasesPage';
import { SuppliersPage } from '../../pages/suppliers/SuppliersPage';
import { ReportsPage } from '../../pages/reports/ReportsPage';

export const AppRouter = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/purchases" element={<PurchasesPage />} />
      <Route path="/suppliers" element={<SuppliersPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  </Routes>
);
