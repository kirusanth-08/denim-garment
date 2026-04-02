import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartPoint } from '../../types/common';
import { Card } from '../ui/Card';

export const BarChartCard = ({ title, data }: { title: string; data: ChartPoint[] }) => (
  <Card className="p-5">
    <h3 className="mb-4 text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
    <div className="h-[280px] w-full sm:h-[320px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#94a3b8' }} tickLine={{ stroke: '#94a3b8' }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#94a3b8' }} tickLine={{ stroke: '#94a3b8' }} />
          <Bar dataKey="value" fill="#F4A207" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);
