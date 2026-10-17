import { useState } from "react";
import type { QuizData } from "../api";
import { decode } from "he";

interface Props {
  quiz: QuizData;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
}

function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export default function QuizItem({
  quiz,
  onCorrectAnswer,
  onIncorrectAnswer,
}: Props) {
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [options] = useState(() =>
    shuffleArray([quiz.correct_answer, ...quiz.incorrect_answers]),
  );
  function handleAnswer(answer: string) {
    setShowCorrectAnswer(true);
    return answer === quiz.correct_answer
      ? onCorrectAnswer()
      : onIncorrectAnswer();
  }

  return (
    <div className="grow rounded-xl bg-blue-800 p-8" id="quiz">
      <h2 id="quiz-question" className="text-center text-2xl font-bold">
        {decode(quiz.question)}
      </h2>
      <ul id="quiz-options" className="mt-4 space-y-3 p-2">
        {options.map((option) => (
          <li key={option}>
            <QuizOption
              option={option}
              isCorrect={option === quiz.correct_answer}
              showCorrect={showCorrectAnswer}
              handleClick={() => handleAnswer(option)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuizOption({
  option,
  isCorrect,
  showCorrect,
  handleClick,
}: {
  option: string;
  isCorrect: boolean;
  showCorrect: boolean;
  handleClick: () => void;
}) {
  const [isClicked, setIsClicked] = useState(false);
  function onClick() {
    if (isClicked) return;
    setIsClicked(true);
    handleClick();
  }

  const highlightClassName = showCorrect
    ? isCorrect
      ? "bg-green-500 text-black pointer-events-none"
      : isClicked
        ? "bg-red-500 text-neutral-300 pointer-events-none"
        : "bg-blue-950 text-neutral-300 pointer-events-none"
    : "bg-blue-950 text-neutral-300 hover:bg-amber-300 hover:text-black active:scale-99 active:bg-amber-400";

  return (
    <button
      onClick={onClick}
      className={
        "block w-full rounded-lg p-2 text-xl transition " + highlightClassName
      }
    >
      {decode(option)}
    </button>
  );
}
