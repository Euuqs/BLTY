import type {
  CompanionProvider,
  CompanionProviderEvent,
  CompanionProviderInput,
} from "../provider";

function replyFor(input: CompanionProviderInput): string {
  if (input.intent.mode === "story") {
    const match = input.storyMatches[0]?.story;
    if (!match) {
      return "我现在的故事资料里还没有找到足够相关的记录，所以不想凭空补一段。你可以换个年份、活动或关键词问我。";
    }

    if (input.intent.wantsSources) {
      return match.sources.length > 0
        ? `${match.summary} 这段记录保存了 ${match.sources.length} 个来源，正式回复时可以按你的需要展开。`
        : `${match.summary} 不过这段资料目前没有保存可展示的来源。`;
    }

    return `${match.summary} 如果你愿意，我们可以沿着这段再慢慢往前后看看。`;
  }

  return "我在。没有新消息的时候也不用急着找点什么填满，想聊两句或者安静待一会儿都可以。";
}

async function* streamMockReply(
  input: CompanionProviderInput,
  { signal }: { signal: AbortSignal },
): AsyncGenerator<CompanionProviderEvent> {
  const reply = replyFor(input);
  const chunks = reply.match(/.{1,18}/gu) ?? [reply];

  for (const delta of chunks) {
    if (signal.aborted) throw signal.reason ?? new DOMException("Aborted", "AbortError");
    yield { type: "text-delta", delta };
  }

  const firstMatch = input.storyMatches[0]?.story;
  if (firstMatch) {
    yield {
      type: "recommendations",
      items: [{ type: firstMatch.contentType ?? "story", id: firstMatch.id }],
    };
  }

  yield {
    type: "usage",
    usage: { provider: "mock", model: "mock-v1", inputTokens: 0, outputTokens: 0 },
  };
}

export const mockCompanionProvider: CompanionProvider = {
  id: "mock",
  model: "mock-v1",
  stream: streamMockReply,
};
