import test from "node:test";
import assert from "node:assert/strict";
import { classifyCompanionIntent } from "../../src/lib/companion/intent";
import { searchStories, type SearchableStory } from "../../src/lib/companion/retrieve";

const stories: SearchableStory[] = [
  {
    id: "birthday",
    title: "当我们一起走过生日会",
    date: "2026-07-25",
    member: "A",
    era: "2026年夏季",
    arc: "当我们一起走过",
    tags: ["生日会", "舞台", "上海"],
    moods: ["温暖", "开心"],
    summary: "柏欣妤生日会音乐舞台畅享会在上海举行。",
    facts: ["活动于2026年7月25日举行。"],
  },
  {
    id: "tour-announcement",
    title: "PRIVATE SIGNAL杭州站官宣",
    date: "2026-07-17",
    member: "both",
    era: "2026年夏季",
    arc: "PRIVATE SIGNAL",
    tags: ["巡演", "官宣", "杭州"],
    moods: ["期待"],
    summary: "两人官宣双人巡演杭州站。",
    facts: ["演出计划于2026年8月22日举行。"],
  },
  {
    id: "old-winter",
    title: "冬日记录",
    date: "2025-12-20",
    member: "B",
    era: "2025年冬季",
    tags: ["日常"],
    moods: ["开心"],
    summary: "一条冬日记录。",
    facts: ["记录于2025年。"],
  },
];

test("ordinary companionship always returns no retrieval results", () => {
  const intent = classifyCompanionIntent("今天有点累");
  assert.deepEqual(searchStories("今天有点累", intent, stories), []);
});

test("uses year, season and member as hard filters", () => {
  const message = "柏欣妤2026年夏天的生日会是什么时候？";
  const results = searchStories(message, classifyCompanionIntent(message), stories);
  assert.equal(results[0]?.story.id, "birthday");
  assert.equal(results.length, 1);
});

test("ranks title and arc matches above generic mood matches", () => {
  const message = "PRIVATE SIGNAL巡演后来怎么样了？";
  const results = searchStories(message, classifyCompanionIntent(message), stories);
  assert.equal(results[0]?.story.id, "tour-announcement");
});

test("returns no story when hard filters have no match", () => {
  const message = "她们2024年夏天发生过什么？";
  const results = searchStories(message, classifyCompanionIntent(message), stories);
  assert.deepEqual(results, []);
});

test("respects result limit", () => {
  const message = "给我找一个开心的故事";
  const results = searchStories(message, classifyCompanionIntent(message), stories, { limit: 1 });
  assert.equal(results.length, 1);
});

