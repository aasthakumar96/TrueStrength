import { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { usePlanStore } from '../stores/planStore';
import { getAllSessions } from '../db';
import { formatDate, formatDuration } from '../utils';
import type { WorkoutSession } from '../types';
import { Calendar, Clock, Dumbbell } from 'lucide-react';

export function History() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const { plan } = usePlanStore();

  useEffect(() => {
    getAllSessions().then(setSessions);
  }, []);

  return (
    <AppShell>
      <Header title="History" />
      <div className="p-4 space-y-3">
        {sessions.length === 0 && (
          <div className="text-center py-16 text-text-secondary">
            <Calendar size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No workouts yet</p>
            <p className="text-sm mt-1">Complete a workout to see it here</p>
          </div>
        )}
        {sessions.map(session => {
          const day = plan?.days.find(d => d.id === session.dayId);
          const exerciseCount = Object.keys(session.completedExercises).length;
          const totalSets = Object.values(session.completedExercises).reduce((acc, sets) => acc + sets.length, 0);

          return (
            <div key={session.id} className="bg-surface-2 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-text-primary">{day?.label ?? 'Workout'}</p>
                  <p className="text-text-secondary text-xs">Week {session.week}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${session.completed ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-text-secondary'}`}>
                  {session.completed ? 'Complete' : 'Incomplete'}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(session.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDuration(session.durationSeconds)}
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell size={14} />
                  {exerciseCount} exercises · {totalSets} sets
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
