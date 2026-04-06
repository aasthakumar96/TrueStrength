import type { MuscleGroup } from '../types';

// Muted, dark-warm-friendly muscle group colors
// Each group uses a very dark tinted bg with matching muted text
export const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  chest:      'bg-rose-950/70 text-rose-400 border border-rose-900/40',
  back:       'bg-sky-950/70 text-sky-400 border border-sky-900/40',
  shoulders:  'bg-violet-950/70 text-violet-400 border border-violet-900/40',
  biceps:     'bg-orange-950/70 text-orange-400 border border-orange-900/40',
  triceps:    'bg-amber-950/70 text-amber-400 border border-amber-900/40',
  forearms:   'bg-yellow-950/70 text-yellow-500 border border-yellow-900/40',
  quads:      'bg-emerald-950/70 text-emerald-400 border border-emerald-900/40',
  hamstrings: 'bg-teal-950/70 text-teal-400 border border-teal-900/40',
  glutes:     'bg-fuchsia-950/70 text-fuchsia-400 border border-fuchsia-900/40',
  calves:     'bg-cyan-950/70 text-cyan-400 border border-cyan-900/40',
  core:       'bg-indigo-950/70 text-indigo-400 border border-indigo-900/40',
  cardio:     'bg-red-950/70 text-red-400 border border-red-900/40',
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

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
