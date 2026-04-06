import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { usePlanStore } from '../stores/planStore';
import { getAllSessions } from '../db';
import { formatDate, formatDuration } from '../utils';
import type { WorkoutSession } from '../types';
import { Calendar, Clock, Dumbbell } from 'lucide-react';

const fadeUp = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function History() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { plan } = usePlanStore();

  useEffect(() => {
    getAllSessions().then(data => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppShell>
      <Header title="History" />

      <div className="px-5 pt-4 space-y-2.5">
        {/* Skeleton loading state */}
        {loading && (
          <div className="space-y-2.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-card p-5 bg-surface-2 border border-border space-y-3">
                <div className="skeleton h-4 w-32 rounded" />
                <div className="skeleton h-3 w-48 rounded" />
                <div className="skeleton h-3 w-40 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && sessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-card bg-surface-2 border border-border flex items-center justify-center mb-5">
              <Calendar size={34} className="text-text-3" strokeWidth={1.25} />
            </div>
            <p className="font-display text-fluid-xl text-text-1 font-semibold mb-2">
              No workouts yet
            </p>
            <p className="text-fluid-sm text-text-3 max-w-[220px]">
              Complete a workout and it'll appear here
            </p>
          </motion.div>
        )}

        {/* Session list */}
        {!loading && sessions.map((session, i) => {
          const day = plan?.days.find(d => d.id === session.dayId);
          const exerciseCount = Object.keys(session.completedExercises).length;
          const totalSets = Object.values(session.completedExercises).reduce(
            (acc, sets) => acc + sets.length, 0
          );

          return (
            <motion.div
              key={session.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className="bg-surface-2 rounded-card border border-border px-5 py-4">
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-display text-fluid-lg font-semibold text-text-1 leading-tight">
                      {day?.label ?? 'Workout'}
                    </p>
                    <p className="text-fluid-xs text-text-3 mt-0.5 uppercase tracking-widest">
                      Week {session.week}
                    </p>
                  </div>
                  <span
                    className={`text-fluid-xs font-semibold px-2.5 py-1 rounded-pill border ${
                      session.completed
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-surface-3 text-text-3 border-border'
                    }`}
                  >
                    {session.completed ? 'Complete' : 'Incomplete'}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex gap-4 text-text-2">
                  <span className="flex items-center gap-1.5 text-fluid-xs">
                    <Calendar size={13} strokeWidth={1.5} />
                    {formatDate(session.date)}
                  </span>
                  <span className="flex items-center gap-1.5 text-fluid-xs">
                    <Clock size={13} strokeWidth={1.5} />
                    {formatDuration(session.durationSeconds)}
                  </span>
                  <span className="flex items-center gap-1.5 text-fluid-xs">
                    <Dumbbell size={13} strokeWidth={1.5} />
                    {exerciseCount} · {totalSets} sets
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
