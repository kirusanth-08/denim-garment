import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartPoint } from '../../types/common';
import { Card } from '../ui/Card';

export const BarChartCard = ({ title, data }: { title: string; data: ChartPoint[] }) => (
  <Card className="p-6">
    <h3 className="mb-5 text-2xl font-semibold tracking-tight text-slate-950">{title}</h3>
    {data.length === 0 ? (
      <div className="grid h-[280px] place-items-center rounded-3xl border border-dashed border-mist text-sm text-slate-500">
        No chart data available for the current filters.
      </div>
    ) : (
      <div className="h-[320px] w-full sm:h-[360px]">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="#D6CCBC" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#C7BFB1' }} tickLine={{ stroke: '#C7BFB1' }} />
            <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#C7BFB1' }} tickLine={{ stroke: '#C7BFB1' }} />
            <Bar dataKey="value" fill="#B86A28" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </Card>
);

