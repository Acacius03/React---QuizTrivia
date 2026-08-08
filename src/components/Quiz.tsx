import type { QuizData } from "../api";

interface Props {
  quiz: QuizData;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
}

function Quiz({ quiz, onCorrectAnswer, onIncorrectAnswer }: Props) {
  const handleAnswer = (answer: string) => {
    if (answer === quiz.correct_answer) {
      onCorrectAnswer();
    } else {
      onIncorrectAnswer();
    }
  };

  const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  return (
    <div className="p-8 flex-grow bg-blue-800 rounded-xl" id="quiz">
      <h2 id="quiz-question" className="text-2xl font-bold text-center">
        {quiz.question}
      </h2>
      <ul id="quiz-options" className="space-y-3 p-2 mt-4">
        {shuffleArray([quiz.correct_answer, ...quiz.incorrect_answers]).map(
          (option, index) => (
            <li
              key={index}
              className="bg-blue-950 text-neutral-300 text-xl rounded-lg overflow-hidden"
            >
              <button
                className="options block w-full h-full p-2"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

export default Quiz;
