import { Clock } from "lucide-react";
import "./Timer.css";
import { useEffect, useRef, useState } from "react";

type Props = {
  initialTimeMs: number;
  isRunning: boolean;
  onComplete: () => void;
};

function Timer({ initialTimeMs, isRunning, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(initialTimeMs);
  const [progress, setProgress] = useState(100);

  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const remainingRef = useRef(initialTimeMs);

  // useEffect(() => {
  //   onCompleteRef.current = onComplete;
  // }, [onComplete]);

  useEffect(() => {
    if (!isRunning) return;

    let frameId = 0;
    let lastDisplayedSecond = Math.ceil(remainingRef.current / 1000);
    const endTime = performance.now() + remainingRef.current;

    function animate(now: number) {
      const remaining = Math.max(0, endTime - now);

      remainingRef.current = remaining;

      setProgress(initialTimeMs > 0 ? (remaining / initialTimeMs) * 100 : 0);

      const displayedSecond = Math.ceil(remaining / 1000);

      if (displayedSecond !== lastDisplayedSecond) {
        lastDisplayedSecond = displayedSecond;
        setTimeLeft(remaining);
      }

      if (remaining <= 0) {
        completedRef.current = true;
        setTimeLeft(0);
        setProgress(0);
        onCompleteRef.current();
        return;
      }

      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      remainingRef.current = Math.max(0, endTime - performance.now());
    };
  }, [isRunning, initialTimeMs]);

  const seconds = Math.ceil(timeLeft / 1000);

  return (
    <div className="relative flex h-12 w-full items-center overflow-hidden rounded-full bg-amber-400">
      <div
        className="timer-progress h-full bg-blue-500"
        style={{ width: `${progress}%` }}
      />

      <span className="absolute left-4 z-10 tabular-nums">
        00:{seconds.toString().padStart(2, "0")}
      </span>

      <span className="absolute right-4 z-10">
        <Clock />
      </span>
    </div>
  );
}

export default Timer;
