import { useState } from "react";
import type { QuizData } from "../api";
import CorrectIncorrectCounter from "./CorrectIncorrectCounter";
import QuizItem from "./QuizItem";
import QuizNumber from "./QuizNumber";
import Timer from "./Timer";

interface Props {
  className?: string;
  quizzes: QuizData[];
}
export default function Quiz({ quizzes }: Props) {
  const [quizNumber, setQuizNumber] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  function success() {
    setIsPaused(true);
    setTimeout(() => {
      setIsPaused(false);
      setQuizNumber((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
    }, 1000);
  }
  function fail() {
    setIsPaused(true);
    setTimeout(() => {
      setIsPaused(false);
      setQuizNumber((prev) => prev + 1);
      setIncorrectCount((prev) => prev + 1);
    }, 1000);
  }

  return (
    <div>
      <Timer
        key={quizNumber}
        initialTime={15}
        isRunning={!isPaused && Boolean(quizzes[quizNumber])}
        onComplete={fail}
      />

      <div className="flex justify-between p-2 text-2xl">
        <QuizNumber quizNumber={quizNumber} />
        <CorrectIncorrectCounter
          correctCount={correctCount}
          incorrectCount={incorrectCount}
        />
      </div>
      <div className="mt-2 px-4">
        {quizzes[quizNumber] ? (
          <QuizItem
            key={quizNumber}
            quiz={quizzes[quizNumber]}
            onCorrectAnswer={success}
            onIncorrectAnswer={fail}
          />
        ) : (
          <div>No Quiz</div>
        )}
      </div>
    </div>
  );
}
