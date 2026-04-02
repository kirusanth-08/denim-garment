import { LucideIcon } from 'lucide-react';
import { ChartPoint, TrendTone } from '../../../types/common';

export type DashboardStat = {
  label: string;
  value: string;
  subtext: string;
  highlight: string;
  highlightClassName: string;
  icon: LucideIcon;
  iconColor: string;
};

export type QuickOverviewItem = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: string;
};

export type DashboardStatIconKey = 'currency' | 'orders' | 'pending' | 'suppliers';
export type QuickOverviewIconKey = 'truck' | 'clock' | 'trend';
export type QuickOverviewTone = 'success' | 'warning' | 'info';

export type DashboardStatApi = {
  label: string;
  value: string;
  subtext: string;
  highlight: string;
  highlightTone: TrendTone;
  iconKey: DashboardStatIconKey;
};

export type QuickOverviewItemApi = {
  title: string;
  subtitle: string;
  iconKey: QuickOverviewIconKey;
  tone: QuickOverviewTone;
};

export type DashboardData = {
  stats: DashboardStat[];
  monthlyTrend: ChartPoint[];
  quickOverview: QuickOverviewItem[];
};

export type DashboardApiResponse = {
  stats: DashboardStatApi[];
  monthlyTrend: ChartPoint[];
  quickOverview: QuickOverviewItemApi[];
};
