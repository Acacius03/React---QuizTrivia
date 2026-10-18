import { parseString, parseStringArray } from "./lib/utils/types";

export const API_URL = "https://opentdb.com/api.php?amount=30";

export const QUIZ_CATEGORY: ApiOption[] = [
  { text: "Random", urlParam: "" },
  { text: "General Knowledge", urlParam: "&category=9" },
  { text: "Books", urlParam: "&category=10" },
  { text: "Films", urlParam: "&category=11" },
  { text: "Music", urlParam: "&category=12" },
  { text: "Musicals & Theatre", urlParam: "&category=13" },
  { text: "Television", urlParam: "&category=14" },
  { text: "Video Games", urlParam: "&category=15" },
  { text: "Board Games", urlParam: "&category=16" },
  { text: "Science & Nature", urlParam: "&category=17" },
  { text: "Computers", urlParam: "&category=18" },
  { text: "Math", urlParam: "&category=19" },
  { text: "Mythology", urlParam: "&category=20" },
  { text: "Sports", urlParam: "&category=21" },
  { text: "Geography", urlParam: "&category=22" },
  { text: "History", urlParam: "&category=23" },
  { text: "Politics", urlParam: "&category=24" },
  { text: "Art", urlParam: "&category=25" },
  { text: "Celebrities", urlParam: "&category=26" },
  { text: "Animals", urlParam: "&category=27" },
  { text: "Cars", urlParam: "&category=28" },
  { text: "Comics", urlParam: "&category=29" },
  { text: "Anime & Manga", urlParam: "&category=31" },
  { text: "Cartoons & Animations", urlParam: "&category=32" },
] as const;

export const QUIZ_DIFFICULTY: ApiOption[] = [
  { text: "Random", urlParam: "" },
  { text: "Easy", urlParam: "&difficulty=easy" },
  { text: "Medium", urlParam: "&difficulty=medium" },
  { text: "Hard", urlParam: "&difficulty=hard" },
] as const;

export const QUIZ_TYPE: ApiOption[] = [
  { text: "Random", urlParam: "" },
  { text: "Multiple Choice", urlParam: "&type=multple" },
  { text: "True or False", urlParam: "&type=boolean" },
] as const;

export interface QuizData {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

function mapper(data: unknown): QuizData {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("Invalid quiz data");
  }

  const quiz = data as Record<string, unknown>;

  return {
    type: parseString(quiz.type),
    difficulty: parseString(quiz.difficulty),
    category: parseString(quiz.category),
    question: parseString(quiz.question),
    correct_answer: parseString(quiz.correct_answer),
    incorrect_answers: parseStringArray(quiz.incorrect_answers),
  };
}

interface GetQuizzesParam {
  category: string;
  difficulty: string;
  type: string;
}

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// ... keep your existing QUIZ_CATEGORY, QUIZ_DIFFICULTY,
// QUIZ_TYPE, QuizData, mapper, and GetQuizzesParam definitions.

interface QuizCache {
  data: unknown[];
  expiresAt: number;
}

export async function getQuizzes(
  urlParam: GetQuizzesParam,
): Promise<QuizData[]> {
  const url = `https://opentdb.com/api.php?amount=30${urlParam.category}${urlParam.difficulty}${urlParam.type}`;
  const cacheName = `cache-${url}`;

  // Read cache safely
  try {
    const cached = localStorage.getItem(cacheName);

    if (cached) {
      const parsed: QuizCache = JSON.parse(cached);

      if (
        Array.isArray(parsed.data) &&
        typeof parsed.expiresAt === "number" &&
        Date.now() < parsed.expiresAt
      ) {
        return parsed.data.map(mapper);
      }

      // Expired or invalid cache
      localStorage.removeItem(cacheName);
    }
  } catch {
    // Handle malformed JSON or unavailable localStorage
    try {
      localStorage.removeItem(cacheName);
    } catch {
      // Storage is unavailable; continue with the API request.
    }
  }

  // Fetch fresh data
  const result = await fetch(url);

  if (!result.ok) {
    throw new Error(`ERROR ${result.status} - ${result.statusText}`);
  }

  const json = await result.json();
  const parsed = json.results;

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid quiz data received from API.");
  }

  // Save cache with expiration timestamp
  const cache: QuizCache = {
    data: parsed,
    expiresAt: Date.now() + CACHE_TTL,
  };

  try {
    localStorage.setItem(cacheName, JSON.stringify(cache));
  } catch {
    // Storage may be full or disabled; quizzes still work.
  }

  return parsed.map(mapper);
}
