import { useState } from 'react';
import { BarChartCard } from '../../components/charts/BarChartCard';
import { DonutChartCard } from '../../components/charts/DonutChartCard';
import { DateField } from '../../components/forms/DateField';
import { SelectField } from '../../components/forms/SelectField';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { ReportData } from '../../features/reports/types/report';
import { useApiResource } from '../../hooks/useApiResource';
import { withQuery } from '../../lib/api';

export const ReportsPage = () => {
  const [fromDate, setFromDate] = useState('09/01/2025');
  const [toDate, setToDate] = useState('03/31/2026');
  const [supplier, setSupplier] = useState('all');
  const requestPath = withQuery('/reports', {
    from: fromDate,
    to: toDate,
    supplier: supplier === 'all' ? undefined : supplier,
  });
  const { data, loading, error } = useApiResource<ReportData>(requestPath);
  const supplierOptions = data?.supplierOptions ?? [];

  return (
    <div>
      <PageHeader eyebrow="Reports & Analytics" title="Reports" subtitle="Purchase analytics and insights" />
      <Card className="mb-6 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <DateField label="From" value={fromDate} onChange={setFromDate} />
          <DateField label="To" value={toDate} onChange={setToDate} />
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Supplier</label>
            <SelectField
              value={supplier}
              onChange={setSupplier}
              options={[{ label: 'All Suppliers', value: 'all' }, ...supplierOptions.map((name) => ({ label: name, value: name }))]}
            />
          </div>
        </div>
        <div className="mt-3 text-sm text-slate-500">
          {loading ? 'Refreshing analytics from the demo API...' : 'Report filters are powered by the demo backend.'}
        </div>
      </Card>

      {error && !data ? (
        <Card className="p-6 text-base text-red-600">Could not load reports. {error}</Card>
      ) : !data ? (
        <Card className="p-6 text-base text-slate-500">Loading report data...</Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <BarChartCard title="Monthly Purchase Trend" data={data.monthlyTrend} />
          <DonutChartCard title="Supplier Distribution" data={data.supplierDistribution} />
        </div>
      )}
    </div>
  );
};
