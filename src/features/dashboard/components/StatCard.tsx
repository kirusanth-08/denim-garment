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
  <Card className="p-6">
    <div className="mb-5 flex items-start justify-between gap-4">
      <p className="max-w-[12rem] text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <span className="rounded-2xl bg-slate-100 p-3">
        <Icon size={24} className={iconColor} />
      </span>
    </div>
    <p className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{value}</p>
    <p className="mt-2 text-lg text-slate-600">{subtext}</p>
    <p className={`mt-3 text-base font-medium ${highlightClassName}`}>{highlight}</p>
  </Card>
);
