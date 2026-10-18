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
import {
  CircleAlert,
  ClipboardList,
  LoaderCircle,
  RefreshCw,
  XIcon,
} from "lucide-react";

function App() {
  const sidebarRef = useRef<SidebarHandle>(null);

  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = useCallback(
    async (
      categoryIndex: number,
      difficultyIndex: number,
      typeIndex: number,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const result = await getQuizzes({
          category: QUIZ_CATEGORY[categoryIndex].urlParam,
          difficulty: QUIZ_DIFFICULTY[difficultyIndex].urlParam,
          type: QUIZ_TYPE[typeIndex].urlParam,
        });

        setQuizzes(result);
      } catch (err) {
        console.error(err);
        setQuizzes([]);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load quizzes. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const init = () => {
      fetchQuizzes(0, 0, 0);
    };
    init();
  }, [fetchQuizzes]);

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

        {/* Loading State */}
        {loading && (
          <div
            role="status"
            aria-live="polite"
            className="mx-4 mb-4 flex items-center justify-center gap-3 rounded-2xl border border-sky-400/20 bg-sky-500/8 px-5 py-5 text-sm text-sky-300 shadow-sm"
          >
            <LoaderCircle
              size={22}
              className="shrink-0 animate-spin text-sky-400"
              aria-hidden="true"
            />

            <div>
              <p className="font-semibold">Loading quizzes</p>
              <p className="mt-0.5 text-xs text-sky-300/60">
                Getting your quizzes ready...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            role="alert"
            className="mx-4 mb-4 rounded-2xl border border-red-400/20 bg-red-500/6 p-6 text-center shadow-sm"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <CircleAlert
                size={24}
                className="text-red-400"
                aria-hidden="true"
              />
            </div>

            <h3 className="text-base font-semibold text-red-300">
              Something went wrong
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void fetchQuizzes(0, 0, 0)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-400 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-950 focus:outline-none active:scale-[0.98]"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && quizzes.length === 0 && (
          <div className="mx-4 mb-4 rounded-2xl border border-dashed border-gray-700 bg-gray-900/40 px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800/80 ring-1 ring-white/5">
              <ClipboardList
                size={32}
                strokeWidth={1.5}
                className="text-gray-400"
                aria-hidden="true"
              />
            </div>

            <h3 className="text-lg font-semibold tracking-tight text-gray-100">
              No quizzes found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
              We couldn't find any quizzes matching your current filters. Try
              adjusting them to discover more quizzes.
            </p>

            <p className="mt-4 text-xs text-gray-500">
              Tip: Broaden your filters to see more results.
            </p>
          </div>
        )}

        {!error && !loading && <Quiz quizzes={quizzes} />}

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
