import { COMPANION_LIMITS } from "./contract";
import type { CompanionPageContext, CompanionRecommendation } from "./types";
import type { ProviderStory } from "../ai/provider";

function contextRecommendation(
  pageContext: CompanionPageContext | undefined,
): CompanionRecommendation | undefined {
  if (!pageContext?.contentId) return undefined;
  if (
    pageContext.pageType !== "story" &&
    pageContext.pageType !== "same-style" &&
    pageContext.pageType !== "schedule" &&
    pageContext.pageType !== "feed"
  ) {
    return undefined;
  }

  return { type: pageContext.pageType, id: pageContext.contentId };
}

export function validateRecommendations(
  requested: readonly CompanionRecommendation[],
  matchedStories: readonly ProviderStory[],
  pageContext?: CompanionPageContext,
): CompanionRecommendation[] {
  const allowed = new Set<string>();
  for (const story of matchedStories) {
    allowed.add(`${story.contentType ?? "story"}:${story.id}`);
    story.related.forEach((item) => allowed.add(`${item.type}:${item.id}`));
  }

  const current = contextRecommendation(pageContext);
  if (current) allowed.add(`${current.type}:${current.id}`);

  const accepted: CompanionRecommendation[] = [];
  const seen = new Set<string>();
  for (const item of requested) {
    const key = `${item.type}:${item.id}`;
    if (!allowed.has(key) || seen.has(key)) continue;
    seen.add(key);
    accepted.push(item);
    if (accepted.length >= COMPANION_LIMITS.recommendations) break;
  }

  return accepted;
}
