import { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export const PageHeader = ({ eyebrow, title, subtitle, action }: PageHeaderProps) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
    <div className="max-w-3xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-base text-slate-600 sm:text-lg">{subtitle}</p>
    </div>
    {action}
  </div>
);
