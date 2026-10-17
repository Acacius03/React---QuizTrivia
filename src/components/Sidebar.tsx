import { useState } from "react";
import { createPortal } from "react-dom";
import { QUIZ_CATEGORY, QUIZ_DIFFICULTY, QUIZ_TYPE } from "../api";

interface Filters {
  categoryIndex: number;
  difficultyIndex: number;
  typeIndex: number;
}

interface Props {
  className?: string;
  onApplyFilters: (filters: Filters) => void;
  onClose: () => void;
}

const EMPTY_FILTERS: Filters = {
  categoryIndex: 0,
  difficultyIndex: 0,
  typeIndex: 0,
};

export default function Sidebar({
  className = "",
  onApplyFilters,
  onClose,
}: Props) {
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS });

  const updateFilter = (key: keyof Filters, value: number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  };

  const resetFilters = () => {
    setFilters({ ...EMPTY_FILTERS });
  };

  const applyFilters = () => {
    onApplyFilters({ ...filters });
    onClose();
  };

  const renderOptions = (key: keyof Filters, options: { text: string }[]) => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((option, index) => {
        const selected = filters[key] === index;

        return (
          <button
            key={option.text}
            type="button"
            aria-pressed={selected}
            onClick={() => updateFilter(key, index)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              selected
                ? "border-sky-400 bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/30"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:bg-white/10"
            }`}
          >
            {selected && <span className="mr-1.5">✓</span>}
            {option.text}
          </button>
        );
      })}
    </div>
  );

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-99999 flex justify-end bg-black/60 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-filter-title"
        className={`flex h-full w-full max-w-md flex-col border-l border-white/10 bg-slate-950 text-white shadow-2xl ${className}`}
      >
        {/* Header */}
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

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          )}
        </header>

        {/* Filter options */}
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-7">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">Category</h3>
              <span className="text-xs text-slate-500">
                {QUIZ_CATEGORY[filters.categoryIndex].text || "Any category"}
              </span>
            </div>
            {renderOptions("categoryIndex", QUIZ_CATEGORY)}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">Difficulty</h3>
              <span className="text-xs text-slate-500">
                {QUIZ_DIFFICULTY[filters.difficultyIndex].text || "Any level"}
              </span>
            </div>
            {renderOptions("difficultyIndex", QUIZ_DIFFICULTY)}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">Question type</h3>
              <span className="text-xs text-slate-500">
                {QUIZ_TYPE[filters.typeIndex].text || "Any type"}
              </span>
            </div>
            {renderOptions("typeIndex", QUIZ_TYPE)}
          </section>
        </div>

        {/* Sticky footer */}
        <footer className="border-t border-white/10 bg-slate-950 px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {Object.values(filters).filter(Boolean).length} filters selected
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="font-medium text-slate-300 underline-offset-4 transition hover:text-white hover:underline"
            >
              Reset all
            </button>
          </div>

          <button
            type="button"
            onClick={applyFilters}
            className="w-full rounded-xl bg-sky-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 active:scale-[0.99]"
          >
            Apply filters
          </button>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
