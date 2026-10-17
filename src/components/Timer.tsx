import "./Timer.css";
import { useEffect, useRef, useState } from "react";

type Props = {
  initialTime: number;
  isRunning: boolean;
  onComplete: () => void;
};

function Timer({ initialTime, isRunning, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const pause = () => {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const countDown = () => {
    setTimeLeft((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      pause();

      if (isRunning && timeLeft <= 0 && !completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current();
      }

      return pause;
    }

    start();

    function start() {
      if (intervalRef.current !== null) return;
      intervalRef.current = window.setInterval(countDown, 1000);
    }

    return pause;
  }, [isRunning, timeLeft]);

  return (
    <div className="progress-bar">
      <span id="timer-time">
        00:
        <span id="timer-time-seconds">
          {timeLeft.toString().padStart(2, "0")}
        </span>
      </span>
      <div
        id="timer"
        className="progress"
        style={{
          width: `${(timeLeft / initialTime) * 100}%`,
        }}
      ></div>
      <span className="clock-icon">
        <i className="fa-regular fa-clock"></i>
      </span>
    </div>
  );
}
export default Timer;
