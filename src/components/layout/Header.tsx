import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: ReactNode;
}

export function Header({ title, showBack, right }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 pt-safe">
      {/* Glass background layer */}
      <div className="absolute inset-0 glass pointer-events-none" />
      <div className="relative flex items-center gap-3 px-5 h-14">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-xl text-text-2 hover:text-text-1 pressable"
            aria-label="Go back"
          >
            <ArrowLeft size={20} strokeWidth={1.75} />
          </button>
        )}
        <h1 className="text-fluid-base font-sans font-semibold text-text-1 flex-1 truncate tracking-tight">
          {title}
        </h1>
        {right && <div className="flex-shrink-0">{right}</div>}
      </div>
    </header>
  );
}
