import { DonutSlice } from '../../../components/charts/DonutChartCard';
import { ChartPoint } from '../../../types/common';

export type ReportData = {
  monthlyTrend: ChartPoint[];
  supplierDistribution: DonutSlice[];
  supplierOptions: string[];
};

