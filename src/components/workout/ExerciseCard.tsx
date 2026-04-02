import { Exercise } from '../../types';
import { MuscleBadge, DifficultyBadge } from '../ui/Badge';
import { Dumbbell } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  sets: number;
  reps: string;
  compact?: boolean;
}

export function ExerciseCard({ exercise, sets, reps, compact }: ExerciseCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-xl">
        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <Dumbbell size={18} className="text-text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary text-sm truncate">{exercise.name}</p>
          <p className="text-text-secondary text-xs">{sets} × {reps}</p>
        </div>
        <MuscleBadge muscle={exercise.primaryMuscle} />
      </div>
    );
  }

  return (
    <div className="bg-surface-2 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
          <Dumbbell size={24} className="text-text-secondary" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-text-primary text-base">{exercise.name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <MuscleBadge muscle={exercise.primaryMuscle} />
            <DifficultyBadge difficulty={exercise.difficulty} />
            <span className="text-text-secondary text-xs">{exercise.equipment}</span>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="text-center">
              <p className="font-mono font-bold text-text-primary text-lg">{sets}</p>
              <p className="text-text-secondary text-xs">sets</p>
            </div>
            <div className="text-center">
              <p className="font-mono font-bold text-text-primary text-lg">{reps}</p>
              <p className="text-text-secondary text-xs">reps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
