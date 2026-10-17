import type { QuizData } from "../api";
import { decode } from "he";

interface Props {
  quiz: QuizData;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
}

const shuffleArray = (array: string[]): string[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export default function QuizItem({
  quiz,
  onCorrectAnswer,
  onIncorrectAnswer,
}: Props) {
  const handleAnswer = (answer: string) => {
    if (answer === quiz.correct_answer) {
      onCorrectAnswer();
    } else {
      onIncorrectAnswer();
    }
  };

  return (
    <div className="grow rounded-xl bg-blue-800 p-8" id="quiz">
      <h2 id="quiz-question" className="text-center text-2xl font-bold">
        {decode(quiz.question)}
      </h2>
      <ul id="quiz-options" className="mt-4 space-y-3 p-2">
        {shuffleArray([quiz.correct_answer, ...quiz.incorrect_answers]).map(
          (option, index) => (
            <li
              key={index}
              className="overflow-hidden rounded-lg bg-blue-950 text-xl text-neutral-300"
            >
              <button
                className="options block h-full w-full p-2"
                onClick={() => handleAnswer(option)}
              >
                {decode(option)}
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
