import * as v from "../../.velite";

export const allSameStyles = v.sameStyles;
export const allSchedules = v.schedules;
export const allFeeds = v.feeds;

export function isPublishedContent(item: { status?: string }) {
  return item.status !== "draft";
}

export const publishedSameStyles = allSameStyles.filter(isPublishedContent);
export const publishedSchedules = allSchedules.filter(isPublishedContent);
export const publishedFeeds = allFeeds.filter(isPublishedContent);

export const sameStyles = publishedSameStyles;
export const schedules = publishedSchedules;
export const feeds = publishedFeeds;

export type SameStyle = (typeof sameStyles)[number];
export type Schedule = (typeof schedules)[number];
export type Feed = (typeof feeds)[number];
