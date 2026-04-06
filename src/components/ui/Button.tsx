import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-sans font-semibold rounded-btn pressable ' +
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-40';

  const variants = {
    primary:
      'bg-accent text-bg hover:bg-accent-text',
    secondary:
      'bg-surface-2 text-text-1 border border-border hover:bg-surface-3 hover:border-border-light',
    ghost:
      'text-text-2 hover:text-text-1 hover:bg-surface-2',
    danger:
      'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20',
  };

  const sizes = {
    sm:  'px-4 py-2.5 text-fluid-sm min-h-[40px] gap-1.5',
    md:  'px-5 py-3   text-fluid-base min-h-[48px] gap-2',
    lg:  'px-6 py-3.5 text-fluid-lg  min-h-[56px] gap-2.5',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
