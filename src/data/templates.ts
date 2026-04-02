import type { MuscleGroup, WorkoutExercise } from '../types';

const DEFAULT_TEMPLATES: Record<string, { A: WorkoutExercise[], B: WorkoutExercise[] }> = {
  chest: {
    A: [
      { exerciseId: 'barbell-bench-press', sets: 4, reps: '6-10', restSeconds: 120, order: 0 },
      { exerciseId: 'chest-dips', sets: 3, reps: '8-12', restSeconds: 90, order: 1 },
      { exerciseId: 'cable-crossover', sets: 3, reps: '12-15', restSeconds: 60, order: 2 },
    ],
    B: [
      { exerciseId: 'incline-dumbbell-press', sets: 4, reps: '10-12', restSeconds: 90, order: 0 },
      { exerciseId: 'dumbbell-flyes', sets: 3, reps: '12-15', restSeconds: 60, order: 1 },
      { exerciseId: 'cable-crossover', sets: 3, reps: '12-15', restSeconds: 60, order: 2 },
    ],
  },
  back: {
    A: [
      { exerciseId: 'pull-ups', sets: 4, reps: '6-10', restSeconds: 120, order: 0 },
      { exerciseId: 'bent-over-row', sets: 4, reps: '8-10', restSeconds: 120, order: 1 },
      { exerciseId: 'seated-cable-row', sets: 3, reps: '10-12', restSeconds: 90, order: 2 },
    ],
    B: [
      { exerciseId: 'lat-pulldown', sets: 4, reps: '10-12', restSeconds: 90, order: 0 },
      { exerciseId: 'deadlift', sets: 4, reps: '3-6', restSeconds: 180, order: 1 },
      { exerciseId: 'seated-cable-row', sets: 3, reps: '10-12', restSeconds: 90, order: 2 },
    ],
  },
  shoulders: {
    A: [
      { exerciseId: 'overhead-press', sets: 4, reps: '6-10', restSeconds: 120, order: 0 },
      { exerciseId: 'dumbbell-lateral-raise', sets: 4, reps: '12-15', restSeconds: 60, order: 1 },
      { exerciseId: 'face-pull', sets: 3, reps: '15-20', restSeconds: 60, order: 2 },
    ],
    B: [
      { exerciseId: 'arnold-press', sets: 4, reps: '10-12', restSeconds: 90, order: 0 },
      { exerciseId: 'dumbbell-lateral-raise', sets: 4, reps: '12-15', restSeconds: 60, order: 1 },
      { exerciseId: 'face-pull', sets: 3, reps: '15-20', restSeconds: 60, order: 2 },
    ],
  },
  biceps: {
    A: [
      { exerciseId: 'barbell-curl', sets: 3, reps: '10-12', restSeconds: 60, order: 0 },
      { exerciseId: 'dumbbell-hammer-curl', sets: 3, reps: '12-15', restSeconds: 60, order: 1 },
    ],
    B: [
      { exerciseId: 'incline-dumbbell-curl', sets: 3, reps: '12-15', restSeconds: 60, order: 0 },
      { exerciseId: 'barbell-curl', sets: 3, reps: '10-12', restSeconds: 60, order: 1 },
    ],
  },
  triceps: {
    A: [
      { exerciseId: 'tricep-pushdown', sets: 3, reps: '12-15', restSeconds: 60, order: 0 },
      { exerciseId: 'skull-crushers', sets: 3, reps: '10-12', restSeconds: 90, order: 1 },
    ],
    B: [
      { exerciseId: 'close-grip-bench', sets: 3, reps: '8-12', restSeconds: 90, order: 0 },
      { exerciseId: 'tricep-pushdown', sets: 3, reps: '12-15', restSeconds: 60, order: 1 },
    ],
  },
  quads: {
    A: [
      { exerciseId: 'squat', sets: 4, reps: '6-10', restSeconds: 180, order: 0 },
      { exerciseId: 'leg-extension', sets: 3, reps: '12-15', restSeconds: 60, order: 1 },
    ],
    B: [
      { exerciseId: 'leg-press', sets: 4, reps: '10-15', restSeconds: 90, order: 0 },
      { exerciseId: 'leg-extension', sets: 3, reps: '12-15', restSeconds: 60, order: 1 },
    ],
  },
  hamstrings: {
    A: [
      { exerciseId: 'romanian-deadlift', sets: 4, reps: '8-12', restSeconds: 90, order: 0 },
      { exerciseId: 'leg-curl', sets: 3, reps: '12-15', restSeconds: 60, order: 1 },
    ],
    B: [
      { exerciseId: 'leg-curl', sets: 4, reps: '12-15', restSeconds: 60, order: 0 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: '8-12', restSeconds: 90, order: 1 },
    ],
  },
  glutes: {
    A: [
      { exerciseId: 'hip-thrust', sets: 4, reps: '10-15', restSeconds: 90, order: 0 },
      { exerciseId: 'cable-kickback', sets: 3, reps: '15-20', restSeconds: 60, order: 1 },
    ],
    B: [
      { exerciseId: 'hip-thrust', sets: 4, reps: '10-15', restSeconds: 90, order: 0 },
      { exerciseId: 'cable-kickback', sets: 3, reps: '15-20', restSeconds: 60, order: 1 },
    ],
  },
  core: {
    A: [
      { exerciseId: 'plank', sets: 3, reps: '60 sec', restSeconds: 60, order: 0 },
      { exerciseId: 'cable-crunch', sets: 3, reps: '15-20', restSeconds: 60, order: 1 },
    ],
    B: [
      { exerciseId: 'hanging-leg-raise', sets: 3, reps: '12-15', restSeconds: 60, order: 0 },
      { exerciseId: 'plank', sets: 3, reps: '60 sec', restSeconds: 60, order: 1 },
    ],
  },
};

export function getDefaultTemplate(muscleGroups: MuscleGroup[]): { A: WorkoutExercise[], B: WorkoutExercise[] } {
  const key = muscleGroups[0]; // Use primary muscle for template lookup
  const template = DEFAULT_TEMPLATES[key];
  if (template) return template;

  // Fallback: empty template
  return { A: [], B: [] };
}

export { DEFAULT_TEMPLATES };
