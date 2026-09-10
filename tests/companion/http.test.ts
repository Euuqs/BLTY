import test from "node:test";
import assert from "node:assert/strict";
import {
  MemoryRateLimiter,
  readJsonBody,
  readPositiveInteger,
  RequestBodyTooLargeError,
} from "../../src/lib/companion/http";

test("memory rate limiter rejects excess requests and reports retry time", () => {
  const limiter = new MemoryRateLimiter(2, 1_000);
  assert.equal(limiter.check("visitor", 10_000).allowed, true);
  assert.equal(limiter.check("visitor", 10_100).allowed, true);
  assert.deepEqual(limiter.check("visitor", 10_200), {
    allowed: false,
    retryAfterSeconds: 1,
  });
  assert.equal(limiter.check("visitor", 11_001).allowed, true);
});

test("JSON body reader rejects declared and streamed oversized bodies", async () => {
  const declared = new Request("http://localhost", {
    method: "POST",
    headers: { "content-length": "100" },
    body: "{}",
  });
  await assert.rejects(() => readJsonBody(declared, 10), RequestBodyTooLargeError);

  const streamed = new Request("http://localhost", {
    method: "POST",
    body: JSON.stringify({ message: "a".repeat(100) }),
  });
  await assert.rejects(() => readJsonBody(streamed, 10), RequestBodyTooLargeError);
});

test("JSON body reader parses accepted content and env integers use safe fallbacks", async () => {
  const request = new Request("http://localhost", { method: "POST", body: '{"message":"你好"}' });
  assert.deepEqual(await readJsonBody(request), { message: "你好" });
  assert.equal(readPositiveInteger("25", 10), 25);
  assert.equal(readPositiveInteger("0", 10), 10);
  assert.equal(readPositiveInteger("not-a-number", 10), 10);
});
