import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function Card({ children, className = '', onClick, interactive }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-2 rounded-card border border-border ${
        interactive
          ? 'pressable hover:border-border-light hover:bg-surface-3 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
