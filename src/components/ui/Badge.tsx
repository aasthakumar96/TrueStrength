import type { MuscleGroup } from '../../types';
import { MUSCLE_COLORS, MUSCLE_LABELS } from '../../utils';

interface BadgeProps {
  muscle?: MuscleGroup;
  label?: string;
  className?: string;
}

export function MuscleBadge({ muscle, label, className = '' }: BadgeProps) {
  if (!muscle && !label) return null;
  const color = muscle ? MUSCLE_COLORS[muscle] : 'bg-slate-700 text-slate-300';
  const text = label || (muscle ? MUSCLE_LABELS[muscle] : '');
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${color} ${className}`}>
      {text}
    </span>
  );
}

interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const colors = {
    beginner: 'bg-green-900 text-green-300',
    intermediate: 'bg-yellow-900 text-yellow-300',
    advanced: 'bg-red-900 text-red-300',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
}
