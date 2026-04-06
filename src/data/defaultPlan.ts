import type { WorkoutPlan } from '../types';
import { generateId } from '../utils';

/**
 * Builds a fresh 4-day default WorkoutPlan.
 * Called at runtime so each installation gets unique IDs.
 *
 * Day 1 (Mon)  – Chest + Triceps
 * Day 2 (Tue)  – Back + Biceps
 * Day 3 (Thu)  – Legs + Glutes
 * Day 4 (Fri)  – Shoulders + Arms
 */
export function buildDefaultPlan(): WorkoutPlan {
  return {
    id: generateId(),
    name: 'My Program',
    createdAt: new Date().toISOString(),
    currentWeek: 'A',
    days: [
      {
        id: generateId(),
        dayOfWeek: 0, // Monday
        label: 'Chest & Triceps',
        muscleGroups: ['chest', 'triceps'],
        variations: {
          A: {
            week: 'A',
            exercises: [
              { exerciseId: 'barbell-bench-press',   sets: 4, reps: '6-8',   restSeconds: 120, order: 0 },
              { exerciseId: 'incline-dumbbell-press', sets: 3, reps: '8-12',  restSeconds: 90,  order: 1 },
              { exerciseId: 'cable-chest-fly',        sets: 3, reps: '12-15', restSeconds: 60,  order: 2 },
              { exerciseId: 'close-grip-bench-press', sets: 3, reps: '8-10',  restSeconds: 90,  order: 3 },
              { exerciseId: 'tricep-cable-pushdown',  sets: 3, reps: '12-15', restSeconds: 60,  order: 4 },
            ],
          },
          B: {
            week: 'B',
            exercises: [
              { exerciseId: 'incline-dumbbell-press',    sets: 4, reps: '8-12',  restSeconds: 90,  order: 0 },
              { exerciseId: 'cable-chest-fly',            sets: 3, reps: '12-15', restSeconds: 60,  order: 1 },
              { exerciseId: 'close-grip-bench-press',     sets: 3, reps: '8-10',  restSeconds: 90,  order: 2 },
              { exerciseId: 'overhead-tricep-extension',  sets: 3, reps: '10-12', restSeconds: 60,  order: 3 },
              { exerciseId: 'tricep-cable-pushdown',      sets: 3, reps: '12-15', restSeconds: 60,  order: 4 },
            ],
          },
        },
      },
      {
        id: generateId(),
        dayOfWeek: 1, // Tuesday
        label: 'Back & Biceps',
        muscleGroups: ['back', 'biceps'],
        variations: {
          A: {
            week: 'A',
            exercises: [
              { exerciseId: 'barbell-bent-over-row',   sets: 4, reps: '6-8',   restSeconds: 120, order: 0 },
              { exerciseId: 'lat-pulldown',             sets: 3, reps: '10-12', restSeconds: 90,  order: 1 },
              { exerciseId: 'seated-cable-row',         sets: 3, reps: '10-12', restSeconds: 90,  order: 2 },
              { exerciseId: 'barbell-curl',             sets: 3, reps: '10-12', restSeconds: 60,  order: 3 },
              { exerciseId: 'hammer-curl',              sets: 3, reps: '12-15', restSeconds: 60,  order: 4 },
            ],
          },
          B: {
            week: 'B',
            exercises: [
              { exerciseId: 'single-arm-dumbbell-row', sets: 4, reps: '10-12', restSeconds: 75,  order: 0 },
              { exerciseId: 'lat-pulldown',             sets: 3, reps: '10-12', restSeconds: 90,  order: 1 },
              { exerciseId: 'seated-cable-row',         sets: 3, reps: '10-12', restSeconds: 90,  order: 2 },
              { exerciseId: 'barbell-curl',             sets: 3, reps: '10-12', restSeconds: 60,  order: 3 },
              { exerciseId: 'hammer-curl',              sets: 3, reps: '12-15', restSeconds: 60,  order: 4 },
            ],
          },
        },
      },
      {
        id: generateId(),
        dayOfWeek: 3, // Thursday
        label: 'Legs & Glutes',
        muscleGroups: ['quads', 'hamstrings', 'glutes'],
        variations: {
          A: {
            week: 'A',
            exercises: [
              { exerciseId: 'barbell-back-squat',  sets: 4, reps: '6-8',   restSeconds: 180, order: 0 },
              { exerciseId: 'romanian-deadlift',   sets: 3, reps: '8-10',  restSeconds: 120, order: 1 },
              { exerciseId: 'barbell-hip-thrust',  sets: 4, reps: '10-12', restSeconds: 90,  order: 2 },
              { exerciseId: 'leg-press',           sets: 3, reps: '10-15', restSeconds: 90,  order: 3 },
              { exerciseId: 'seated-leg-curl',     sets: 3, reps: '12-15', restSeconds: 60,  order: 4 },
            ],
          },
          B: {
            week: 'B',
            exercises: [
              { exerciseId: 'barbell-back-squat', sets: 4, reps: '6-8',   restSeconds: 180, order: 0 },
              { exerciseId: 'walking-lunge',       sets: 3, reps: '12-14', restSeconds: 75,  order: 1 },
              { exerciseId: 'barbell-hip-thrust',  sets: 4, reps: '10-12', restSeconds: 90,  order: 2 },
              { exerciseId: 'romanian-deadlift',   sets: 3, reps: '8-10',  restSeconds: 120, order: 3 },
              { exerciseId: 'seated-leg-curl',     sets: 3, reps: '12-15', restSeconds: 60,  order: 4 },
            ],
          },
        },
      },
      {
        id: generateId(),
        dayOfWeek: 4, // Friday
        label: 'Shoulders & Arms',
        muscleGroups: ['shoulders', 'biceps', 'triceps'],
        variations: {
          A: {
            week: 'A',
            exercises: [
              { exerciseId: 'barbell-overhead-press',  sets: 4, reps: '6-8',   restSeconds: 120, order: 0 },
              { exerciseId: 'dumbbell-lateral-raise',  sets: 4, reps: '15-20', restSeconds: 60,  order: 1 },
              { exerciseId: 'cable-face-pull',         sets: 3, reps: '15-20', restSeconds: 60,  order: 2 },
              { exerciseId: 'ez-bar-curl',             sets: 3, reps: '10-12', restSeconds: 60,  order: 3 },
              { exerciseId: 'skull-crusher',           sets: 3, reps: '10-12', restSeconds: 75,  order: 4 },
            ],
          },
          B: {
            week: 'B',
            exercises: [
              { exerciseId: 'dumbbell-lateral-raise',    sets: 4, reps: '15-20', restSeconds: 60,  order: 0 },
              { exerciseId: 'barbell-overhead-press',    sets: 3, reps: '6-8',   restSeconds: 120, order: 1 },
              { exerciseId: 'cable-face-pull',           sets: 3, reps: '15-20', restSeconds: 60,  order: 2 },
              { exerciseId: 'skull-crusher',             sets: 3, reps: '10-12', restSeconds: 75,  order: 3 },
              { exerciseId: 'ez-bar-curl',               sets: 3, reps: '10-12', restSeconds: 60,  order: 4 },
            ],
          },
        },
      },
    ],
  };
}
