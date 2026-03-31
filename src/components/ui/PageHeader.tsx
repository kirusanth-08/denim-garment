import { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export const PageHeader = ({ eyebrow, title, subtitle, action }: PageHeaderProps) => (
  <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
    <div>
      <p className="mb-4 text-3xl text-slate-500">{eyebrow}</p>
      <h1 className="text-5xl font-semibold text-slate-950">{title}</h1>
      <p className="mt-2 text-4xl text-slate-600">{subtitle}</p>
    </div>
    {action}
  </div>
);
