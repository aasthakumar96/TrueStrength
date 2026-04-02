import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WorkoutSession, CompletedSet } from '../types';

interface SessionState {
  activeSession: WorkoutSession | null;
  currentExerciseIndex: number;
  startTime: number | null;

  startSession: (dayId: string, week: 'A' | 'B') => void;
  completeSet: (exerciseId: string, set: CompletedSet) => void;
  removeSet: (exerciseId: string, setNumber: number) => void;
  nextExercise: () => void;
  prevExercise: () => void;
  goToExercise: (index: number) => void;
  finishSession: () => WorkoutSession | null;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      currentExerciseIndex: 0,
      startTime: null,

      startSession: (dayId, week) => {
        const id = `session-${Date.now()}`;
        set({
          activeSession: {
            id,
            dayId,
            week,
            date: new Date().toISOString(),
            completedExercises: {},
            durationSeconds: 0,
            completed: false,
          },
          currentExerciseIndex: 0,
          startTime: Date.now(),
        });
      },

      completeSet: (exerciseId, completedSet) => {
        const { activeSession } = get();
        if (!activeSession) return;
        const existing = activeSession.completedExercises[exerciseId] || [];
        set({
          activeSession: {
            ...activeSession,
            completedExercises: {
              ...activeSession.completedExercises,
              [exerciseId]: [...existing, completedSet],
            },
          },
        });
      },

      removeSet: (exerciseId, setNumber) => {
        const { activeSession } = get();
        if (!activeSession) return;
        const existing = activeSession.completedExercises[exerciseId] || [];
        set({
          activeSession: {
            ...activeSession,
            completedExercises: {
              ...activeSession.completedExercises,
              [exerciseId]: existing.filter(s => s.setNumber !== setNumber),
            },
          },
        });
      },

      nextExercise: () =>
        set(s => ({ currentExerciseIndex: s.currentExerciseIndex + 1 })),

      prevExercise: () =>
        set(s => ({ currentExerciseIndex: Math.max(0, s.currentExerciseIndex - 1) })),

      goToExercise: (index) => set({ currentExerciseIndex: index }),

      finishSession: () => {
        const { activeSession, startTime } = get();
        if (!activeSession) return null;
        const durationSeconds = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
        const finished: WorkoutSession = { ...activeSession, durationSeconds, completed: true };
        set({ activeSession: null, currentExerciseIndex: 0, startTime: null });
        return finished;
      },

      clearSession: () =>
        set({ activeSession: null, currentExerciseIndex: 0, startTime: null }),
    }),
    {
      name: 'gymguide-session',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
