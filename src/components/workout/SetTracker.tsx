import { useState } from 'react';
import { Check } from 'lucide-react';
import type { CompletedSet } from '../../types';

interface SetTrackerProps {
  totalSets: number;
  completedSets: CompletedSet[];
  onCompleteSet: (set: CompletedSet) => void;
  onRemoveSet: (setNumber: number) => void;
}

export function SetTracker({ totalSets, completedSets, onCompleteSet, onRemoveSet }: SetTrackerProps) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const completedNumbers = new Set(completedSets.map(s => s.setNumber));

  const handleComplete = (setNumber: number) => {
    if (completedNumbers.has(setNumber)) {
      onRemoveSet(setNumber);
      return;
    }
    onCompleteSet({
      setNumber,
      repsCompleted: parseInt(reps) || 0,
      weightKg: weight ? parseFloat(weight) : undefined,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-text-secondary mb-1 block">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-700 text-text-primary rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-text-secondary mb-1 block">Reps</label>
          <input
            type="number"
            value={reps}
            onChange={e => setReps(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-700 text-text-primary rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: totalSets }, (_, i) => i + 1).map(setNum => {
          const done = completedNumbers.has(setNum);
          return (
            <button
              key={setNum}
              onClick={() => handleComplete(setNum)}
              className={`h-14 rounded-xl font-bold text-lg transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5 ${
                done
                  ? 'bg-success text-white'
                  : 'bg-slate-700 text-text-secondary hover:bg-slate-600'
              }`}
            >
              {done ? <Check size={20} /> : <span className="text-sm text-text-secondary">Set</span>}
              <span className={done ? 'text-xs' : 'text-lg font-mono'}>{setNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
