import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav }: AppShellProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-bg flex flex-col max-w-lg mx-auto">
      <main className={`flex-1 ${hideNav ? '' : 'pb-nav'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
