import { BarChart3, LayoutDashboard, ShoppingCart, Users } from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Purchases', path: '/purchases', icon: ShoppingCart },
  { label: 'Suppliers', path: '/suppliers', icon: Users },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
] as const;
