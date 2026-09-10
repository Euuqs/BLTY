import test from "node:test";
import assert from "node:assert/strict";
import { createDeepSeekProvider } from "../../src/lib/ai/providers/deepseek";

test("DeepSeek provider parses split SSE chunks and reports usage", async () => {
  const encoder = new TextEncoder();
  let capturedRequest: RequestInit | undefined;
  const fetchImpl: typeof fetch = async (_input, init) => {
    capturedRequest = init;
    return new Response(
      new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"你'));
          controller.enqueue(encoder.encode('好"}}]}\n\ndata: {"choices":[],"usage":{"prompt_tokens":12,"completion_tokens":2}}\n\ndata: [DONE]\n\n'));
          controller.close();
        },
      }),
      { status: 200 },
    );
  };
  const provider = createDeepSeekProvider({
    apiKey: "test-key",
    baseUrl: "https://example.com/",
    model: "test-model",
    fetchImpl,
  });

  const events = [];
  for await (const event of provider.stream(
    {
      requestId: "request-1",
      message: "陪我聊聊",
      conversation: [],
      intent: { mode: "companion", wantsSources: false, years: [], signals: [] },
      storyMatches: [],
    },
    { signal: new AbortController().signal },
  )) {
    events.push(event);
  }

  assert.deepEqual(events, [
    { type: "text-delta", delta: "你好" },
    {
      type: "usage",
      usage: { provider: "deepseek", model: "test-model", inputTokens: 12, outputTokens: 2 },
    },
  ]);
  assert.equal((capturedRequest?.headers as Record<string, string>).Authorization, "Bearer test-key");
  assert.equal(JSON.parse(String(capturedRequest?.body)).model, "test-model");
});

test("DeepSeek provider rejects unsuccessful responses", async () => {
  const provider = createDeepSeekProvider({
    apiKey: "test-key",
    fetchImpl: async () => new Response("rate limited", { status: 429 }),
  });
  const consume = async () => {
    for await (const event of provider.stream(
      {
        requestId: "request-2",
        message: "你好",
        conversation: [],
        intent: { mode: "companion", wantsSources: false, years: [], signals: [] },
        storyMatches: [],
      },
      { signal: new AbortController().signal },
    )) {
      void event;
    }
  };
  await assert.rejects(consume(), /status 429/);
});
