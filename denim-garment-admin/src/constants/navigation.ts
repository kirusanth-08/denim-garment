import type { LucideIcon } from 'lucide-react';
import { BarChart3, Boxes, LayoutDashboard, Users } from 'lucide-react';
import type { AdminRole } from '../features/auth/types/admin';

export type NavigationItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  allowedRoles?: AdminRole[];
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Stock Incomes', path: '/stock-incomes', icon: Boxes },
  { label: 'Suppliers', path: '/suppliers', icon: Users },
  { label: 'Reports', path: '/reports', icon: BarChart3, allowedRoles: ['admin'] },
];
