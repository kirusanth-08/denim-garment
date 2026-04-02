import { PurchaseStatus } from '../../constants/status';
import { cn } from '../../lib/cn';

const toneMap: Record<PurchaseStatus, string> = {
  Delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Approved: 'border-blue-200 bg-blue-50 text-blue-700',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
};

export const StatusBadge = ({ status }: { status: PurchaseStatus }) => (
  <span className={cn('inline-flex rounded-full border px-3 py-1 text-sm font-medium', toneMap[status])}>{status}</span>
);

