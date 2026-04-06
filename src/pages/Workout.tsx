import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Check, Trophy } from 'lucide-react';
import { usePlanStore } from '../stores/planStore';
import { useSessionStore } from '../stores/sessionStore';
import { exercises as exerciseDb } from '../data/exercises';
import { MuscleBadge, DifficultyBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SetTracker } from '../components/workout/SetTracker';
import { RestTimer } from '../components/workout/RestTimer';
import { saveSession } from '../db';
import { formatDuration } from '../utils';
import type { WorkoutExercise } from '../types';

export function Workout() {
  const { dayId, week } = useParams<{ dayId: string; week: 'A' | 'B' }>();
  const navigate = useNavigate();
  const { plan } = usePlanStore();
  const {
    activeSession, currentExerciseIndex, startTime,
    startSession, completeSet, removeSet, nextExercise, prevExercise, finishSession,
  } = useSessionStore();

  const [showInstructions, setShowInstructions] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const day = plan?.days.find(d => d.id === dayId);
  const currentWeek = week as 'A' | 'B';
  const exercises: WorkoutExercise[] = day?.variations[currentWeek]?.exercises.sort(
    (a, b) => a.order - b.order
  ) ?? [];

  useEffect(() => {
    if (!activeSession || activeSession.dayId !== dayId) {
      startSession(dayId!, currentWeek);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime) setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (!day || exercises.length === 0) return null;

  const currentWE = exercises[currentExerciseIndex];
  const currentEx = currentWE ? exerciseDb.find(e => e.id === currentWE.exerciseId) : null;
  if (!currentEx || !currentWE) return null;

  const completedSetsForCurrent = activeSession?.completedExercises[currentEx.id] ?? [];
  const allSetsComplete = completedSetsForCurrent.length >= currentWE.sets;
  const isLast = currentExerciseIndex === exercises.length - 1;

  const handleSetComplete = (set: Parameters<typeof completeSet>[1]) => {
    completeSet(currentEx.id, set);
    if (completedSetsForCurrent.length + 1 >= currentWE.sets) {
      setTimerSeconds(currentWE.restSeconds);
      setShowTimer(true);
    }
  };

  const handleNext = () => {
    setDirection(1);
    setShowInstructions(false);
    nextExercise();
  };

  const handlePrev = () => {
    setDirection(-1);
    setShowInstructions(false);
    prevExercise();
  };

  const handleFinish = async () => {
    // Haptic: workout complete
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 200]);
    const session = finishSession();
    if (session) await saveSession(session);
    setFinished(true);
  };

  // ── Completion screen ──────────────────────────────────────────────
  if (finished) {
    const exercisesCompleted = activeSession
      ? Object.keys(activeSession.completedExercises).length
      : exercises.length;
    const totalSets = activeSession
      ? Object.values(activeSession.completedExercises).reduce((a, s) => a + s.length, 0)
      : 0;

    return (
      <div
        className="min-h-screen min-h-[100dvh] bg-bg flex flex-col items-center justify-center px-5 max-w-lg mx-auto text-center"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Trophy ring */}
          <div className="w-24 h-24 rounded-full border-2 border-accent/30 bg-accent/8 flex items-center justify-center mx-auto mb-6 shadow-glow-accent">
            <Trophy size={38} className="text-accent" strokeWidth={1.5} />
          </div>

          <h2 className="font-display text-fluid-display text-text-1 font-semibold mb-2">
            Workout Complete
          </h2>
          <p className="text-fluid-sm text-text-2 mb-8">
            {day.label} &nbsp;&middot;&nbsp; Week {currentWeek}
          </p>

          {/* Stats */}
          <div className="flex gap-6 justify-center mb-10">
            <div>
              <p className="font-display text-fluid-2xl text-accent font-semibold leading-none">
                {formatDuration(elapsed)}
              </p>
              <p className="text-fluid-xs text-text-3 uppercase tracking-widest mt-1">Duration</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="font-display text-fluid-2xl text-text-1 font-semibold leading-none">
                {exercisesCompleted}
              </p>
              <p className="text-fluid-xs text-text-3 uppercase tracking-widest mt-1">Exercises</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="font-display text-fluid-2xl text-text-1 font-semibold leading-none">
                {totalSets}
              </p>
              <p className="text-fluid-xs text-text-3 uppercase tracking-widest mt-1">Sets</p>
            </div>
          </div>

          <div className="w-full space-y-3 max-w-sm mx-auto">
            <Button fullWidth size="lg" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button fullWidth variant="ghost" onClick={() => navigate('/history')}>
              View History
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Active workout ─────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen min-h-[100dvh] bg-bg flex flex-col max-w-lg mx-auto"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 -ml-2 flex items-center justify-center text-text-2 pressable rounded-xl hover:text-text-1"
          aria-label="Back"
        >
          <ChevronLeft size={22} strokeWidth={1.75} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-fluid-xs text-text-3 truncate uppercase tracking-wider">
            {day.label} &nbsp;&middot;&nbsp; Week {currentWeek}
          </p>
          <p className="text-fluid-sm text-text-1 font-semibold font-display tabular-nums">
            {formatDuration(elapsed)}
          </p>
        </div>
        <span className="text-fluid-xs text-text-3 tabular-nums flex-shrink-0">
          {currentExerciseIndex + 1} / {exercises.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="px-5 mb-4 flex gap-1.5 flex-shrink-0">
        {exercises.map((we, idx) => {
          const ex = exerciseDb.find(e => e.id === we.exerciseId);
          const sets = activeSession?.completedExercises[ex?.id ?? ''] ?? [];
          const done = sets.length >= we.sets;
          const isCurrent = idx === currentExerciseIndex;
          return (
            <div
              key={idx}
              className={`h-1 rounded-pill transition-all duration-300 ${
                done
                  ? 'bg-success'
                  : isCurrent
                  ? 'bg-accent'
                  : 'bg-surface-3'
              } ${isCurrent ? 'flex-[2]' : 'flex-1'}`}
            />
          );
        })}
      </div>

      {/* Scrollable exercise content */}
      <div className="flex-1 overflow-y-auto scroll-momentum px-5 space-y-3 pb-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: direction * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -32 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            {/* Exercise header card */}
            <div className="bg-surface-2 rounded-card border border-border px-5 py-5">
              <div className="flex items-start gap-4 mb-4">
                {/* Number badge */}
                <div className="w-12 h-12 rounded-card bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-fluid-lg font-semibold text-text-2">
                    {currentExerciseIndex + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-fluid-xl font-semibold text-text-1 leading-tight mb-2">
                    {currentEx.name}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    <MuscleBadge muscle={currentEx.primaryMuscle} />
                    <DifficultyBadge difficulty={currentEx.difficulty} />
                    <span className="text-fluid-xs text-text-3 capitalize self-center">
                      {currentEx.equipment.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sets / Reps / Rest stats */}
              <div className="flex gap-6 pt-4 border-t border-border">
                <div>
                  <p className="font-display text-fluid-2xl font-semibold text-text-1 leading-none">
                    {currentWE.sets}
                  </p>
                  <p className="text-fluid-xs text-text-3 uppercase tracking-widest mt-1">sets</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="font-display text-fluid-2xl font-semibold text-text-1 leading-none">
                    {currentWE.reps}
                  </p>
                  <p className="text-fluid-xs text-text-3 uppercase tracking-widest mt-1">reps</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="font-display text-fluid-2xl font-semibold text-text-1 leading-none">
                    {currentWE.restSeconds}s
                  </p>
                  <p className="text-fluid-xs text-text-3 uppercase tracking-widest mt-1">rest</p>
                </div>
                {allSetsComplete && (
                  <div className="ml-auto self-center flex items-center gap-1.5 text-success">
                    <Check size={14} strokeWidth={2.5} />
                    <span className="text-fluid-xs font-semibold">Done</span>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions accordion */}
            <button
              onClick={() => setShowInstructions(s => !s)}
              className="w-full flex items-center justify-between px-5 py-4 bg-surface-2 rounded-card border border-border text-left pressable"
            >
              <span className="text-fluid-sm font-semibold text-text-1">Instructions</span>
              {showInstructions
                ? <ChevronUp size={17} strokeWidth={1.75} className="text-text-3 flex-shrink-0" />
                : <ChevronDown size={17} strokeWidth={1.75} className="text-text-3 flex-shrink-0" />
              }
            </button>

            <AnimatePresence>
              {showInstructions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="bg-surface-2 rounded-card border border-border px-5 py-4 space-y-4">
                    <div>
                      <p className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold mb-3">
                        Steps
                      </p>
                      <ol className="space-y-2.5">
                        {currentEx.instructions.map((step, i) => (
                          <li key={i} className="flex gap-3 text-fluid-sm text-text-1">
                            <span className="text-text-3 flex-shrink-0 tabular-nums w-4">{i + 1}.</span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    {currentEx.tips.length > 0 && (
                      <div>
                        <p className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold mb-3">
                          Tips
                        </p>
                        <ul className="space-y-2">
                          {currentEx.tips.map((tip, i) => (
                            <li key={i} className="flex gap-2.5 text-fluid-sm text-text-2 leading-relaxed">
                              <span className="text-accent flex-shrink-0 mt-0.5">&middot;</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Set tracker */}
            <div className="bg-surface-2 rounded-card border border-border px-5 py-5">
              <p className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold mb-4">
                Log Sets
              </p>
              <SetTracker
                totalSets={currentWE.sets}
                completedSets={completedSetsForCurrent}
                onCompleteSet={handleSetComplete}
                onRemoveSet={sn => removeSet(currentEx.id, sn)}
              />
            </div>

            {/* Rest timer */}
            {showTimer && (
              <RestTimer
                seconds={timerSeconds}
                onComplete={() => setShowTimer(false)}
                onDismiss={() => setShowTimer(false)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div
        className="flex gap-3 px-5 pt-3 border-t border-border flex-shrink-0"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)' }}
      >
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentExerciseIndex === 0}
          className="w-14 h-14 p-0 flex-shrink-0"
        >
          <ChevronLeft size={20} strokeWidth={1.75} />
        </Button>

        {isLast ? (
          <Button
            fullWidth
            size="lg"
            onClick={handleFinish}
            className="bg-success/90 hover:bg-success text-bg"
          >
            <Trophy size={18} strokeWidth={2} />
            Finish Workout
          </Button>
        ) : (
          <Button fullWidth size="lg" onClick={handleNext}>
            Next
            <ChevronRight size={18} strokeWidth={2} />
          </Button>
        )}
      </div>
    </div>
  );
}
