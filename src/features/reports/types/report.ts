import { ChartPoint } from '../../../types/common';
import { DonutSlice } from '../../../components/charts/DonutChartCard';

export type ReportData = {
  monthlyTrend: ChartPoint[];
  supplierDistribution: DonutSlice[];
};
