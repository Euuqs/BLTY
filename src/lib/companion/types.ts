export type CompanionRole = "user" | "assistant";

export type CompanionContentType =
  | "story"
  | "same-style"
  | "schedule"
  | "feed";

export type CompanionPageType =
  | "home"
  | "same-style"
  | "schedule"
  | "feed"
  | "tour"
  | "story"
  | "unknown";

export interface CompanionMessage {
  id: string;
  role: CompanionRole;
  content: string;
  createdAt?: string;
}

export interface CompanionPageContext {
  pageType: CompanionPageType;
  contentId?: string;
  title?: string;
  date?: string;
}

export interface CompanionChatRequest {
  message: string;
  conversation?: CompanionMessage[];
  pageContext?: CompanionPageContext;
  anonymousSessionId?: string;
}

export interface CompanionRecommendation {
  type: CompanionContentType;
  id: string;
}

export interface CompanionUsage {
  provider?: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
}

export type CompanionErrorCode =
  | "INVALID_REQUEST"
  | "RATE_LIMITED"
  | "PROVIDER_UNAVAILABLE"
  | "TIMEOUT"
  | "INTERNAL_ERROR";

export type CompanionStreamEvent =
  | { type: "text-delta"; delta: string }
  | { type: "recommendations"; items: CompanionRecommendation[] }
  | { type: "usage"; usage: CompanionUsage }
  | { type: "error"; code: CompanionErrorCode; message: string }
  | { type: "done"; requestId: string };

export interface CompanionLocalMemory {
  version: 1;
  anonymousSessionId: string;
  recentMessages: CompanionMessage[];
  likedStoryIds: string[];
  frequentEras: string[];
  seenRecommendationIds: string[];
  preferences: Record<string, string>;
}

