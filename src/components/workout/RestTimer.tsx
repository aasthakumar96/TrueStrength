import { useEffect, useRef, useState } from 'react';

interface RestTimerProps {
  seconds: number;
  onComplete?: () => void;
  onDismiss?: () => void;
}

export function RestTimer({ seconds, onComplete, onDismiss }: RestTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          // Haptic: rest complete pattern
          if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
          onComplete?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // SVG circular progress ring
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  // Starts full, drains to empty
  const strokeDashoffset = circumference * (1 - remaining / seconds);

  return (
    <div className="flex flex-col items-center py-6 px-4 bg-surface-2 rounded-card border border-border">
      <p className="text-fluid-xs text-text-3 uppercase tracking-widest font-semibold mb-5">
        Rest
      </p>

      {/* Circular ring */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 110 110">
          {/* Track */}
          <circle
            cx="55" cy="55" r={radius}
            fill="none"
            stroke="var(--border-light)"
            strokeWidth="3"
          />
          {/* Progress — gold arc, drains as time passes */}
          <circle
            cx="55" cy="55" r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.95s linear' }}
          />
        </svg>
        {/* Time label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-fluid-2xl font-semibold text-text-1 leading-none">
            {remaining}
          </span>
          <span className="text-fluid-xs text-text-3 mt-1 uppercase tracking-widest">sec</span>
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={onDismiss}
        className="mt-5 text-fluid-sm text-text-2 hover:text-text-1 pressable py-2 px-5 rounded-pill border border-border hover:border-border-light transition-colors"
      >
        Skip rest
      </button>
    </div>
  );
}
