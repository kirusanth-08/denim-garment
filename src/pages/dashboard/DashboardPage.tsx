import { BarChartCard } from '../../components/charts/BarChartCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { InfoCard } from '../../features/dashboard/components/InfoCard';
import { StatCard } from '../../features/dashboard/components/StatCard';
import { dashboardData } from '../../features/dashboard/data/dashboardData';

export const DashboardPage = () => (
  <div>
    <PageHeader
      eyebrow="Denim Garment Management System"
      title="Dashboard"
      subtitle="Overview of Dermas Apparel purchase operations"
    />

    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {dashboardData.stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>

    <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <BarChartCard title="Monthly Purchase Trend" data={dashboardData.monthlyTrend} />
      <InfoCard title="Quick Overview" items={dashboardData.quickOverview} />
    </div>
  </div>
);
