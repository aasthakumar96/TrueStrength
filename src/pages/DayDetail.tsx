import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlanStore } from '../stores/planStore';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { MuscleBadge } from '../components/ui/Badge';
import { exercises as exerciseDb } from '../data/exercises';
import { Play, Pencil, Dumbbell } from 'lucide-react';

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function DayDetail() {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  const { plan, toggleWeek } = usePlanStore();

  const day = plan?.days.find(d => d.id === dayId);
  if (!day || !plan) return null;

  const week = plan.currentWeek;
  const variation = day.variations[week];
  const sortedExercises = [...variation.exercises].sort((a, b) => a.order - b.order);

  return (
    <AppShell>
      <Header
        title={day.label}
        showBack
        right={
          <button
            onClick={() => navigate('/setup')}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-text-2 hover:text-text-1 pressable"
            aria-label="Edit plan"
          >
            <Pencil size={17} strokeWidth={1.75} />
          </button>
        }
      />

      <div className="px-5 pt-4 space-y-5">
        {/* Muscle badges + week toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap flex-1 min-w-0 mr-3">
            {day.muscleGroups.map(m => (
              <MuscleBadge key={m} muscle={m} />
            ))}
          </div>
          {/* Week A/B toggle */}
          <button
            onClick={toggleWeek}
            className="flex items-center bg-surface-2 rounded-pill border border-border p-1 gap-0.5 pressable hover:border-border-light flex-shrink-0"
            aria-label={`Week ${week} selected. Toggle week.`}
          >
            {(['A', 'B'] as const).map(w => (
              <span
                key={w}
                className={`w-9 h-8 flex items-center justify-center rounded-pill text-fluid-xs font-semibold transition-all ${
                  week === w ? 'bg-accent text-bg' : 'text-text-3'
                }`}
              >
                {w}
              </span>
            ))}
          </button>
        </div>

        {/* Exercise list */}
        {sortedExercises.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 rounded-card bg-surface-2 border border-border flex items-center justify-center mb-4">
              <Dumbbell size={28} className="text-text-3" strokeWidth={1.25} />
            </div>
            <p className="text-fluid-base text-text-2 font-medium">No exercises yet</p>
            <p className="text-fluid-sm text-text-3 mt-1">Add exercises in Week {week}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedExercises.map((we, idx) => {
              const ex = exerciseDb.find(e => e.id === we.exerciseId);
              if (!ex) return null;
              return (
                <motion.div
                  key={idx}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-16px' }}
                  variants={fadeUp}
                >
                  <div className="flex items-center gap-4 px-5 py-4 bg-surface-2 rounded-card border border-border">
                    {/* Index number */}
                    <div className="w-8 h-8 rounded-lg bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
                      <span className="text-fluid-xs font-semibold text-text-3">{idx + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-fluid-base font-semibold text-text-1 truncate">{ex.name}</p>
                      <p className="text-fluid-xs text-text-2 mt-0.5">
                        {we.sets} sets &times; {we.reps} reps
                        <span className="text-text-3 ml-2">&middot; {we.restSeconds}s rest</span>
                      </p>
                    </div>

                    <MuscleBadge muscle={ex.primaryMuscle} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Start Workout — sticky CTA above nav */}
      {sortedExercises.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 px-5 z-40 max-w-lg mx-auto"
          style={{ paddingBottom: 'max(calc(env(safe-area-inset-bottom, 0px) + 88px), 96px)' }}
        >
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate(`/workout/${day.id}/${week}`)}
            className="shadow-card-lg"
          >
            <Play size={18} strokeWidth={2} />
            Start Workout — Week {week}
          </Button>
        </div>
      )}
    </AppShell>
  );
}
