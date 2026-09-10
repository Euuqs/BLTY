import test from "node:test";
import assert from "node:assert/strict";
import { classifyCompanionIntent } from "../../src/lib/companion/intent";

test("ordinary companionship does not search", () => {
  assert.equal(classifyCompanionIntent("今天好累").mode, "companion");
  assert.equal(classifyCompanionIntent("晚安呀").mode, "companion");
  assert.equal(classifyCompanionIntent("突然有点想她们").mode, "companion");
});

test("story language, dates and source questions trigger search", () => {
  assert.equal(classifyCompanionIntent("给我找一个以前很开心的故事").mode, "story");
  assert.equal(classifyCompanionIntent("她们2026年夏天发生过什么？").mode, "story");
  assert.equal(classifyCompanionIntent("这个有出处吗？").mode, "story");
  assert.equal(classifyCompanionIntent("最近有什么行程？").mode, "story");
  assert.equal(classifyCompanionIntent("找一下她们的同款衣服").mode, "story");
  assert.equal(classifyCompanionIntent("最近更新了什么动态？").mode, "story");
});

test("extracts filters without treating member alone as a search request", () => {
  const intent = classifyCompanionIntent("柏欣妤2026年夏天的生日会是什么时候？");
  assert.deepEqual(intent.years, [2026]);
  assert.equal(intent.season, "summer");
  assert.equal(intent.member, "A");
  assert.equal(intent.mode, "story");

  assert.equal(classifyCompanionIntent("柏欣妤今天也很可爱").mode, "companion");
});
