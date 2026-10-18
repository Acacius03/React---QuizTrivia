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
  function handleAnswer(answer: string | null = null) {
    setIsPaused(true);
    if (quizzes[quizNumber].correct_answer === answer) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
    }
    setTimeout(() => {
      setIsPaused(false);
      setQuizNumber((prev) => prev + 1);
    }, 1000);
  }
  function fail() {
    handleAnswer();
  }

  return (
    <div className="px-4">
      <Timer
        key={quizNumber}
        initialTimeMs={15000}
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
      <div className="mt-2 rounded-xl bg-blue-800 p-8">
        {quizzes[quizNumber] ? (
          <QuizItem
            key={quizNumber}
            quiz={quizzes[quizNumber]}
            onAnswer={handleAnswer}
          />
        ) : (
          <div>No More Quiz</div>
        )}
      </div>
    </div>
  );
}
