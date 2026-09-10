import test from "node:test";
import assert from "node:assert/strict";
import {
  COMPANION_LIMITS,
  parseCompanionChatRequest,
} from "../../src/lib/companion/contract";
import { encodeCompanionStreamEvent } from "../../src/lib/companion/stream";
import { readCompanionEventStream } from "../../src/lib/companion/client";

test("request parser trims accepted input and preserves safe context", () => {
  assert.deepEqual(
    parseCompanionChatRequest({
      message: "  这个是什么时候？  ",
      pageContext: { pageType: "feed", contentId: "feed-1", title: "一条动态" },
      anonymousSessionId: "anonymous-1",
    }),
    {
      message: "这个是什么时候？",
      conversation: undefined,
      pageContext: { pageType: "feed", contentId: "feed-1", title: "一条动态", date: undefined },
      anonymousSessionId: "anonymous-1",
    },
  );
});

test("request parser rejects oversized history and invalid context", () => {
  const conversation = Array.from(
    { length: COMPANION_LIMITS.conversationMessages + 1 },
    (_, index) => ({ id: String(index), role: "user", content: "hello" }),
  );
  assert.throws(() => parseCompanionChatRequest({ message: "hello", conversation }));
  assert.throws(() =>
    parseCompanionChatRequest({ message: "hello", pageContext: { pageType: "admin" } }),
  );
});

test("stream events use SSE data framing", () => {
  const encoded = encodeCompanionStreamEvent({ type: "done", requestId: "request-1" });
  assert.equal(
    new TextDecoder().decode(encoded),
    'data: {"type":"done","requestId":"request-1"}\n\n',
  );
});

test("client reads events split across network chunks", async () => {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode('data: {"type":"text-'));
      controller.enqueue(encoder.encode('delta","delta":"你好"}\n\ndata: {"type":"done","requestId":"r1"}\n\n'));
      controller.close();
    },
  });
  const events: unknown[] = [];
  await readCompanionEventStream(new Response(body), (event) => events.push(event));
  assert.deepEqual(events, [
    { type: "text-delta", delta: "你好" },
    { type: "done", requestId: "r1" },
  ]);
});
