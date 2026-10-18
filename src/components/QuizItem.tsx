import { useState } from "react";
import type { QuizData } from "../api";
import { decode } from "he";
import { shuffleArray } from "../lib/utils/array";

interface Props {
  quiz: QuizData;
  onAnswer: (answer: string) => void;
}

export default function QuizItem({ quiz, onAnswer }: Props) {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [options] = useState(() =>
    shuffleArray([quiz.correct_answer, ...quiz.incorrect_answers]),
  );
  function handleAnswer(answer: string) {
    setShowCorrectAnswer(true);
    return onAnswer(answer);
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-bold">
        {decode(quiz.question)}
      </h2>
      <ul className="mt-4 space-y-3 p-2">
        {options.map((option) => (
          <QuizOption
            key={option}
            option={option}
            isCorrect={option === quiz.correct_answer}
            showCorrect={showCorrectAnswer}
            onClick={() => handleAnswer(option)}
          />
        ))}
      </ul>
    </div>
  );
}

function QuizOption({
  option,
  isCorrect,
  showCorrect,
  onClick,
}: {
  option: string;
  isCorrect: boolean;
  showCorrect: boolean;
  onClick: () => void;
}) {
  const [isClicked, setIsClicked] = useState(false);
  function handleClick() {
    if (isClicked) return;
    setIsClicked(true);
    onClick();
  }

  const highlightClassName = showCorrect
    ? isCorrect
      ? "bg-green-500 text-black pointer-events-none"
      : isClicked
        ? "bg-red-500 text-neutral-300 pointer-events-none"
        : "bg-blue-950 text-neutral-300 pointer-events-none"
    : "bg-blue-950 text-neutral-300 hover:bg-amber-300 hover:text-black active:scale-99 active:bg-amber-400";

  return (
    <li>
      <button
        onClick={handleClick}
        className={
          "block w-full rounded-lg p-2 text-xl transition " + highlightClassName
        }
      >
        {decode(option)}
      </button>
    </li>
  );
}
