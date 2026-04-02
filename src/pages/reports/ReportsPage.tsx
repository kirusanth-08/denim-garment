import { useState } from 'react';
import { BarChartCard } from '../../components/charts/BarChartCard';
import { DonutChartCard } from '../../components/charts/DonutChartCard';
import { DateField } from '../../components/forms/DateField';
import { SelectField } from '../../components/forms/SelectField';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { reportData } from '../../features/reports/data/reportData';

export const ReportsPage = () => {
  const [fromDate, setFromDate] = useState('09/01/2025');
  const [toDate, setToDate] = useState('03/31/2026');
  const [supplier, setSupplier] = useState('all');

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
              options={[{ label: 'All Suppliers', value: 'all' }, ...reportData.supplierDistribution.map((s) => ({ label: s.name, value: s.name }))]}
            />
          </div>
        </div>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <BarChartCard title="Monthly Purchase Trend" data={reportData.monthlyTrend} />
        <DonutChartCard title="Supplier Distribution" data={reportData.supplierDistribution} />
      </div>
    </div>
  );
};
