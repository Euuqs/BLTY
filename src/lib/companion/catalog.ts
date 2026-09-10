import { getCompanionContentId } from "./relations";
import type { CompanionContentType } from "./types";
import {
  publishedFeeds,
  publishedSameStyles,
  publishedSchedules,
  publishedStories,
} from "../velite";

export interface CompanionRecommendationCard {
  type: CompanionContentType;
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
}

function contentHref(type: CompanionContentType, slug: string): string | undefined {
  if (type === "same-style") return `/same-styles#${encodeURIComponent(slug)}`;
  if (type === "schedule") return `/schedule#${encodeURIComponent(slug)}`;
  if (type === "feed") return `/feed#${encodeURIComponent(slug)}`;
  return undefined;
}

export function resolveCompanionRecommendation(
  type: CompanionContentType,
  id: string,
): CompanionRecommendationCard | undefined {
  if (type === "story") {
    const story = publishedStories.find((item) => getCompanionContentId(item) === id);
    if (!story) return undefined;
    const firstRelated = story.related[0];
    const related = firstRelated
      ? resolveCompanionRecommendation(firstRelated.type, firstRelated.id)
      : undefined;
    return { type, id, title: story.title, subtitle: story.summary, href: related?.href };
  }

  const collections = {
    "same-style": publishedSameStyles,
    schedule: publishedSchedules,
    feed: publishedFeeds,
  } as const;
  const item = collections[type].find((entry) => getCompanionContentId(entry) === id);
  if (!item) return undefined;

  const subtitle =
    type === "same-style" && "brand" in item
      ? item.brand || item.category
      : "description" in item
        ? item.description
        : undefined;

  return { type, id, title: item.title, subtitle, href: contentHref(type, item.slug) };
}

