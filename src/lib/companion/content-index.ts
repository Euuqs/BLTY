import type { ProviderStory } from "../ai/provider";
import {
  publishedFeeds,
  publishedSameStyles,
  publishedSchedules,
  publishedStories,
} from "../velite";
import { getCompanionContentId } from "./relations";

function compact(values: Array<string | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value));
}

export const publishedCompanionContent: ProviderStory[] = [
  ...publishedStories.map((story) => ({ ...story, contentType: "story" as const })),
  ...publishedFeeds.map((item) => ({
    id: getCompanionContentId(item),
    contentType: "feed" as const,
    title: item.title,
    date: item.date,
    member: item.member,
    era: item.date.slice(0, 4),
    arc: item.type,
    tags: ["动态", ...(item.tags ?? [])],
    moods: [],
    summary: item.description ?? `${item.date} 发布的${item.type ?? "动态"}记录。`,
    facts: compact([
      `日期：${item.date}`,
      item.type ? `类型：${item.type}` : undefined,
      item.description,
    ]),
    related: [],
    sources: item.link ? [{ title: "原内容链接", url: item.link }] : [],
    confidence: "confirmed" as const,
  })),
  ...publishedSchedules.map((item) => ({
    id: getCompanionContentId(item),
    contentType: "schedule" as const,
    title: item.title,
    date: item.date,
    member: item.member,
    era: item.date.slice(0, 4),
    arc: item.type,
    tags: compact(["行程", item.type, item.location]),
    moods: [],
    summary: item.description ?? `${item.date} 的${item.type ?? "行程"}安排。`,
    facts: compact([
      `日期：${item.date}`,
      item.time ? `时间：${item.time}` : undefined,
      item.type ? `类型：${item.type}` : undefined,
      item.location ? `地点：${item.location}` : undefined,
      item.description,
    ]),
    related: [],
    sources: [],
    confidence: "confirmed" as const,
  })),
  ...publishedSameStyles.map((item) => ({
    id: getCompanionContentId(item),
    contentType: "same-style" as const,
    title: item.title,
    date: item.date,
    member: item.member,
    era: item.date.slice(0, 4),
    arc: item.category,
    tags: ["同款", ...(item.tags ?? [])],
    moods: [],
    summary: compact([item.brand, item.category, item.price]).join(" · ") || "站内同款记录。",
    facts: compact([
      `日期：${item.date}`,
      `分类：${item.category}`,
      item.brand ? `品牌：${item.brand}` : undefined,
      item.price ? `价格：${item.price}` : undefined,
    ]),
    html: item.html,
    related: [],
    sources: [],
    confidence: "confirmed" as const,
  })),
];
