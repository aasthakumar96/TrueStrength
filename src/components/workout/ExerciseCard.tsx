import { Exercise } from '../../types';
import { MuscleBadge, DifficultyBadge } from '../ui/Badge';

interface ExerciseCardProps {
  exercise: Exercise;
  sets: number;
  reps: string;
  compact?: boolean;
}

export function ExerciseCard({ exercise, sets, reps, compact }: ExerciseCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-4 px-5 py-4 bg-surface-2 rounded-card border border-border">
        <div className="flex-1 min-w-0">
          <p className="text-fluid-sm font-semibold text-text-1 truncate">{exercise.name}</p>
          <p className="text-fluid-xs text-text-2 mt-0.5">{sets} × {reps}</p>
        </div>
        <MuscleBadge muscle={exercise.primaryMuscle} />
      </div>
    );
  }

  return (
    <div className="bg-surface-2 rounded-card border border-border px-5 py-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <h3 className="font-display text-fluid-xl font-semibold text-text-1 leading-tight">
            {exercise.name}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <MuscleBadge muscle={exercise.primaryMuscle} />
            <DifficultyBadge difficulty={exercise.difficulty} />
            <span className="text-fluid-xs text-text-3 capitalize">{exercise.equipment.replace('-', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div>
          <p className="text-fluid-2xl font-display font-semibold text-text-1 leading-none">{sets}</p>
          <p className="text-fluid-xs text-text-3 mt-1 uppercase tracking-widest">sets</p>
        </div>
        <div className="w-px bg-border self-stretch" />
        <div>
          <p className="text-fluid-2xl font-display font-semibold text-text-1 leading-none">{reps}</p>
          <p className="text-fluid-xs text-text-3 mt-1 uppercase tracking-widest">reps</p>
        </div>
      </div>
    </div>
  );
}
