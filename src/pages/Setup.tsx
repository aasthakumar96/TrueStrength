import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Dumbbell } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MuscleBadge } from '../components/ui/Badge';
import { usePlanStore } from '../stores/planStore';
import { exercises } from '../data/exercises';
import { getDefaultTemplate } from '../data/templates';
import { ALL_MUSCLES, MUSCLE_LABELS, DAY_NAMES, generateId } from '../utils';
import type { MuscleGroup, TrainingDay, WorkoutPlan, WorkoutExercise } from '../types';
import { savePlan } from '../db';

interface SetupDay {
  dayOfWeek: number;
  label: string;
  active: boolean;
  muscleGroups: MuscleGroup[];
  variationA: WorkoutExercise[];
  variationB: WorkoutExercise[];
}

const PRESET_LABELS = ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full Body', 'Arms', 'Shoulders'];

export function Setup() {
  const navigate = useNavigate();
  const { setPlan } = usePlanStore();
  const [step, setStep] = useState(0);

  const [days, setDays] = useState<SetupDay[]>(
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      label: '',
      active: i < 5,
      muscleGroups: [],
      variationA: [],
      variationB: [],
    }))
  );

  const [showExercisePicker, setShowExercisePicker] = useState<{ dayIdx: number; week: 'A' | 'B' } | null>(null);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | null>(null);

  const activeDays = days.filter(d => d.active);

  const handleToggleDay = (idx: number) => {
    setDays(d => d.map((day, i) => i === idx ? { ...day, active: !day.active } : day));
  };

  const handleLabelChange = (idx: number, label: string) => {
    setDays(d => d.map((day, i) => i === idx ? { ...day, label } : day));
  };

  const handleToggleMuscle = (dayIdx: number, muscle: MuscleGroup) => {
    setDays(d => d.map((day, i) => {
      if (i !== dayIdx) return day;
      const has = day.muscleGroups.includes(muscle);
      return { ...day, muscleGroups: has ? day.muscleGroups.filter(m => m !== muscle) : [...day.muscleGroups, muscle] };
    }));
  };

  const handleUseDefault = (dayIdx: number) => {
    const day = days[dayIdx];
    if (!day.muscleGroups.length) return;
    const template = getDefaultTemplate(day.muscleGroups);
    setDays(d => d.map((dy, i) => i !== dayIdx ? dy : {
      ...dy, variationA: template.A, variationB: template.B,
    }));
  };

  const handleAddExercise = (dayIdx: number, week: 'A' | 'B', exerciseId: string) => {
    const ex = exercises.find(e => e.id === exerciseId);
    if (!ex) return;
    const newEx: WorkoutExercise = {
      exerciseId,
      sets: ex.defaultSets,
      reps: ex.defaultReps,
      restSeconds: ex.restSeconds,
      order: 0,
    };
    setDays(d => d.map((day, i) => {
      if (i !== dayIdx) return day;
      if (week === 'A') {
        const updated = [...day.variationA, { ...newEx, order: day.variationA.length }];
        return { ...day, variationA: updated };
      } else {
        const updated = [...day.variationB, { ...newEx, order: day.variationB.length }];
        return { ...day, variationB: updated };
      }
    }));
  };

  const handleRemoveExercise = (dayIdx: number, week: 'A' | 'B', exIdx: number) => {
    setDays(d => d.map((day, i) => {
      if (i !== dayIdx) return day;
      if (week === 'A') return { ...day, variationA: day.variationA.filter((_, j) => j !== exIdx) };
      return { ...day, variationB: day.variationB.filter((_, j) => j !== exIdx) };
    }));
  };

  const handleFinish = async () => {
    const trainingDays: TrainingDay[] = days
      .filter(d => d.active)
      .map(d => ({
        id: generateId(),
        dayOfWeek: d.dayOfWeek,
        label: d.label || DAY_NAMES[d.dayOfWeek],
        muscleGroups: d.muscleGroups,
        variations: {
          A: { week: 'A', exercises: d.variationA },
          B: { week: 'B', exercises: d.variationB },
        },
      }));

    const plan: WorkoutPlan = {
      id: generateId(),
      name: 'My Program',
      days: trainingDays,
      createdAt: new Date().toISOString(),
      currentWeek: 'A',
    };

    await savePlan(plan);
    setPlan(plan);
    navigate('/');
  };

  const filteredExercises = exercises.filter(e => {
    const matchSearch = !exerciseSearch || e.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchMuscle = !muscleFilter || e.primaryMuscle === muscleFilter;
    return matchSearch && matchMuscle;
  });

  // STEP 0: Day Selection
  if (step === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col max-w-lg mx-auto">
        <div className="p-4 pt-8">
          <div className="flex gap-1 mb-8">
            {[0,1,2,3].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-slate-700'}`} />
            ))}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Dumbbell className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Step 1 of 4</p>
              <h2 className="text-xl font-bold text-text-primary">Pick Training Days</h2>
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-6">Select which days you train and give them a name.</p>

          <div className="space-y-3">
            {days.map((day, idx) => (
              <div key={idx} className={`rounded-2xl border transition-all ${day.active ? 'bg-surface-2 border-primary/50' : 'bg-surface-2 border-slate-700'}`}>
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => handleToggleDay(idx)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      day.active ? 'bg-primary border-primary' : 'border-slate-600'
                    }`}
                  >
                    {day.active && <Check size={14} className="text-white" />}
                  </button>
                  <span className="font-semibold text-text-primary w-10">{DAY_NAMES[idx]}</span>
                  {day.active && (
                    <div className="flex-1 flex gap-2 flex-wrap">
                      {PRESET_LABELS.map(label => (
                        <button
                          key={label}
                          onClick={() => handleLabelChange(idx, label)}
                          className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                            day.label === label ? 'bg-primary text-white' : 'bg-slate-700 text-text-secondary hover:bg-slate-600'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                  {!day.active && <span className="text-text-secondary text-sm flex-1">Rest Day</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 mt-auto">
          <Button fullWidth size="lg" onClick={() => setStep(1)} disabled={activeDays.length === 0}>
            Continue <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    );
  }

  // STEP 1: Muscle Groups
  if (step === 1) {
    return (
      <div className="min-h-screen bg-surface flex flex-col max-w-lg mx-auto">
        <div className="p-4 pt-8">
          <div className="flex gap-1 mb-8">
            {[0,1,2,3].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-slate-700'}`} />
            ))}
          </div>
          <div className="mb-2">
            <p className="text-text-secondary text-sm">Step 2 of 4</p>
            <h2 className="text-xl font-bold text-text-primary">Assign Muscle Groups</h2>
          </div>
          <p className="text-text-secondary text-sm mb-6">Choose which muscles each day targets.</p>

          <div className="space-y-4">
            {activeDays.map((day) => {
              const idx = day.dayOfWeek;
              return (
                <div key={idx} className="bg-surface-2 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-text-secondary text-sm">{DAY_NAMES[idx]}</span>
                    <span className="font-bold text-text-primary">{day.label || 'Training Day'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_MUSCLES.map(muscle => {
                      const selected = day.muscleGroups.includes(muscle);
                      return (
                        <button
                          key={muscle}
                          onClick={() => handleToggleMuscle(idx, muscle)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            selected ? 'bg-primary text-white' : 'bg-slate-700 text-text-secondary hover:bg-slate-600'
                          }`}
                        >
                          {MUSCLE_LABELS[muscle]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 mt-auto flex gap-3">
          <Button variant="secondary" onClick={() => setStep(0)}>
            <ChevronLeft size={20} />
          </Button>
          <Button fullWidth size="lg" onClick={() => setStep(2)}>
            Continue <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    );
  }

  // STEP 2: Exercise Selection
  if (step === 2) {
    const pickerDay = showExercisePicker ? days[showExercisePicker.dayIdx] : null;

    return (
      <div className="min-h-screen bg-surface flex flex-col max-w-lg mx-auto">
        {showExercisePicker ? (
          // Exercise Picker Modal
          <div className="flex flex-col flex-1">
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <button onClick={() => { setShowExercisePicker(null); setExerciseSearch(''); setMuscleFilter(null); }} className="text-text-secondary">
                <ChevronLeft size={22} />
              </button>
              <h3 className="font-bold text-text-primary">
                Add Exercise — Week {showExercisePicker.week}
              </h3>
            </div>
            <div className="p-4 space-y-3 flex-1 overflow-auto">
              <input
                type="text"
                placeholder="Search exercises..."
                value={exerciseSearch}
                onChange={e => setExerciseSearch(e.target.value)}
                className="w-full bg-surface-2 text-text-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setMuscleFilter(null)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${!muscleFilter ? 'bg-primary text-white' : 'bg-slate-700 text-text-secondary'}`}
                >
                  All
                </button>
                {ALL_MUSCLES.map(m => (
                  <button
                    key={m}
                    onClick={() => setMuscleFilter(m)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${muscleFilter === m ? 'bg-primary text-white' : 'bg-slate-700 text-text-secondary'}`}
                  >
                    {MUSCLE_LABELS[m]}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {filteredExercises.map(ex => {
                  const alreadyAdded = showExercisePicker.week === 'A'
                    ? pickerDay?.variationA.some(e => e.exerciseId === ex.id)
                    : pickerDay?.variationB.some(e => e.exerciseId === ex.id);
                  return (
                    <button
                      key={ex.id}
                      disabled={alreadyAdded}
                      onClick={() => {
                        handleAddExercise(showExercisePicker.dayIdx, showExercisePicker.week, ex.id);
                        setShowExercisePicker(null);
                        setExerciseSearch('');
                        setMuscleFilter(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${
                        alreadyAdded ? 'opacity-40 cursor-not-allowed bg-surface-2' : 'bg-surface-2 hover:bg-slate-700 active:scale-98'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-text-primary text-sm">{ex.name}</p>
                        <p className="text-text-secondary text-xs">{ex.defaultSets} × {ex.defaultReps} · {ex.equipment}</p>
                      </div>
                      <MuscleBadge muscle={ex.primaryMuscle} />
                      {alreadyAdded && <Check size={16} className="text-success flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 pt-8 flex-1 overflow-auto">
              <div className="flex gap-1 mb-8">
                {[0,1,2,3].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-slate-700'}`} />
                ))}
              </div>
              <div className="mb-2">
                <p className="text-text-secondary text-sm">Step 3 of 4</p>
                <h2 className="text-xl font-bold text-text-primary">Assign Exercises</h2>
              </div>
              <p className="text-text-secondary text-sm mb-6">Configure Week A and B variations for each day.</p>

              <div className="space-y-6">
                {activeDays.map((day) => {
                  const idx = day.dayOfWeek;
                  return (
                    <div key={idx} className="bg-surface-2 rounded-2xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-text-secondary text-sm">{DAY_NAMES[idx]} · </span>
                          <span className="font-bold text-text-primary">{day.label || 'Training Day'}</span>
                        </div>
                        {day.muscleGroups.length > 0 && (
                          <button
                            onClick={() => handleUseDefault(idx)}
                            className="text-xs text-accent hover:text-sky-400 font-medium"
                          >
                            Use Default
                          </button>
                        )}
                      </div>

                      {(['A', 'B'] as const).map(week => {
                        const variation = week === 'A' ? day.variationA : day.variationB;
                        return (
                          <div key={week}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Week {week}</span>
                              <button
                                onClick={() => setShowExercisePicker({ dayIdx: idx, week })}
                                className="text-xs text-primary hover:text-blue-400 font-medium"
                              >
                                + Add Exercise
                              </button>
                            </div>
                            <div className="space-y-2">
                              {variation.length === 0 && (
                                <p className="text-text-secondary text-xs text-center py-3 bg-slate-800 rounded-xl">No exercises yet</p>
                              )}
                              {variation.map((we, wIdx) => {
                                const ex = exercises.find(e => e.id === we.exerciseId);
                                if (!ex) return null;
                                return (
                                  <div key={wIdx} className="flex items-center gap-2 bg-slate-800 rounded-xl p-2">
                                    <div className="flex-1">
                                      <p className="text-text-primary text-sm font-medium">{ex.name}</p>
                                      <p className="text-text-secondary text-xs">{we.sets} × {we.reps}</p>
                                    </div>
                                    <button
                                      onClick={() => handleRemoveExercise(idx, week, wIdx)}
                                      className="text-slate-500 hover:text-red-400 p-1"
                                    >
                                      ×
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)}>
                <ChevronLeft size={20} />
              </Button>
              <Button fullWidth size="lg" onClick={() => setStep(3)}>
                Continue <ChevronRight size={20} />
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // STEP 3: Review
  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-lg mx-auto">
      <div className="p-4 pt-8 flex-1 overflow-auto">
        <div className="flex gap-1 mb-8">
          {[0,1,2,3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-slate-700'}`} />
          ))}
        </div>
        <div className="mb-2">
          <p className="text-text-secondary text-sm">Step 4 of 4</p>
          <h2 className="text-xl font-bold text-text-primary">Review Your Plan</h2>
        </div>
        <p className="text-text-secondary text-sm mb-6">Confirm everything looks right before saving.</p>

        <div className="space-y-3">
          {activeDays.map((day) => {
            const idx = day.dayOfWeek;
            return (
              <div key={idx} className="bg-surface-2 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-text-secondary text-sm">{DAY_NAMES[idx]} · </span>
                    <span className="font-bold text-text-primary">{day.label || 'Training Day'}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {day.muscleGroups.map(m => <MuscleBadge key={m} muscle={m} />)}
                  </div>
                </div>
                <div className="text-xs text-text-secondary">
                  Week A: {day.variationA.length} exercises · Week B: {day.variationB.length} exercises
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 flex gap-3">
        <Button variant="secondary" onClick={() => setStep(2)}>
          <ChevronLeft size={20} />
        </Button>
        <Button fullWidth size="lg" onClick={handleFinish} disabled={activeDays.length === 0}>
          <Check size={20} /> Save Plan
        </Button>
      </div>
    </div>
  );
}
