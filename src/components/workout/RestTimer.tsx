import { useEffect, useRef, useState } from 'react';
import { Timer, X } from 'lucide-react';
import { formatDuration } from '../../utils';

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
          // vibrate if supported
          if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
          onComplete?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const progress = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-warning">
          <Timer size={18} />
          <span className="font-semibold text-sm">Rest Timer</span>
        </div>
        <button onClick={onDismiss} className="text-text-secondary hover:text-text-primary">
          <X size={18} />
        </button>
      </div>
      <div className="text-center mb-3">
        <span className="font-mono font-bold text-4xl text-warning">{formatDuration(remaining)}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-warning rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
