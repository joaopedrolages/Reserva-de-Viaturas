import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-700 text-white hover:bg-blue-800 focus-visible:shadow-focus',
  secondary:
    'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus-visible:shadow-focus',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:shadow-focus',
  danger: 'bg-red-700 text-white hover:bg-red-800 focus-visible:shadow-focus',
};

export function Button({
  children,
  className,
  disabled,
  icon,
  isLoading,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : icon}
      <span>{children}</span>
    </button>
  );
}
