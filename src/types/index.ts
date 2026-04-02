export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms' | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core' | 'cardio';

export type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'smith-machine' | 'kettlebell' | 'resistance-band' | 'trap-bar' | 'ez-bar';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'compound' | 'isolation';
  defaultSets: number;
  defaultReps: string;
  restSeconds: number;
  instructions: string[];
  tips: string[];
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  order: number;
}

export interface DayVariation {
  week: 'A' | 'B';
  exercises: WorkoutExercise[];
}

export interface TrainingDay {
  id: string;
  dayOfWeek: number; // 0 = Monday
  label: string;
  muscleGroups: MuscleGroup[];
  variations: { A: DayVariation; B: DayVariation };
}

export interface WorkoutPlan {
  id: string;
  name: string;
  days: TrainingDay[];
  createdAt: string;
  currentWeek: 'A' | 'B';
}

export interface CompletedSet {
  setNumber: number;
  repsCompleted: number;
  weightKg?: number;
  timestamp: string;
}

export interface WorkoutSession {
  id: string;
  dayId: string;
  week: 'A' | 'B';
  date: string;
  completedExercises: Record<string, CompletedSet[]>;
  durationSeconds: number;
  completed: boolean;
}
