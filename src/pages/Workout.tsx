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
  const { activeSession, currentExerciseIndex, startTime, startSession, completeSet, removeSet, nextExercise, prevExercise, finishSession } = useSessionStore();

  const [showInstructions, setShowInstructions] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);

  const day = plan?.days.find(d => d.id === dayId);
  const currentWeek = week as 'A' | 'B';
  const exercises: WorkoutExercise[] = day?.variations[currentWeek]?.exercises.sort((a, b) => a.order - b.order) ?? [];

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

  const handleSetComplete = (set: Parameters<typeof completeSet>[1]) => {
    completeSet(currentEx.id, set);
    if (completedSetsForCurrent.length + 1 >= currentWE.sets) {
      setTimerSeconds(currentWE.restSeconds);
      setShowTimer(true);
    }
  };

  const handleFinish = async () => {
    const session = finishSession();
    if (session) {
      await saveSession(session);
    }
    setFinished(true);
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-4">
          <Trophy size={36} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Workout Complete!</h2>
        <p className="text-text-secondary mb-2">{day.label} · Week {currentWeek}</p>
        <p className="font-mono text-3xl font-bold text-accent mb-8">{formatDuration(elapsed)}</p>
        <div className="w-full space-y-3">
          <Button fullWidth size="lg" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button fullWidth variant="ghost" onClick={() => navigate('/history')}>
            View History
          </Button>
        </div>
      </div>
    );
  }

  const isLast = currentExerciseIndex === exercises.length - 1;

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-lg mx-auto">
      {/* Top Bar */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-text-secondary">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1">
          <p className="text-text-secondary text-xs">{day.label} · Week {currentWeek}</p>
          <p className="text-text-primary text-sm font-semibold font-mono">{formatDuration(elapsed)}</p>
        </div>
        <span className="text-text-secondary text-sm font-mono">{currentExerciseIndex + 1}/{exercises.length}</span>
      </div>

      {/* Progress Bar */}
      <div className="px-4 mb-4">
        <div className="flex gap-1">
          {exercises.map((we, idx) => {
            const ex = exerciseDb.find(e => e.id === we.exerciseId);
            const sets = activeSession?.completedExercises[ex?.id ?? ''] ?? [];
            const done = sets.length >= we.sets;
            return (
              <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all ${done ? 'bg-success' : idx === currentExerciseIndex ? 'bg-primary' : 'bg-slate-700'}`} />
            );
          })}
        </div>
      </div>

      {/* Exercise Content */}
      <div className="flex-1 px-4 space-y-4 overflow-auto pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
          >
            {/* Exercise Header */}
            <div className="bg-surface-2 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="font-mono font-bold text-2xl text-text-secondary">{currentExerciseIndex + 1}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-text-primary leading-tight">{currentEx.name}</h2>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <MuscleBadge muscle={currentEx.primaryMuscle} />
                    <DifficultyBadge difficulty={currentEx.difficulty} />
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-slate-700 text-text-secondary">{currentEx.equipment}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="font-mono font-bold text-text-primary text-2xl">{currentWE.sets}</p>
                  <p className="text-text-secondary text-xs">sets</p>
                </div>
                <div className="text-center">
                  <p className="font-mono font-bold text-text-primary text-2xl">{currentWE.reps}</p>
                  <p className="text-text-secondary text-xs">reps</p>
                </div>
                <div className="text-center">
                  <p className="font-mono font-bold text-text-primary text-2xl">{currentWE.restSeconds}s</p>
                  <p className="text-text-secondary text-xs">rest</p>
                </div>
              </div>
            </div>

            {/* Instructions Toggle */}
            <button
              onClick={() => setShowInstructions(s => !s)}
              className="w-full flex items-center justify-between bg-surface-2 rounded-2xl p-4"
            >
              <span className="font-semibold text-text-primary text-sm">Instructions</span>
              {showInstructions ? <ChevronUp size={18} className="text-text-secondary" /> : <ChevronDown size={18} className="text-text-secondary" />}
            </button>

            <AnimatePresence>
              {showInstructions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-surface-2 rounded-2xl p-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Steps</h4>
                      <ol className="space-y-2">
                        {currentEx.instructions.map((step, i) => (
                          <li key={i} className="flex gap-2 text-sm text-text-primary">
                            <span className="font-mono text-text-secondary flex-shrink-0 w-5">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    {currentEx.tips.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Tips</h4>
                        <ul className="space-y-1">
                          {currentEx.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-text-secondary flex gap-2">
                              <span className="text-accent flex-shrink-0">•</span>{tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Set Tracker */}
            <div className="bg-surface-2 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text-primary">Track Sets</h3>
                {allSetsComplete && (
                  <span className="flex items-center gap-1 text-xs text-success">
                    <Check size={14} /> All sets done
                  </span>
                )}
              </div>
              <SetTracker
                totalSets={currentWE.sets}
                completedSets={completedSetsForCurrent}
                onCompleteSet={handleSetComplete}
                onRemoveSet={(sn) => removeSet(currentEx.id, sn)}
              />
            </div>

            {/* Rest Timer */}
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

      {/* Bottom Navigation */}
      <div className="px-4 pb-6 pt-2 flex gap-3 border-t border-slate-800">
        <Button
          variant="secondary"
          onClick={prevExercise}
          disabled={currentExerciseIndex === 0}
        >
          <ChevronLeft size={20} />
        </Button>

        {isLast ? (
          <Button fullWidth size="lg" onClick={handleFinish} className="bg-success hover:bg-green-700">
            <Trophy size={20} /> Finish
          </Button>
        ) : (
          <Button fullWidth size="lg" onClick={nextExercise}>
            Next <ChevronRight size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}
