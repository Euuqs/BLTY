import type {
  CompanionMessage,
  CompanionPageContext,
  CompanionRecommendation,
  CompanionUsage,
} from "../companion/types";
import type { StorySearchResult, SearchableStory } from "../companion/retrieve";
import type { CompanionIntent } from "../companion/intent";
import type { CompanionContentType } from "../companion/types";

export interface ProviderStory extends SearchableStory {
  contentType?: CompanionContentType;
  related: CompanionRecommendation[];
  sources: Array<{ title: string; url: string }>;
  confidence: "confirmed" | "partial" | "unverified";
}

export interface CompanionProviderInput {
  requestId: string;
  message: string;
  conversation: CompanionMessage[];
  pageContext?: CompanionPageContext;
  intent: CompanionIntent;
  storyMatches: StorySearchResult<ProviderStory>[];
}

export type CompanionProviderEvent =
  | { type: "text-delta"; delta: string }
  | { type: "recommendations"; items: CompanionRecommendation[] }
  | { type: "usage"; usage: CompanionUsage };

export interface CompanionProvider {
  readonly id: string;
  readonly model: string;
  stream(
    input: CompanionProviderInput,
    options: { signal: AbortSignal },
  ): AsyncIterable<CompanionProviderEvent>;
}
