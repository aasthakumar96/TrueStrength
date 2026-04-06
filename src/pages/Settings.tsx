import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { usePlanStore } from '../stores/planStore';
import { useSessionStore } from '../stores/sessionStore';
import { db } from '../db';
import { Pencil, Trash2, Shield } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  const { plan, resetPlan } = usePlanStore();
  const { clearSession } = useSessionStore();

  const handleReset = async () => {
    if (!confirm('This will permanently delete your plan and all workout history. Continue?')) return;
    // Haptic: error pattern
    if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);
    await db.plans.clear();
    await db.sessions.clear();
    clearSession();
    resetPlan();
    navigate('/setup');
  };

  return (
    <AppShell>
      <Header title="Settings" />

      <div className="px-5 pt-4 space-y-3">
        {/* Plan card */}
        {plan && (
          <div className="bg-surface-2 rounded-card border border-border px-5 py-5">
            <p className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold mb-3">
              Your Plan
            </p>
            <h3 className="font-display text-fluid-xl text-text-1 font-semibold mb-1">
              {plan.name}
            </h3>
            <p className="text-fluid-sm text-text-2 mb-4">
              {plan.days.length} training days &nbsp;&middot;&nbsp; Week {plan.currentWeek} active
            </p>
            <Button variant="secondary" size="sm" onClick={() => navigate('/setup')}>
              <Pencil size={15} strokeWidth={1.75} />
              Edit Plan
            </Button>
          </div>
        )}

        {/* About */}
        <div className="bg-surface-2 rounded-card border border-border px-5 py-5">
          <div className="flex items-center gap-2.5 mb-3">
            <Shield size={16} className="text-text-3" strokeWidth={1.5} />
            <p className="text-fluid-sm font-semibold text-text-1">Privacy</p>
          </div>
          <p className="text-fluid-sm text-text-2 leading-relaxed">
            All your data lives on this device. No account, no server, no tracking.
          </p>
        </div>

        {/* Danger zone */}
        <div className="bg-surface-2 rounded-card border border-danger/15 px-5 py-5">
          <p className="text-fluid-xs text-danger/60 uppercase tracking-widest font-semibold mb-1">
            Danger Zone
          </p>
          <p className="text-fluid-sm text-text-2 mb-4">
            Permanently delete your plan and all workout history.
          </p>
          <Button variant="danger" size="sm" onClick={handleReset}>
            <Trash2 size={15} strokeWidth={1.75} />
            Reset All Data
          </Button>
        </div>

        {/* Version */}
        <p className="text-fluid-xs text-text-3 text-center py-2">GymGuide · All data stored locally</p>
      </div>
    </AppShell>
  );
}
