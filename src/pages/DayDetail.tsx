import { useNavigate, useParams } from 'react-router-dom';
import { usePlanStore } from '../stores/planStore';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { MuscleBadge } from '../components/ui/Badge';
import { exercises as exerciseDb } from '../data/exercises';
import { Dumbbell, Play, Pencil } from 'lucide-react';

export function DayDetail() {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  const { plan, toggleWeek } = usePlanStore();

  const day = plan?.days.find(d => d.id === dayId);
  if (!day || !plan) return null;

  const week = plan.currentWeek;
  const variation = day.variations[week];

  return (
    <AppShell>
      <Header
        title={day.label}
        showBack
        right={
          <button
            onClick={() => navigate('/setup')}
            className="p-2 text-text-secondary hover:text-text-primary"
          >
            <Pencil size={18} />
          </button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Week Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {day.muscleGroups.map(m => <MuscleBadge key={m} muscle={m} />)}
          </div>
          <button
            onClick={toggleWeek}
            className="flex bg-surface-2 rounded-full overflow-hidden border border-slate-700"
          >
            {(['A', 'B'] as const).map(w => (
              <span
                key={w}
                className={`px-4 py-1.5 text-sm font-bold transition-colors ${
                  week === w ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Week {w}
              </span>
            ))}
          </button>
        </div>

        {/* Exercise List */}
        <div className="space-y-3">
          {variation.exercises.length === 0 && (
            <div className="text-center py-10 text-text-secondary">
              <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
              <p>No exercises for Week {week}</p>
            </div>
          )}
          {variation.exercises
            .sort((a, b) => a.order - b.order)
            .map((we, idx) => {
              const ex = exerciseDb.find(e => e.id === we.exerciseId);
              if (!ex) return null;
              return (
                <div key={idx} className="bg-surface-2 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0 text-text-secondary font-mono font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary">{ex.name}</p>
                    <p className="text-text-secondary text-sm">{we.sets} sets × {we.reps} reps</p>
                    <div className="flex gap-1 mt-1">
                      <MuscleBadge muscle={ex.primaryMuscle} />
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-slate-700 text-text-secondary">{ex.equipment}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Start Workout Button */}
      {variation.exercises.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-2">
          <div className="max-w-lg mx-auto">
            <Button
              fullWidth
              size="lg"
              onClick={() => navigate(`/workout/${day.id}/${week}`)}
            >
              <Play size={20} />
              Start Workout — Week {week}
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
