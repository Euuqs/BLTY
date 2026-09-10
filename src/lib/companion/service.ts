import type { CompanionProvider, ProviderStory } from "../ai/provider";
import { classifyCompanionIntent } from "./intent";
import { validateRecommendations } from "./recommendations";
import { searchStories } from "./retrieve";
import type { CompanionChatRequest, CompanionStreamEvent } from "./types";

interface CompanionServiceDependencies {
  provider: CompanionProvider;
  stories: readonly ProviderStory[];
}

export async function* generateCompanionEvents(
  requestId: string,
  request: CompanionChatRequest,
  dependencies: CompanionServiceDependencies,
  signal: AbortSignal,
): AsyncGenerator<CompanionStreamEvent> {
  const intent = classifyCompanionIntent(request.message);
  const storyMatches = searchStories(request.message, intent, dependencies.stories);
  const matchedStories = storyMatches.map((match) => match.story);

  for await (const event of dependencies.provider.stream(
    {
      requestId,
      message: request.message,
      conversation: request.conversation ?? [],
      pageContext: request.pageContext,
      intent,
      storyMatches,
    },
    { signal },
  )) {
    if (event.type === "recommendations") {
      const items = validateRecommendations(event.items, matchedStories, request.pageContext);
      if (items.length > 0) yield { type: "recommendations", items };
      continue;
    }

    yield event;
  }

  yield { type: "done", requestId };
}

