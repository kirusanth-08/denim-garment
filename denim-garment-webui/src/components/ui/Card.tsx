import { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type CardProps = PropsWithChildren<{ className?: string }>;

export const Card = ({ className, children }: CardProps) => (
  <section className={cn('rounded-2xl border border-slate-200 bg-card shadow-sm', className)}>{children}</section>
);
