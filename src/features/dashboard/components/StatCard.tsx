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
    <div className="mb-3 flex items-start justify-between">
      <p className="text-2xl font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <span className="rounded-2xl bg-slate-100 p-3">
        <Icon size={28} className={iconColor} />
      </span>
    </div>
    <p className="text-5xl font-semibold text-slate-950">{value}</p>
    <p className="mt-2 text-3xl text-slate-600">{subtext}</p>
    <p className={`mt-2 text-3xl ${highlightClassName}`}>{highlight}</p>
  </Card>
);
