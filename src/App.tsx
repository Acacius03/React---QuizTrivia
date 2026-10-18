import { useCallback, useEffect, useRef, useState } from "react";
import {
  getQuizzes,
  QUIZ_CATEGORY,
  QUIZ_DIFFICULTY,
  QUIZ_TYPE,
  type QuizData,
} from "./api";
import Header from "./components/Header.tsx";
import Quiz from "./components/Quiz.tsx";
import { type SidebarHandle, Sidebar } from "./components/Sidebar.tsx";
import QuizFilters from "./components/QuizFilters.tsx";
import { XIcon } from "lucide-react";

function App() {
  const sidebarRef = useRef<SidebarHandle>(null);
  const requestIdRef = useRef(0);

  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = useCallback(
    async (
      categoryIndex: number,
      difficultyIndex: number,
      typeIndex: number,
    ) => {
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError(null);

      try {
        const result = await getQuizzes({
          category: QUIZ_CATEGORY[categoryIndex].urlParam,
          difficulty: QUIZ_DIFFICULTY[difficultyIndex].urlParam,
          type: QUIZ_TYPE[typeIndex].urlParam,
        });

        // Ignore results from an older request.
        if (requestId !== requestIdRef.current) return;

        setQuizzes(result);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;

        setQuizzes([]);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load quizzes. Please try again.",
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    let ignore = false;

    const loadInitialQuizzes = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getQuizzes({
          category: QUIZ_CATEGORY[0].urlParam,
          difficulty: QUIZ_DIFFICULTY[0].urlParam,
          type: QUIZ_TYPE[0].urlParam,
        });

        if (!ignore) {
          setQuizzes(result);
        }
      } catch (err) {
        if (!ignore) {
          setQuizzes([]);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load quizzes. Please try again.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadInitialQuizzes();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="relative mx-auto grid h-full max-w-2xl grid-cols-1 grid-rows-1 *:col-span-full *:row-span-full">
      <img
        src="/confetti.png"
        alt=""
        aria-hidden="true"
        className="z-0 mt-auto w-full rotate-180 object-cover"
      />

      <div className="relative z-10">
        <Header onToggleMenu={() => sidebarRef.current?.open()} />

        {loading && (
          <p role="status" className="px-4 py-3 text-center">
            Loading quizzes...
          </p>
        )}

        {error && (
          <div role="alert" className="px-4 py-3 text-center">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void fetchQuizzes(0, 0, 0)}
              className="mt-2 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && quizzes.length === 0 && (
          <p className="px-4 py-3 text-center">
            No quizzes found. Try changing your filters.
          </p>
        )}

        {!error && <Quiz quizzes={quizzes} />}

        <Sidebar ref={sidebarRef}>
          <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-sky-400 uppercase">
                Customize your quiz
              </p>
              <h2
                id="quiz-filter-title"
                className="text-2xl font-bold tracking-tight"
              >
                Filters
              </h2>
            </div>

            <button
              type="button"
              onClick={() => sidebarRef.current?.close()}
              aria-label="Close filters"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <XIcon aria-hidden="true" />
            </button>
          </header>

          <QuizFilters
            onApplyFilters={({ categoryIndex, difficultyIndex, typeIndex }) => {
              void fetchQuizzes(categoryIndex, difficultyIndex, typeIndex);
              sidebarRef.current?.close();
            }}
          />
        </Sidebar>
      </div>
    </div>
  );
}

export default App;
