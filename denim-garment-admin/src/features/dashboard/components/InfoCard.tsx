import { LucideIcon } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

type Item = { title: string; subtitle: string; icon: LucideIcon; tone: string };

export const InfoCard = ({ title, items }: { title: string; items: Item[] }) => (
  <Card className="p-5">
    <h3 className="mb-4 text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
    <div className="space-y-3">
      {items.map(({ title: itemTitle, subtitle, icon: Icon, tone }) => (
        <div key={itemTitle} className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 ${tone}`}>
          <Icon size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-base font-medium text-slate-950">{itemTitle}</p>
            <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);
