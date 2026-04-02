import { LucideIcon } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

type MetricCardProps = {
  label: string;
  value: string;
  subtext: string;
  highlight: string;
  highlightClassName: string;
  icon: LucideIcon;
  iconColor: string;
};

export const MetricCard = ({ label, value, subtext, highlight, highlightClassName, icon: Icon, iconColor }: MetricCardProps) => (
  <Card className="overflow-hidden p-6">
    <div className="mb-5 flex items-start justify-between gap-4">
      <p className="max-w-[12rem] text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <span className="rounded-2xl bg-[#FBF4EA] p-3">
        <Icon size={22} className={iconColor} />
      </span>
    </div>
    <p className="text-4xl font-semibold tracking-tight text-slate-950">{value}</p>
    <p className="mt-2 text-base text-slate-600">{subtext}</p>
    <p className={`mt-4 text-sm font-medium ${highlightClassName}`}>{highlight}</p>
  </Card>
);

