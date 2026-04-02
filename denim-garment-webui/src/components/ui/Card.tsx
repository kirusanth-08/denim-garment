import { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type CardProps = PropsWithChildren<{ className?: string }>;

export const Card = ({ className, children }: CardProps) => (
  <section className={cn('rounded-[28px] border border-white/70 bg-card shadow-panel', className)}>{children}</section>
);

