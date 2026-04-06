import { NavLink } from 'react-router-dom';
import { Home, History, SlidersHorizontal } from 'lucide-react';

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/settings', icon: SlidersHorizontal, label: 'Settings' },
] as const;

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
    >
      <div className="glass-nav flex rounded-2xl shadow-nav w-full max-w-sm overflow-hidden">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} className="flex-1">
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center gap-1 py-4 pressable min-h-[56px] transition-colors ${
                  isActive ? 'text-accent' : 'text-text-3 hover:text-text-2'
                }`}
              >
                <Icon size={21} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-fluid-xs font-medium tracking-wide">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
