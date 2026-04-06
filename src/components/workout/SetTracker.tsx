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
      // Haptic: vibrate([30]) on deselect
      if ('vibrate' in navigator) navigator.vibrate(20);
      onRemoveSet(setNumber);
      return;
    }
    // Haptic: vibrate([30]) on set log
    if ('vibrate' in navigator) navigator.vibrate(30);
    onCompleteSet({
      setNumber,
      repsCompleted: parseInt(reps) || 0,
      weightKg: weight ? parseFloat(weight) : undefined,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      {/* Weight + Reps inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-fluid-xs text-text-3 uppercase tracking-widest mb-2 block font-medium">
            Weight (kg)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="—"
            className="w-full bg-surface-3 border border-border text-text-1 rounded-btn px-4 py-3 text-fluid-lg font-semibold text-center focus:outline-none focus:border-accent/60 focus:bg-surface-4 transition-colors placeholder:text-text-3"
          />
        </div>
        <div>
          <label className="text-fluid-xs text-text-3 uppercase tracking-widest mb-2 block font-medium">
            Reps
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={e => setReps(e.target.value)}
            placeholder="—"
            className="w-full bg-surface-3 border border-border text-text-1 rounded-btn px-4 py-3 text-fluid-lg font-semibold text-center focus:outline-none focus:border-accent/60 focus:bg-surface-4 transition-colors placeholder:text-text-3"
          />
        </div>
      </div>

      {/* Set buttons */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: totalSets }, (_, i) => i + 1).map(setNum => {
          const done = completedNumbers.has(setNum);
          const setData = completedSets.find(s => s.setNumber === setNum);
          return (
            <button
              key={setNum}
              onClick={() => handleComplete(setNum)}
              className={`h-16 rounded-btn flex flex-col items-center justify-center gap-0.5 pressable border transition-colors ${
                done
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'bg-surface-3 border-border text-text-2 hover:border-border-light hover:text-text-1'
              }`}
            >
              {done ? (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  {setData?.weightKg && (
                    <span className="text-fluid-xs font-medium opacity-75">
                      {setData.weightKg}kg
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-fluid-xs text-text-3 uppercase tracking-wider">Set</span>
                  <span className="text-fluid-base font-semibold">{setNum}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
