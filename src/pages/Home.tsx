import { useNavigate } from 'react-router-dom';
import { usePlanStore } from '../stores/planStore';
import { AppShell } from '../components/layout/AppShell';
import { MuscleBadge } from '../components/ui/Badge';
import { DAY_NAMES, getTodayDayOfWeek } from '../utils';
import { ChevronRight, Dumbbell, Moon } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const { plan, toggleWeek } = usePlanStore();

  if (!plan) return null;

  const today = getTodayDayOfWeek();
  const allDays = Array.from({ length: 7 }, (_, i) => {
    const trainingDay = plan.days.find(d => d.dayOfWeek === i);
    return { dayOfWeek: i, trainingDay };
  });

  return (
    <AppShell>
      <div className="p-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-text-secondary text-sm">Your Program</p>
            <h1 className="text-2xl font-bold text-text-primary">{plan.name}</h1>
          </div>
          <button
            onClick={toggleWeek}
            className="flex items-center gap-2 bg-surface-2 border border-slate-700 rounded-full px-4 py-2"
          >
            <span className="text-sm font-bold text-text-primary">Week {plan.currentWeek}</span>
            <div className="w-px h-4 bg-slate-600" />
            <span className="text-xs text-text-secondary">{plan.currentWeek === 'A' ? 'B' : 'A'}</span>
          </button>
        </div>

        {/* Day Cards */}
        <div className="space-y-3">
          {allDays.map(({ dayOfWeek, trainingDay }) => {
            const isToday = dayOfWeek === today;
            const weekVariation = trainingDay?.variations[plan.currentWeek];
            const exerciseCount = weekVariation?.exercises.length ?? 0;

            if (!trainingDay) {
              return (
                <div key={dayOfWeek} className={`rounded-2xl p-4 flex items-center gap-3 ${isToday ? 'bg-surface-2 border border-slate-600' : 'bg-surface-2/50'}`}>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Moon size={18} className="text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500">{DAY_NAMES[dayOfWeek]}</span>
                      {isToday && <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">Today</span>}
                    </div>
                    <span className="text-slate-600 text-sm">Rest Day</span>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={dayOfWeek}
                onClick={() => navigate(`/day/${trainingDay.id}`)}
                className={`w-full rounded-2xl p-4 text-left transition-all active:scale-98 ${
                  isToday
                    ? 'bg-primary/10 border border-primary/40'
                    : 'bg-surface-2 border border-transparent hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isToday ? 'bg-primary' : 'bg-slate-700'}`}>
                    <Dumbbell size={18} className={isToday ? 'text-white' : 'text-text-secondary'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-text-secondary text-sm">{DAY_NAMES[dayOfWeek]}</span>
                      {isToday && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Today</span>}
                      <span className="text-xs bg-slate-700 text-text-secondary px-2 py-0.5 rounded-full">Week {plan.currentWeek}</span>
                    </div>
                    <p className="font-bold text-text-primary">{trainingDay.label}</p>
                    <p className="text-text-secondary text-xs mt-0.5">{exerciseCount} exercises</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {trainingDay.muscleGroups.map(m => <MuscleBadge key={m} muscle={m} />)}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-text-secondary flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
