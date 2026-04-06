import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MuscleBadge } from '../components/ui/Badge';
import { usePlanStore } from '../stores/planStore';
import { exercises } from '../data/exercises';
import { getDefaultTemplate } from '../data/templates';
import { ALL_MUSCLES, MUSCLE_LABELS, DAY_NAMES, DAY_FULL_NAMES, generateId } from '../utils';
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

const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0 },
  exit:   (d: number) => ({ opacity: 0, x: d * -40 }),
};

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-pill transition-all duration-300 ${
            i <= current ? 'bg-accent' : 'bg-surface-3'
          }`}
        />
      ))}
    </div>
  );
}

export function Setup() {
  const navigate = useNavigate();
  const { setPlan } = usePlanStore();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

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

  const goNext = (n: number) => { setDirection(1);  setStep(n); };
  const goPrev = (n: number) => { setDirection(-1); setStep(n); };

  const handleToggleDay    = (idx: number) =>
    setDays(d => d.map((day, i) => i === idx ? { ...day, active: !day.active } : day));

  const handleLabelChange  = (idx: number, label: string) =>
    setDays(d => d.map((day, i) => i === idx ? { ...day, label } : day));

  const handleToggleMuscle = (dayIdx: number, muscle: MuscleGroup) =>
    setDays(d => d.map((day, i) => {
      if (i !== dayIdx) return day;
      const has = day.muscleGroups.includes(muscle);
      return { ...day, muscleGroups: has ? day.muscleGroups.filter(m => m !== muscle) : [...day.muscleGroups, muscle] };
    }));

  const handleUseDefault   = (dayIdx: number) => {
    const day = days[dayIdx];
    if (!day.muscleGroups.length) return;
    const template = getDefaultTemplate(day.muscleGroups);
    setDays(d => d.map((dy, i) => i !== dayIdx ? dy : { ...dy, variationA: template.A, variationB: template.B }));
  };

  const handleAddExercise  = (dayIdx: number, week: 'A' | 'B', exerciseId: string) => {
    const ex = exercises.find(e => e.id === exerciseId);
    if (!ex) return;
    const newEx: WorkoutExercise = { exerciseId, sets: ex.defaultSets, reps: ex.defaultReps, restSeconds: ex.restSeconds, order: 0 };
    setDays(d => d.map((day, i) => {
      if (i !== dayIdx) return day;
      if (week === 'A') return { ...day, variationA: [...day.variationA, { ...newEx, order: day.variationA.length }] };
      return { ...day, variationB: [...day.variationB, { ...newEx, order: day.variationB.length }] };
    }));
  };

  const handleRemoveExercise = (dayIdx: number, week: 'A' | 'B', exIdx: number) =>
    setDays(d => d.map((day, i) => {
      if (i !== dayIdx) return day;
      if (week === 'A') return { ...day, variationA: day.variationA.filter((_, j) => j !== exIdx) };
      return { ...day, variationB: day.variationB.filter((_, j) => j !== exIdx) };
    }));

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

  const wrapperClass = 'bg-bg flex flex-col max-w-lg mx-auto overflow-hidden';

  // ── Exercise Picker (full-screen sheet) ───────────────────────────
  if (showExercisePicker && step === 2) {
    const pickerDay = days[showExercisePicker.dayIdx];
    const closePicker = () => { setShowExercisePicker(null); setExerciseSearch(''); setMuscleFilter(null); };

    return (
      <div className={wrapperClass} style={{ height: '100dvh' }}>
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b border-border flex-shrink-0"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}
        >
          <button onClick={closePicker} className="w-10 h-10 flex items-center justify-center text-text-2 pressable rounded-xl">
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>
          <div className="flex-1">
            <p className="text-fluid-sm font-semibold text-text-1">Add Exercise</p>
            <p className="text-fluid-xs text-text-3">Week {showExercisePicker.week}</p>
          </div>
        </div>

        {/* Search + filter */}
        <div className="px-5 pt-4 pb-3 space-y-3 flex-shrink-0 border-b border-border">
          <input
            type="text"
            placeholder="Search exercises…"
            value={exerciseSearch}
            onChange={e => setExerciseSearch(e.target.value)}
            className="w-full bg-surface-2 border border-border text-text-1 rounded-btn px-4 py-3 text-fluid-sm focus:outline-none focus:border-accent/50 placeholder:text-text-3 transition-colors"
          />
          <div className="flex gap-2 overflow-x-auto pb-1 scroll-momentum">
            <button
              onClick={() => setMuscleFilter(null)}
              className={`px-3 py-1.5 rounded-pill text-fluid-xs font-semibold whitespace-nowrap pressable border transition-colors ${
                !muscleFilter
                  ? 'bg-accent text-bg border-accent'
                  : 'bg-surface-2 text-text-2 border-border hover:border-border-light'
              }`}
            >
              All
            </button>
            {ALL_MUSCLES.map(m => (
              <button
                key={m}
                onClick={() => setMuscleFilter(m)}
                className={`px-3 py-1.5 rounded-pill text-fluid-xs font-semibold whitespace-nowrap pressable border transition-colors ${
                  muscleFilter === m
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-surface-2 text-text-2 border-border hover:border-border-light'
                }`}
              >
                {MUSCLE_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto scroll-momentum px-5 py-3 space-y-2">
          {filteredExercises.map(ex => {
            const alreadyAdded = showExercisePicker.week === 'A'
              ? pickerDay.variationA.some(e => e.exerciseId === ex.id)
              : pickerDay.variationB.some(e => e.exerciseId === ex.id);
            return (
              <button
                key={ex.id}
                disabled={alreadyAdded}
                onClick={() => {
                  handleAddExercise(showExercisePicker.dayIdx, showExercisePicker.week, ex.id);
                  closePicker();
                }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-card border transition-colors ${
                  alreadyAdded
                    ? 'opacity-40 cursor-not-allowed bg-surface-2 border-border'
                    : 'bg-surface-2 border-border hover:border-border-light pressable hover:bg-surface-3'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-fluid-sm font-semibold text-text-1 truncate">{ex.name}</p>
                  <p className="text-fluid-xs text-text-2 mt-0.5">
                    {ex.defaultSets} × {ex.defaultReps}
                    <span className="text-text-3 ml-1.5 capitalize">· {ex.equipment.replace('-', ' ')}</span>
                  </p>
                </div>
                <MuscleBadge muscle={ex.primaryMuscle} />
                {alreadyAdded && <Check size={15} className="text-success flex-shrink-0" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Step pages ────────────────────────────────────────────────────
  const stepContent = () => {
    // STEP 0: Training days
    if (step === 0) return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto scroll-momentum px-5 py-6">
          <StepDots total={4} current={0} />
          <p className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold mb-1">Step 1 of 4</p>
          <h2 className="font-display text-fluid-2xl text-text-1 font-semibold mb-1">Pick Training Days</h2>
          <p className="text-fluid-sm text-text-2 mb-6">Select which days you train and name them.</p>

          <div className="space-y-2.5">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`rounded-card border transition-colors ${
                  day.active ? 'bg-surface-2 border-accent/30' : 'bg-surface-2 border-border'
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-4">
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggleDay(idx)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all pressable ${
                      day.active ? 'bg-accent border-accent' : 'border-border-light'
                    }`}
                  >
                    {day.active && <Check size={13} className="text-bg" strokeWidth={3} />}
                  </button>
                  <span className={`text-fluid-sm font-semibold w-9 flex-shrink-0 ${day.active ? 'text-text-1' : 'text-text-3'}`}>
                    {DAY_NAMES[idx]}
                  </span>

                  {day.active ? (
                    <div className="flex-1 flex gap-1.5 flex-wrap">
                      {PRESET_LABELS.map(label => (
                        <button
                          key={label}
                          onClick={() => handleLabelChange(idx, label)}
                          className={`px-2.5 py-1 rounded-pill text-fluid-xs font-semibold pressable border transition-colors ${
                            day.label === label
                              ? 'bg-accent text-bg border-accent'
                              : 'bg-surface-3 text-text-2 border-border hover:border-border-light'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-fluid-sm text-text-3 flex-1">Rest</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border flex-shrink-0" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
          <Button fullWidth size="lg" onClick={() => goNext(1)} disabled={activeDays.length === 0}>
            Continue <ChevronRight size={18} strokeWidth={2} />
          </Button>
        </div>
      </div>
    );

    // STEP 1: Muscle groups
    if (step === 1) return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto scroll-momentum px-5 py-6">
          <StepDots total={4} current={1} />
          <p className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold mb-1">Step 2 of 4</p>
          <h2 className="font-display text-fluid-2xl text-text-1 font-semibold mb-1">Assign Muscles</h2>
          <p className="text-fluid-sm text-text-2 mb-6">Which muscles does each day target?</p>

          <div className="space-y-3">
            {activeDays.map(day => {
              const idx = day.dayOfWeek;
              return (
                <div key={idx} className="bg-surface-2 rounded-card border border-border px-5 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-fluid-xs text-text-3">{DAY_NAMES[idx]}</span>
                    <span className="text-fluid-sm font-semibold text-text-1">{day.label || 'Training Day'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_MUSCLES.map(muscle => {
                      const selected = day.muscleGroups.includes(muscle);
                      return (
                        <button
                          key={muscle}
                          onClick={() => handleToggleMuscle(idx, muscle)}
                          className={`px-3 py-1.5 rounded-pill text-fluid-xs font-semibold pressable border transition-colors ${
                            selected
                              ? 'bg-accent text-bg border-accent'
                              : 'bg-surface-3 text-text-2 border-border hover:border-border-light'
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

        <div className="px-5 py-4 border-t border-border flex gap-3 flex-shrink-0" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
          <Button variant="secondary" onClick={() => goPrev(0)} className="w-14 h-14 p-0 flex-shrink-0">
            <ChevronLeft size={20} strokeWidth={1.75} />
          </Button>
          <Button fullWidth size="lg" onClick={() => goNext(2)}>
            Continue <ChevronRight size={18} strokeWidth={2} />
          </Button>
        </div>
      </div>
    );

    // STEP 2: Exercises
    if (step === 2) return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto scroll-momentum px-5 py-6">
          <StepDots total={4} current={2} />
          <p className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold mb-1">Step 3 of 4</p>
          <h2 className="font-display text-fluid-2xl text-text-1 font-semibold mb-1">Assign Exercises</h2>
          <p className="text-fluid-sm text-text-2 mb-6">Set Week A &amp; B variations for each day.</p>

          <div className="space-y-4">
            {activeDays.map(day => {
              const idx = day.dayOfWeek;
              return (
                <div key={idx} className="bg-surface-2 rounded-card border border-border px-5 py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-fluid-xs text-text-3">{DAY_NAMES[idx]}</span>
                      <span className="text-fluid-sm font-semibold text-text-1">{day.label || 'Training Day'}</span>
                    </div>
                    {day.muscleGroups.length > 0 && (
                      <button
                        onClick={() => handleUseDefault(idx)}
                        className="text-fluid-xs text-accent hover:text-accent-text font-semibold pressable"
                      >
                        Use defaults
                      </button>
                    )}
                  </div>

                  {(['A', 'B'] as const).map(week => {
                    const variation = week === 'A' ? day.variationA : day.variationB;
                    return (
                      <div key={week}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold">
                            Week {week}
                          </span>
                          <button
                            onClick={() => setShowExercisePicker({ dayIdx: idx, week })}
                            className="text-fluid-xs text-accent font-semibold pressable hover:text-accent-text"
                          >
                            + Add
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {variation.length === 0 ? (
                            <p className="text-fluid-xs text-text-3 py-3 text-center bg-surface-3 rounded-card border border-border">
                              No exercises yet
                            </p>
                          ) : (
                            variation.map((we, wIdx) => {
                              const ex = exercises.find(e => e.id === we.exerciseId);
                              if (!ex) return null;
                              return (
                                <div key={wIdx} className="flex items-center gap-3 px-3 py-2.5 bg-surface-3 rounded-card border border-border">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-fluid-sm text-text-1 font-medium truncate">{ex.name}</p>
                                    <p className="text-fluid-xs text-text-3">{we.sets} × {we.reps}</p>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveExercise(idx, week, wIdx)}
                                    className="w-8 h-8 flex items-center justify-center text-text-3 hover:text-danger pressable rounded-lg"
                                  >
                                    <X size={15} strokeWidth={2} />
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border flex gap-3 flex-shrink-0" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
          <Button variant="secondary" onClick={() => goPrev(1)} className="w-14 h-14 p-0 flex-shrink-0">
            <ChevronLeft size={20} strokeWidth={1.75} />
          </Button>
          <Button fullWidth size="lg" onClick={() => goNext(3)}>
            Continue <ChevronRight size={18} strokeWidth={2} />
          </Button>
        </div>
      </div>
    );

    // STEP 3: Review
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto scroll-momentum px-5 py-6">
          <StepDots total={4} current={3} />
          <p className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold mb-1">Step 4 of 4</p>
          <h2 className="font-display text-fluid-2xl text-text-1 font-semibold mb-1">Review Plan</h2>
          <p className="text-fluid-sm text-text-2 mb-6">Confirm everything looks right.</p>

          <div className="space-y-2.5">
            {activeDays.map(day => {
              const idx = day.dayOfWeek;
              return (
                <div key={idx} className="bg-surface-2 rounded-card border border-border px-5 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-fluid-xs text-text-3">{DAY_FULL_NAMES[idx]}</span>
                      </div>
                      <p className="font-display text-fluid-lg text-text-1 font-semibold">{day.label || 'Training Day'}</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap justify-end max-w-[140px]">
                      {day.muscleGroups.slice(0, 2).map(m => <MuscleBadge key={m} muscle={m} />)}
                      {day.muscleGroups.length > 2 && (
                        <span className="text-fluid-xs text-text-3">+{day.muscleGroups.length - 2}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-fluid-xs text-text-3">
                    Week A: {day.variationA.length} exercises &nbsp;&middot;&nbsp;
                    Week B: {day.variationB.length} exercises
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border flex gap-3 flex-shrink-0" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
          <Button variant="secondary" onClick={() => goPrev(2)} className="w-14 h-14 p-0 flex-shrink-0">
            <ChevronLeft size={20} strokeWidth={1.75} />
          </Button>
          <Button fullWidth size="lg" onClick={handleFinish} disabled={activeDays.length === 0}>
            <Check size={18} strokeWidth={2.5} /> Save Plan
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={wrapperClass}
      style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {stepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
