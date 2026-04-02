import { cn } from '../../../lib/cn';

const STATUS_TONE_MAP: Record<string, string> = {
  Processing: 'border-amber-200 bg-amber-50 text-amber-700',
  Confirmed: 'border-sky-200 bg-sky-50 text-sky-700',
  Dispatched: 'border-blue-200 bg-blue-50 text-blue-700',
  Delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export const OrderStatusBadge = ({ status }: { status: string }) => (
  <span
    className={cn(
      'inline-flex rounded-full border px-3 py-1 text-sm font-semibold',
      STATUS_TONE_MAP[status] ?? 'border-slate-200 bg-slate-100 text-slate-700',
    )}
  >
    {status}
  </span>
);
