import { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export const PageHeader = ({ eyebrow, title, subtitle, action }: PageHeaderProps) => (
  <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
    <div className="max-w-3xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
      <p className="mt-3 text-lg text-slate-600 sm:text-xl">{subtitle}</p>
    </div>
    {action}
  </div>
);
