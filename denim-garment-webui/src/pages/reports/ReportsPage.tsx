import { useState } from 'react';
import { usePortalDataContext } from '../../app/context/PortalDataContext';
import { BarChartCard } from '../../components/charts/BarChartCard';
import { DonutChartCard } from '../../components/charts/DonutChartCard';
import { Card } from '../../components/ui/Card';
import { DateField } from '../../components/forms/DateField';
import { SelectField } from '../../components/forms/SelectField';
import { PageHeader } from '../../components/ui/PageHeader';
import { ReportData } from '../../features/reports/types/report';
import { useApiResource } from '../../hooks/useApiResource';
import { withQuery } from '../../lib/api';

export const ReportsPage = () => {
  const { version } = usePortalDataContext();
  const [fromDate, setFromDate] = useState('2025-09-01');
  const [toDate, setToDate] = useState('2026-04-30');
  const [supplier, setSupplier] = useState('all');

  const requestPath = withQuery('/reports', {
    from: fromDate,
    to: toDate,
    supplier: supplier === 'all' ? undefined : supplier,
  });

  const { data, loading, error } = useApiResource<ReportData>(requestPath, [version]);
  const supplierOptions = data?.supplierOptions ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Order insights"
        title="Understand volume, timing, and supplier mix"
        subtitle="Use date and supplier filters to compare purchasing activity, identify concentration, and review how the order mix is shifting over time."
      />

      <Card className="mb-6 p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <DateField label="From" value={fromDate} onChange={setFromDate} />
          <DateField label="To" value={toDate} onChange={setToDate} />
          <SelectField
            label="Supplier"
            value={supplier}
            onChange={setSupplier}
            options={[{ label: 'All Suppliers', value: 'all' }, ...supplierOptions.map((name) => ({ label: name, value: name }))]}
          />
        </div>
        <div className="mt-3 text-sm text-slate-500">
          {loading ? 'Refreshing reports from the demo API...' : 'These analytics refresh automatically when purchase requests change.'}
        </div>
      </Card>

      {error && !data ? (
        <Card className="p-6 text-base text-red-600">Could not load reports. {error}</Card>
      ) : !data ? (
        <Card className="p-6 text-base text-slate-500">Loading report data...</Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <BarChartCard title="Purchase Trend" data={data.monthlyTrend} />
          <DonutChartCard title="Supplier Distribution" data={data.supplierDistribution} />
        </div>
      )}
    </div>
  );
};
