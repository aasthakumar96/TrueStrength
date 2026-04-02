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
    <header className="sticky top-0 bg-surface/90 backdrop-blur border-b border-slate-800 z-40 px-4 py-3 flex items-center gap-3">
      {showBack && (
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft size={22} />
        </button>
      )}
      <h1 className="text-lg font-bold text-text-primary flex-1">{title}</h1>
      {right && <div>{right}</div>}
    </header>
  );
}
