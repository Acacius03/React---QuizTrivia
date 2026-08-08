import { useEffect, useState } from "react";
import Quiz from "./components/Quiz.tsx";
import Timer from "./components/Timer";
import {
  getQuizzes,
  QUIZ_CATEGORY,
  QUIZ_DIFFICULTY,
  QUIZ_TYPE,
  type QuizData,
} from "./api";

function App() {
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);

  const success = () => {
    setQuizNumber((prev) => prev + 1);
    setCorrectCount((prev) => prev + 1);
  };
  const fail = () => {
    setQuizNumber((prev) => prev + 1);
    setIncorrectCount((prev) => prev + 1);
  };

  const [quizNumber, setQuizNumber] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const [quizCategoryIndex] = useState(0);
  const [quizDifficultyIndex] = useState(0);
  const [quizTypeIndex] = useState(0);

  const onClickEffect = (e: PointerEvent) => {
    let x = e.pageX;
    let y = e.pageY;
    let span = document.createElement("span");
    span.classList.add("click-ripple-effect");
    span.style.top = y + "px";
    span.style.left = x + "px";

    document.body.appendChild(span);
    setTimeout(() => span.remove(), 600);
  };

  useEffect(() => {
    getQuizzes({
      category: QUIZ_CATEGORY[quizCategoryIndex].urlParam,
      difficulty: QUIZ_DIFFICULTY[quizDifficultyIndex].urlParam,
      type: QUIZ_TYPE[quizTypeIndex].urlParam,
    }).then((res) => {
      if (res.length) {
        setQuizzes(res);
      }
    });

    document.body.addEventListener("click", onClickEffect);
    return () => {
      document.body.removeEventListener("click", onClickEffect);
    };
  }, []);

  return (
    <>
      <h1>
        Trivial <span>XD</span>
      </h1>
      <Timer
        initialTime={15}
        isRunning={true}
        onComplete={() => {
          console.log("finish");
          fail();
        }}
      />
      <div className="flex justify-between p-2 text-2xl">
        <span>
          Question
          <span id="quiz-number">{quizNumber + 1}</span>
        </span>
        <span>
          <span id="success" className="text-green-400">
            {correctCount}
          </span>
          /
          <span id="fail" className="text-red-400">
            {incorrectCount}
          </span>
        </span>
      </div>
      {quizzes[quizNumber] ? (
        <Quiz
          quiz={quizzes[quizNumber]}
          onCorrectAnswer={() => {
            console.log("Correct!!");
            success();
          }}
          onIncorrectAnswer={() => {
            console.log("Incorrect!!");
            fail();
          }}
        />
      ) : (
        <div>No Quiz</div>
      )}
    </>
  );
}

export default App;
