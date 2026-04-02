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
      className={`bg-surface-2 rounded-2xl ${interactive ? 'cursor-pointer hover:bg-slate-700 active:scale-98 transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
