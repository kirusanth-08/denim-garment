import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

export type DonutSlice = { name: string; value: number; color: string };

export const DonutChartCard = ({ title, data }: { title: string; data: DonutSlice[] }) => (
  <Card className="p-6">
    <h3 className="mb-4 text-4xl font-semibold text-slate-950">{title}</h3>
    <div className="h-[280px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={3}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-4 flex flex-wrap gap-4 text-xl">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <span className="inline-block h-4 w-4" style={{ background: item.color }} />
          <span style={{ color: item.color }}>{item.name}</span>
        </div>
      ))}
    </div>
  </Card>
);
