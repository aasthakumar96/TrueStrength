import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { usePlanStore } from '../stores/planStore';
import { useSessionStore } from '../stores/sessionStore';
import { db } from '../db';
import { Pencil, Trash2, Info } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  const { plan, resetPlan } = usePlanStore();
  const { clearSession } = useSessionStore();

  const handleReset = async () => {
    if (!confirm('This will delete your plan and all history. Are you sure?')) return;
    await db.plans.clear();
    await db.sessions.clear();
    clearSession();
    resetPlan();
    navigate('/setup');
  };

  return (
    <AppShell>
      <Header title="Settings" />
      <div className="p-4 space-y-4">
        {plan && (
          <div className="bg-surface-2 rounded-2xl p-4">
            <h3 className="font-semibold text-text-primary mb-1">{plan.name}</h3>
            <p className="text-text-secondary text-sm mb-3">
              {plan.days.length} training days · Currently on Week {plan.currentWeek}
            </p>
            <Button variant="secondary" onClick={() => navigate('/setup')}>
              <Pencil size={16} /> Edit Plan
            </Button>
          </div>
        )}

        <div className="bg-surface-2 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-text-secondary" />
            <h3 className="font-semibold text-text-primary text-sm">About GymGuide</h3>
          </div>
          <p className="text-text-secondary text-sm">Your guided gym workout companion. All data is stored locally on your device — no account required.</p>
        </div>

        <div className="bg-surface-2 rounded-2xl p-4">
          <h3 className="font-semibold text-text-primary mb-1">Danger Zone</h3>
          <p className="text-text-secondary text-sm mb-3">This will permanently delete your plan and workout history.</p>
          <Button variant="danger" onClick={handleReset}>
            <Trash2 size={16} /> Reset All Data
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
