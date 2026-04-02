import { CreditCard, Package2, Receipt, UserRound } from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { label: 'Products', path: '/products', icon: Package2 },
  { label: 'Payment', path: '/checkout', icon: CreditCard },
  { label: 'Orders', path: '/orders', icon: Receipt },
  { label: 'Profile', path: '/profile', icon: UserRound },
] as const;
