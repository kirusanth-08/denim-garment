import { LucideIcon } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

type Props = {
  label: string;
  value: string;
  subtext: string;
  highlight: string;
  highlightClassName: string;
  icon: LucideIcon;
  iconColor: string;
};

export const StatCard = ({ label, value, subtext, highlight, highlightClassName, icon: Icon, iconColor }: Props) => (
  <Card className="p-5">
    <div className="mb-4 flex items-start justify-between gap-3">
      <p className="max-w-[12rem] text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <span className="rounded-xl bg-slate-100 p-2.5">
        <Icon size={20} className={iconColor} />
      </span>
    </div>
    <p className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{value}</p>
    <p className="mt-1.5 text-sm text-slate-600">{subtext}</p>
    <p className={`mt-2 text-sm font-medium ${highlightClassName}`}>{highlight}</p>
  </Card>
);
