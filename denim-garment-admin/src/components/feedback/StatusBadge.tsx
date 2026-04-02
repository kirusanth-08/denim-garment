import { StockIncomeStatus } from '../../constants/status';
import { cn } from '../../lib/cn';

const toneMap: Record<StockIncomeStatus, string> = {
  Received: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  'Quality Checked': 'bg-blue-100 text-blue-600 border-blue-200',
  'Pending Inspection': 'bg-amber-100 text-amber-600 border-amber-200',
};

export const StatusBadge = ({ status }: { status: StockIncomeStatus }) => (
  <span className={cn('inline-block rounded-full border px-3 py-1 text-sm font-medium', toneMap[status])}>{status}</span>
);
