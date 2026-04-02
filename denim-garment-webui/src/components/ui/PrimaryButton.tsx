import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const PrimaryButton = ({ className, children, ...props }: Props) => (
  <button
    className={cn(
      'inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-lg font-medium text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
