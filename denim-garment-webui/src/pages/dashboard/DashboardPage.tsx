import { CircleDollarSign, Clock3, ShoppingCart, TrendingUp, Truck, Users, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChartCard } from '../../components/charts/BarChartCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { usePortalDataContext } from '../../app/context/PortalDataContext';
import { SummaryPanel } from '../../features/dashboard/components/SummaryPanel';
import { MetricCard } from '../../features/dashboard/components/MetricCard';
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
  currency: { icon: CircleDollarSign, iconColor: 'text-accent' },
  orders: { icon: ShoppingCart, iconColor: 'text-forest' },
  pending: { icon: Clock3, iconColor: 'text-amber-500' },
  suppliers: { icon: Users, iconColor: 'text-blue-500' },
};

const statToneMap: Record<TrendTone, string> = {
  positive: 'text-emerald-600',
  negative: 'text-red-500',
  neutral: 'text-slate-500',
  info: 'text-blue-600',
};

const overviewIconMap: Record<QuickOverviewIconKey, LucideIcon> = {
  truck: Truck,
  clock: Clock3,
  trend: TrendingUp,
};

const overviewToneMap: Record<QuickOverviewTone, string> = {
  success: 'border-emerald-100 bg-emerald-50 text-emerald-500',
  warning: 'border-amber-100 bg-amber-50 text-amber-500',
  info: 'border-blue-100 bg-blue-50 text-blue-500',
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
  const navigate = useNavigate();
  const { version } = usePortalDataContext();
  const { data, loading, error } = useApiResource<DashboardApiResponse>('/dashboard', [version]);
  const dashboardData = data ? toDashboardView(data) : null;

  return (
    <div>
      <PageHeader
        eyebrow="Customer purchase visibility"
        title="Source denim orders with a clearer view"
        subtitle="Stay on top of requests, supplier activity, and approval progress from a single customer-facing workspace."
        action={<Button onClick={() => navigate('/purchases?new=1')}>Create Purchase Request</Button>}
      />

      <Card className="mb-6 overflow-hidden bg-forest p-8 text-white">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Portal Snapshot</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Every request, supplier touchpoint, and trend in one place.</h2>
            <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
              Submit purchase requests faster, keep an eye on pending approvals, and understand which supplier relationships are driving your current volume.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => navigate('/purchases?new=1')}>
                Start New Request
              </Button>
              <Button variant="ghost" className="border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={() => navigate('/reports')}>
                Review Insights
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              'Track monthly spend without leaving the portal.',
              'View supplier coverage before placing new orders.',
              'Keep approvals moving with live status updates.',
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-white/15 bg-white/10 px-4 py-4 text-sm text-white/85">
                {item}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {error && !dashboardData ? <Card className="p-6 text-base text-red-600">Could not load dashboard data. {error}</Card> : null}

      {!dashboardData ? (
        <Card className="p-6 text-base text-slate-500">{loading ? 'Loading dashboard data...' : 'No dashboard data available.'}</Card>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {dashboardData.stats.map((stat) => (
              <MetricCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <BarChartCard title="Purchase Trend" data={dashboardData.monthlyTrend} />
            <SummaryPanel title="Quick Summary" items={dashboardData.quickOverview} />
          </div>
        </>
      )}
    </div>
  );
};
