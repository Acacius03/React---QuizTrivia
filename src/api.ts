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

function mapper(data: any): QuizData {
	return {
		type: data.type || "",
		difficulty: data.difficulty || "",
		category: data.category || "",
		question: data.question || "",
		correct_answer: data.correct_answer || "",
		incorrect_answers: data.incorrect_answers || [],
	};
}

export async function getQuizzes(urlParam: {
	category: string;
	difficulty: string;
	type: string;
}): Promise<QuizData[]> {
	const result = await fetch(
		`https://opentdb.com/api.php?amount=30${urlParam.category}${urlParam.difficulty}${urlParam.type}`,
	);

	if (!result.ok) return [];
	const json = await result.json();

	const results = json.results;

	if (results && Array.isArray(results)) return results.map(mapper);

	return [];
}
