import type { MetadataRoute } from "next";
import {
  publishedFeeds as feeds,
  publishedSameStyles as sameStyles,
  publishedSchedules as schedules,
} from "@/lib/velite";

const BASE_URL = "https://bailitiaoyi.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const latestDate = [
    ...sameStyles.map((s) => s.date),
    ...schedules.map((s) => s.date),
    ...feeds.map((f) => f.date),
  ]
    .filter(Boolean)
    .sort()
    .pop();

  const lastModified = latestDate ? new Date(latestDate) : now;

  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/same-styles", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/schedule", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/feed", priority: 0.8, changeFrequency: "daily" as const },
  ];

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
