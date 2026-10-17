import { useCallback, useEffect, useState } from "react";
import {
  getQuizzes,
  QUIZ_CATEGORY,
  QUIZ_DIFFICULTY,
  QUIZ_TYPE,
  type QuizData,
} from "./api";
import Header from "./components/Header.tsx";
import Quiz from "./components/Quiz.tsx";
import Sidebar from "./components/Sidebar.tsx";

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const [quizzes, setQuizzes] = useState<QuizData[]>([]);

  const onClickEffect = (e: PointerEvent) => {
    const x = e.pageX;
    const y = e.pageY;
    const span = document.createElement("span");
    span.classList.add("click-ripple-effect");
    span.style.top = y + "px";
    span.style.left = x + "px";

    document.body.appendChild(span);
    setTimeout(() => span.remove(), 600);
  };

  const fetchQuizzes = useCallback(
    (categoryIndex: number, difficultyIndex: number, typeIndex: number) => {
      getQuizzes({
        category: QUIZ_CATEGORY[categoryIndex].urlParam,
        difficulty: QUIZ_DIFFICULTY[difficultyIndex].urlParam,
        type: QUIZ_TYPE[typeIndex].urlParam,
      }).then((res) => {
        if (res.length) setQuizzes(res);
      });
    },
    [],
  );

  useEffect(() => {
    fetchQuizzes(0, 0, 0);
    document.body.addEventListener("click", onClickEffect);
    return () => {
      document.body.removeEventListener("click", onClickEffect);
    };
  }, [fetchQuizzes]);

  return (
    <>
      <Header onToggleMenu={() => setIsSidebarExpanded((value) => !value)} />
      <Quiz quizzes={quizzes} />
      {isSidebarExpanded && (
        <Sidebar
          onApplyFilters={({ categoryIndex, difficultyIndex, typeIndex }) => {
            fetchQuizzes(categoryIndex, difficultyIndex, typeIndex);
          }}
          onClose={() => setIsSidebarExpanded(false)}
        />
      )}
    </>
  );
}

export default App;
