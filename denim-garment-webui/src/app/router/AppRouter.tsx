import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { useAuth } from '../context/AuthContext';
import { CheckoutPage } from '../../pages/checkout/CheckoutPage';
import { LandingPage } from '../../pages/landing/LandingPage';
import { LoginPage } from '../../pages/login/LoginPage';
import { OrderDetailPage } from '../../pages/order-detail/OrderDetailPage';
import { OrdersPage } from '../../pages/orders/OrdersPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';
import { ProductsPage } from '../../pages/products/ProductsPage';

const LoadingScreen = ({ label }: { label: string }) => (
  <div className="grid min-h-screen place-items-center px-6">
    <div className="max-w-md rounded-[32px] border border-white/70 bg-card px-8 py-10 text-center shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Dermas Apparel</p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-950">Preparing your buying portal</h1>
      <p className="mt-3 text-base text-slate-600">{label}</p>
    </div>
  </div>
);

const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen label="Checking your saved customer session." />;
  }

  return isAuthenticated ? <Navigate to="/products" replace /> : <LoginPage />;
};

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen label="Unlocking your catalog and purchase history." />;
  }

  return isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />;
};

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<GuestRoute />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:orderId" element={<OrderDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
