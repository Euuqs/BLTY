import test from "node:test";
import assert from "node:assert/strict";
import type { CompanionProvider, ProviderStory } from "../../src/lib/ai/provider";
import { mockCompanionProvider } from "../../src/lib/ai/providers/mock";
import { validateRecommendations } from "../../src/lib/companion/recommendations";
import { generateCompanionEvents } from "../../src/lib/companion/service";

const story: ProviderStory = {
  id: "story-1",
  title: "一段开心的夏日故事",
  date: "2026-07-25",
  member: "both",
  era: "2026年夏季",
  arc: "夏日记录",
  tags: ["活动"],
  moods: ["开心"],
  summary: "两人在夏天留下了一段开心的活动记录。",
  facts: ["活动发生在2026年7月25日。"],
  related: [{ type: "feed", id: "feed-1" }],
  sources: [{ title: "站内来源", url: "https://example.com/source" }],
  confidence: "confirmed",
};

test("recommendations only accept matched, related or current-page ids", () => {
  const result = validateRecommendations(
    [
      { type: "story", id: "story-1" },
      { type: "feed", id: "invented" },
      { type: "feed", id: "feed-1" },
      { type: "story", id: "story-1" },
    ],
    [story],
  );

  assert.deepEqual(result, [
    { type: "story", id: "story-1" },
    { type: "feed", id: "feed-1" },
  ]);
});

test("mock provider streams text, validated recommendations, usage and done", async () => {
  const events = [];
  for await (const event of generateCompanionEvents(
    "request-1",
    { message: "给我找一个开心的故事" },
    { provider: mockCompanionProvider, stories: [story] },
    new AbortController().signal,
  )) {
    events.push(event);
  }

  assert.ok(events.some((event) => event.type === "text-delta"));
  assert.deepEqual(events.find((event) => event.type === "recommendations"), {
    type: "recommendations",
    items: [{ type: "story", id: "story-1" }],
  });
  assert.ok(events.some((event) => event.type === "usage"));
  assert.deepEqual(events.at(-1), { type: "done", requestId: "request-1" });
});

test("service drops provider-invented recommendation ids", async () => {
  const unsafeProvider: CompanionProvider = {
    id: "unsafe",
    model: "unsafe-test",
    async *stream() {
      yield { type: "recommendations", items: [{ type: "story", id: "invented" }] };
    },
  };
  const events = [];
  for await (const event of generateCompanionEvents(
    "request-2",
    { message: "给我找一个开心的故事" },
    { provider: unsafeProvider, stories: [story] },
    new AbortController().signal,
  )) {
    events.push(event);
  }

  assert.deepEqual(events, [{ type: "done", requestId: "request-2" }]);
});

test("current page id is an allowed recommendation", () => {
  const result = validateRecommendations(
    [{ type: "schedule", id: "schedule-1" }],
    [],
    { pageType: "schedule", contentId: "schedule-1" },
  );
  assert.deepEqual(result, [{ type: "schedule", id: "schedule-1" }]);
});

test("matched website content keeps its original recommendation type", () => {
  const result = validateRecommendations(
    [{ type: "schedule", id: "schedule-1" }],
    [{ ...story, id: "schedule-1", contentType: "schedule" }],
  );
  assert.deepEqual(result, [{ type: "schedule", id: "schedule-1" }]);
});
