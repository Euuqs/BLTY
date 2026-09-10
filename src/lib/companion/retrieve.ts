import type { CompanionIntent, CompanionSeason } from "./intent";

export interface SearchableStory {
  id: string;
  title: string;
  date: string;
  member: "A" | "B" | "both";
  era: string;
  arc?: string;
  tags: string[];
  moods: string[];
  summary: string;
  facts: string[];
  interpretation?: string;
  meaning?: string;
  html?: string;
}

export interface StorySearchResult<T extends SearchableStory = SearchableStory> {
  story: T;
  score: number;
  matchedTerms: string[];
}

const stopWords = new Set([
  "一个",
  "一下",
  "什么",
  "以前",
  "故事",
  "她们",
  "他们",
  "这个",
  "那个",
  "时候",
  "可以",
  "给我",
  "找个",
  "看看",
  "发生",
  "春天",
  "春季",
  "春日",
  "夏天",
  "夏季",
  "夏日",
  "秋天",
  "秋季",
  "秋日",
  "冬天",
  "冬季",
  "冬日",
  "柏欣妤",
  "朱怡欣",
  "小柏",
  "小朱",
  "两人",
  "两位",
  "双人",
  "柏里挑怡",
]);

const synonyms: Record<string, string[]> = {
  开心: ["高兴", "快乐", "甜"],
  想念: ["怀念", "回忆"],
  温暖: ["温柔", "暖心"],
  演出: ["舞台", "公演", "巡演"],
};

function normalize(value: string): string {
  return value.toLocaleLowerCase("zh-CN").replace(/<[^>]*>/g, " ");
}

function tokenize(message: string): string[] {
  const normalized = normalize(message);
  const terms = new Set<string>();
  const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });

  for (const segment of segmenter.segment(normalized)) {
    const term = segment.segment.trim();
    if (segment.isWordLike && term.length >= 2 && !stopWords.has(term) && !/^\d+$/.test(term)) {
      terms.add(term);
    }
  }

  for (const [canonical, variants] of Object.entries(synonyms)) {
    if (normalized.includes(canonical) || variants.some((variant) => normalized.includes(variant))) {
      terms.add(canonical);
      variants.forEach((variant) => terms.add(variant));
    }
  }

  return Array.from(terms);
}

function storySeason(date: string): CompanionSeason | undefined {
  const month = Number(date.slice(5, 7));
  if (!Number.isInteger(month) || month < 1 || month > 12) return undefined;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function matchesHardFilters(story: SearchableStory, intent: CompanionIntent): boolean {
  if (intent.years.length > 0) {
    const year = Number(story.date.slice(0, 4));
    if (!intent.years.includes(year) && !intent.years.some((value) => story.era.includes(String(value)))) {
      return false;
    }
  }

  if (intent.season && storySeason(story.date) !== intent.season) return false;

  if (intent.member === "both" && story.member !== "both") return false;
  if (intent.member === "A" && story.member !== "A" && story.member !== "both") return false;
  if (intent.member === "B" && story.member !== "B" && story.member !== "both") return false;

  return true;
}

function termScore(story: SearchableStory, term: string): number {
  const fields: Array<[string, number]> = [
    [story.title, 8],
    [story.summary, 6],
    [story.arc ?? "", 5],
    [story.tags.join(" "), 4],
    [story.moods.join(" "), 4],
    [story.facts.join(" "), 3],
    [story.meaning ?? "", 2],
    [story.interpretation ?? "", 1],
    [story.html ?? "", 1],
  ];

  return fields.reduce((best, [value, weight]) =>
    normalize(value).includes(term) ? Math.max(best, weight) : best, 0);
}

export function searchStories<T extends SearchableStory>(
  message: string,
  intent: CompanionIntent,
  stories: readonly T[],
  options: { limit?: number; minimumScore?: number } = {},
): StorySearchResult<T>[] {
  if (intent.mode !== "story") return [];

  const limit = Math.max(1, options.limit ?? 5);
  const minimumScore = Math.max(0, options.minimumScore ?? 3);
  const terms = tokenize(message);

  return stories
    .filter((story) => matchesHardFilters(story, intent))
    .map((story) => {
      const matchedTerms = terms.filter((term) => termScore(story, term) > 0);
      let score = matchedTerms.reduce((total, term) => total + termScore(story, term), 0);

      if (intent.years.length > 0) score += 5;
      if (intent.season) score += 3;
      if (intent.member) score += 2;

      return { story, score, matchedTerms };
    })
    .filter((result) => terms.length === 0 || result.matchedTerms.length > 0)
    .filter((result) => result.score >= minimumScore)
    .sort((left, right) => right.score - left.score || right.story.date.localeCompare(left.story.date))
    .slice(0, limit);
}
