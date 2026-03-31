import { LucideIcon } from 'lucide-react';
import { ChartPoint } from '../../../types/common';

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

export type DashboardData = {
  stats: DashboardStat[];
  monthlyTrend: ChartPoint[];
  quickOverview: QuickOverviewItem[];
};
