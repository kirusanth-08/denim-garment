import { CircleDollarSign, Clock3, ShoppingCart, TrendingUp, Truck, Users, type LucideIcon } from 'lucide-react';
import { BarChartCard } from '../../components/charts/BarChartCard';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { InfoCard } from '../../features/dashboard/components/InfoCard';
import { StatCard } from '../../features/dashboard/components/StatCard';
import {
  DashboardApiResponse,
  DashboardData,
  DashboardStatIconKey,
  QuickOverviewIconKey,
  QuickOverviewTone,
} from '../../features/dashboard/types/dashboard';
import { useApiResource } from '../../hooks/useApiResource';
import { TrendTone } from '../../types/common';

const statIconMap: Record<DashboardStatIconKey, { icon: LucideIcon; iconColor: string }> = {
  currency: { icon: CircleDollarSign, iconColor: 'text-blue-500' },
  orders: { icon: ShoppingCart, iconColor: 'text-emerald-500' },
  pending: { icon: Clock3, iconColor: 'text-amber-500' },
  suppliers: { icon: Users, iconColor: 'text-amber-500' },
};

const statToneMap: Record<TrendTone, string> = {
  positive: 'text-emerald-500',
  negative: 'text-red-500',
  neutral: 'text-slate-500',
  info: 'text-blue-500',
};

const overviewIconMap: Record<QuickOverviewIconKey, LucideIcon> = {
  truck: Truck,
  clock: Clock3,
  trend: TrendingUp,
};

const overviewToneMap: Record<QuickOverviewTone, string> = {
  success: 'bg-emerald-50 border-emerald-100 text-emerald-500',
  warning: 'bg-amber-50 border-amber-100 text-amber-500',
  info: 'bg-blue-50 border-blue-100 text-blue-500',
};

const toDashboardView = (payload: DashboardApiResponse): DashboardData => ({
  stats: payload.stats.map((stat) => ({
    ...stat,
    icon: statIconMap[stat.iconKey].icon,
    iconColor: statIconMap[stat.iconKey].iconColor,
    highlightClassName: statToneMap[stat.highlightTone],
  })),
  monthlyTrend: payload.monthlyTrend,
  quickOverview: payload.quickOverview.map((item) => ({
    ...item,
    icon: overviewIconMap[item.iconKey],
    tone: overviewToneMap[item.tone],
  })),
});

export const DashboardPage = () => {
  const { data, loading, error } = useApiResource<DashboardApiResponse>('/dashboard');
  const dashboardData = data ? toDashboardView(data) : null;

  return (
    <div>
      <PageHeader
        eyebrow="Denim Garment Management System"
        title="Dashboard"
        subtitle="Overview of Dermas Apparel stock intake operations"
      />

      {error && !dashboardData ? (
        <Card className="p-6 text-base text-red-600">Could not load dashboard data. {error}</Card>
      ) : null}

      {!dashboardData ? (
        <Card className="p-6 text-base text-slate-500">{loading ? 'Loading dashboard data...' : 'No dashboard data available.'}</Card>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {dashboardData.stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <BarChartCard title="Monthly Stock Income Trend" data={dashboardData.monthlyTrend} />
            <InfoCard title="Quick Overview" items={dashboardData.quickOverview} />
          </div>
        </>
      )}
    </div>
  );
};
