import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:brightness-95 focus-visible:outline-accent',
  secondary: 'bg-forest text-white hover:bg-forest/90 focus-visible:outline-forest',
  ghost: 'border border-mist bg-white/70 text-slate-700 hover:bg-white focus-visible:outline-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-sm sm:text-base',
};

export const Button = ({ className, children, variant = 'primary', size = 'md', type = 'button', ...props }: ButtonProps) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

