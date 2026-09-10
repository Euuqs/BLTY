import * as v from "../../.velite";
import { validateStoryRelations } from "./companion/relations";

export const allSameStyles = v.sameStyles;
export const allSchedules = v.schedules;
export const allFeeds = v.feeds;
export const allStories = v.stories;

export function isPublishedContent(item: { status?: string }) {
  return item.status !== "draft";
}

export const publishedSameStyles = allSameStyles.filter(isPublishedContent);
export const publishedSchedules = allSchedules.filter(isPublishedContent);
export const publishedFeeds = allFeeds.filter(isPublishedContent);
export const publishedStories = allStories.filter(isPublishedContent);

export const storyRelationIssues = validateStoryRelations({
  stories: publishedStories,
  sameStyles: publishedSameStyles,
  schedules: publishedSchedules,
  feeds: publishedFeeds,
});

if (storyRelationIssues.length > 0) {
  throw new Error(`Invalid published story relations:\n${storyRelationIssues.join("\n")}`);
}

export const sameStyles = publishedSameStyles;
export const schedules = publishedSchedules;
export const feeds = publishedFeeds;
export const stories = publishedStories;

export type SameStyle = (typeof sameStyles)[number];
export type Schedule = (typeof schedules)[number];
export type Feed = (typeof feeds)[number];
export type Story = (typeof stories)[number];
