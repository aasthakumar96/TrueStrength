import type { MuscleGroup } from '../../types';
import { MUSCLE_COLORS, MUSCLE_LABELS } from '../../utils';

interface BadgeProps {
  muscle?: MuscleGroup;
  label?: string;
  className?: string;
}

export function MuscleBadge({ muscle, label, className = '' }: BadgeProps) {
  if (!muscle && !label) return null;
  const color = muscle ? MUSCLE_COLORS[muscle] : 'bg-surface-3 text-text-2 border border-border';
  const text = label || (muscle ? MUSCLE_LABELS[muscle] : '');
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-pill text-fluid-xs font-semibold tracking-wide ${color} ${className}`}
    >
      {text}
    </span>
  );
}

interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const styles = {
    beginner:     'bg-emerald-950/70 text-emerald-400 border border-emerald-900/40',
    intermediate: 'bg-amber-950/70 text-amber-400 border border-amber-900/40',
    advanced:     'bg-rose-950/70 text-rose-400 border border-rose-900/40',
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-pill text-fluid-xs font-semibold tracking-wide ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
