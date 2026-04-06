import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlanStore } from '../stores/planStore';
import { AppShell } from '../components/layout/AppShell';
import { MuscleBadge } from '../components/ui/Badge';
import { DAY_FULL_NAMES, DAY_NAMES, getTodayDayOfWeek, getGreeting } from '../utils';
import { Moon, ChevronRight } from 'lucide-react';

const fadeUp = {
  hidden:  { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

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
      {/* Header */}
      <div
        className="px-5 pt-6"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)' }}
      >
        <p className="text-fluid-sm text-text-2 font-medium">{getGreeting()}</p>
        <div className="flex items-end justify-between mt-1 mb-6">
          <h1 className="font-display text-fluid-display text-text-1 leading-tight max-w-[200px]">
            {plan.name}
          </h1>
          {/* A/B week toggle pill */}
          <button
            onClick={toggleWeek}
            className="flex items-center bg-surface-2 rounded-pill border border-border p-1 gap-0.5 pressable hover:border-border-light transition-colors"
            aria-label={`Currently Week ${plan.currentWeek}. Tap to switch.`}
          >
            {(['A', 'B'] as const).map(w => (
              <span
                key={w}
                className={`w-9 h-8 flex items-center justify-center rounded-pill text-fluid-sm font-semibold transition-all ${
                  plan.currentWeek === w
                    ? 'bg-accent text-bg shadow-glow-accent'
                    : 'text-text-3'
                }`}
              >
                {w}
              </span>
            ))}
          </button>
        </div>

        {/* Today label */}
        <p className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold mb-3">
          This week
        </p>
      </div>

      {/* Day cards */}
      <div className="px-5 space-y-2.5 pb-4">
        {allDays.map(({ dayOfWeek, trainingDay }, i) => {
          const isToday = dayOfWeek === today;
          const weekVariation = trainingDay?.variations[plan.currentWeek];
          const exerciseCount = weekVariation?.exercises.length ?? 0;

          if (!trainingDay) {
            return (
              <motion.div
                key={dayOfWeek}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <div
                  className={`flex items-center px-5 py-4 rounded-card border transition-colors ${
                    isToday
                      ? 'bg-surface-2 border-border-light'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex-1">
                    <span
                      className={`text-fluid-sm font-medium ${isToday ? 'text-text-2' : 'text-text-3'}`}
                    >
                      {DAY_NAMES[dayOfWeek]}
                    </span>
                    {isToday && (
                      <span className="badge-accent ml-2">Today</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-text-3">
                    <span className="text-fluid-xs">Rest</span>
                    <Moon size={13} strokeWidth={1.5} />
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={dayOfWeek}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <button
                onClick={() => navigate(`/day/${trainingDay.id}`)}
                className={`w-full rounded-card border text-left pressable transition-colors ${
                  isToday
                    ? 'bg-surface-2 border-accent/30 hover:border-accent/50'
                    : 'bg-surface-2 border-border hover:border-border-light'
                }`}
              >
                <div className="px-5 py-4">
                  {/* Day + today badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-fluid-sm text-text-2 font-medium">
                        {DAY_FULL_NAMES[dayOfWeek]}
                      </span>
                      {isToday && (
                        <span className="badge-accent">Today</span>
                      )}
                    </div>
                    <ChevronRight size={16} strokeWidth={1.5} className="text-text-3 flex-shrink-0" />
                  </div>

                  {/* Day label in display font */}
                  <h3 className="font-display text-fluid-lg font-semibold text-text-1 mb-3">
                    {trainingDay.label}
                  </h3>

                  {/* Muscle badges + exercise count */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 flex-wrap flex-1">
                      {trainingDay.muscleGroups.slice(0, 3).map(m => (
                        <MuscleBadge key={m} muscle={m} />
                      ))}
                      {trainingDay.muscleGroups.length > 3 && (
                        <span className="text-fluid-xs text-text-3">
                          +{trainingDay.muscleGroups.length - 3}
                        </span>
                      )}
                    </div>
                    <span className="text-fluid-xs text-text-3 flex-shrink-0">
                      {exerciseCount} exercises
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
