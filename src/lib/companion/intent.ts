export type CompanionIntentMode = "companion" | "story";
export type CompanionSeason = "spring" | "summer" | "autumn" | "winter";
export type CompanionMemberFilter = "A" | "B" | "both";

export interface CompanionIntent {
  mode: CompanionIntentMode;
  wantsSources: boolean;
  years: number[];
  season?: CompanionSeason;
  member?: CompanionMemberFilter;
  signals: string[];
}

const sourcePatterns = [/哪里看到/, /出处/, /来源/, /有依据/, /有证据/, /确定吗/, /真的吗/];
const storyPatterns = [
  /故事/,
  /回忆/,
  /以前/,
  /当时/,
  /那次/,
  /哪年/,
  /什么时候/,
  /发生过?什么/,
  /后来/,
  /后续/,
  /活动/,
  /巡演/,
  /生日会/,
  /公演/,
  /见面会/,
  /行程/,
  /日程/,
  /动态/,
  /同款/,
  /穿搭/,
  /衣服/,
  /饰品/,
  /品牌/,
  /价格/,
  /直播/,
  /采访/,
];

const seasonPatterns: Array<[CompanionSeason, RegExp]> = [
  ["spring", /春天|春季|春日/],
  ["summer", /夏天|夏季|夏日/],
  ["autumn", /秋天|秋季|秋日/],
  ["winter", /冬天|冬季|冬日/],
];

function detectMember(message: string): CompanionMemberFilter | undefined {
  if (/她们|两人|两位|双人|柏里挑怡/.test(message)) return "both";
  if (/柏欣妤|小柏/.test(message)) return "A";
  if (/朱怡欣|小朱/.test(message)) return "B";
  return undefined;
}

export function classifyCompanionIntent(message: string): CompanionIntent {
  const normalized = message.trim();
  const signals: string[] = [];
  const wantsSources = sourcePatterns.some((pattern) => pattern.test(normalized));
  if (wantsSources) signals.push("source-request");

  const years = Array.from(
    new Set(Array.from(normalized.matchAll(/(?:19|20)\d{2}/g), (match) => Number(match[0]))),
  );
  if (years.length > 0) signals.push("year");

  const season = seasonPatterns.find(([, pattern]) => pattern.test(normalized))?.[0];
  if (season) signals.push("season");

  const member = detectMember(normalized);
  if (member) signals.push(`member:${member}`);

  if (storyPatterns.some((pattern) => pattern.test(normalized))) signals.push("story-language");

  const mode: CompanionIntentMode =
    wantsSources || years.length > 0 || season !== undefined || signals.includes("story-language")
      ? "story"
      : "companion";

  return { mode, wantsSources, years, season, member, signals };
}
