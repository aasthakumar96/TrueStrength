import type { MuscleGroup } from '../types';

export const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  chest: 'bg-rose-900 text-rose-300',
  back: 'bg-blue-900 text-blue-300',
  shoulders: 'bg-purple-900 text-purple-300',
  biceps: 'bg-orange-900 text-orange-300',
  triceps: 'bg-yellow-900 text-yellow-300',
  forearms: 'bg-amber-900 text-amber-300',
  quads: 'bg-green-900 text-green-300',
  hamstrings: 'bg-teal-900 text-teal-300',
  glutes: 'bg-pink-900 text-pink-300',
  calves: 'bg-cyan-900 text-cyan-300',
  core: 'bg-indigo-900 text-indigo-300',
  cardio: 'bg-red-900 text-red-300',
};

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  core: 'Core',
  cardio: 'Cardio',
};

export const ALL_MUSCLES: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'quads', 'hamstrings', 'glutes', 'calves', 'core',
];

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_FULL_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function getTodayDayOfWeek(): number {
  // 0 = Monday
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}
