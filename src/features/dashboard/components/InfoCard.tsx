import { LucideIcon } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

type Item = { title: string; subtitle: string; icon: LucideIcon; tone: string };

export const InfoCard = ({ title, items }: { title: string; items: Item[] }) => (
  <Card className="p-6">
    <h3 className="mb-5 text-2xl font-semibold tracking-tight text-slate-950">{title}</h3>
    <div className="space-y-4">
      {items.map(({ title: itemTitle, subtitle, icon: Icon, tone }) => (
        <div key={itemTitle} className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${tone}`}>
          <Icon size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-lg font-medium text-slate-950">{itemTitle}</p>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);
