import { CircleDollarSign, Clock3, ShoppingCart, TrendingUp, Truck, Users } from 'lucide-react';
import { DashboardData } from '../types/dashboard';

export const dashboardData: DashboardData = {
  stats: [
    {
      label: 'Total Purchases',
      value: 'Rs. 1563K',
      subtext: 'This month',
      highlight: '↓ 12% vs last month',
      highlightClassName: 'text-red-500',
      icon: CircleDollarSign,
      iconColor: 'text-blue-500',
    },
    {
      label: 'Total Orders',
      value: '8',
      subtext: 'All time',
      highlight: '3 new this month',
      highlightClassName: 'text-emerald-500',
      icon: ShoppingCart,
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Pending Orders',
      value: '3',
      subtext: 'Awaiting approval',
      highlight: '2 approved',
      highlightClassName: 'text-blue-500',
      icon: Clock3,
      iconColor: 'text-amber-500',
    },
    {
      label: 'Suppliers',
      value: '6',
      subtext: 'Active partners',
      highlight: '↑ 2 new this quarter',
      highlightClassName: 'text-emerald-500',
      icon: Users,
      iconColor: 'text-amber-500',
    },
  ],
  monthlyTrend: [
    { month: 'Sep', value: 1800 },
    { month: 'Oct', value: 2200 },
    { month: 'Nov', value: 1950 },
    { month: 'Dec', value: 2800 },
    { month: 'Jan', value: 2400 },
    { month: 'Feb', value: 2100 },
    { month: 'Mar', value: 1600 },
  ],
  quickOverview: [
    { title: 'Delivered Orders', subtitle: '1 completed', icon: Truck, tone: 'bg-emerald-50 border-emerald-100 text-emerald-500' },
    { title: 'Pending Approval', subtitle: '3 orders waiting', icon: Clock3, tone: 'bg-amber-50 border-amber-100 text-amber-500' },
    { title: 'Top Supplier', subtitle: 'Denim Direct — Rs. 1.2M', icon: TrendingUp, tone: 'bg-blue-50 border-blue-100 text-blue-500' },
  ],
};
