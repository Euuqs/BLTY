import { resolveCompanionRecommendation } from "@/lib/companion/catalog";
import type { CompanionContentType } from "@/lib/companion/types";
import {
  getRequestClientKey,
  MemoryRateLimiter,
  readPositiveInteger,
} from "@/lib/companion/http";

const contentTypes = new Set<CompanionContentType>([
  "story",
  "same-style",
  "schedule",
  "feed",
]);

export const runtime = "nodejs";

const recommendationLimiter = new MemoryRateLimiter(
  readPositiveInteger(process.env.COMPANION_RECOMMENDATION_RATE_LIMIT, 60),
  readPositiveInteger(process.env.COMPANION_RATE_LIMIT_WINDOW_MS, 60_000),
);

export async function GET(request: Request) {
  const rateLimit = recommendationLimiter.check(getRequestClientKey(request));
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "请求过于频繁，请稍后再试" },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") as CompanionContentType | null;
  const id = url.searchParams.get("id")?.trim();
  if (!type || !contentTypes.has(type) || !id || id.length > 128) {
    return Response.json({ error: "Invalid recommendation" }, { status: 400 });
  }

  const card = resolveCompanionRecommendation(type, id);
  return card
    ? Response.json(card, { headers: { "Cache-Control": "public, max-age=300" } })
    : Response.json({ error: "Recommendation not found" }, { status: 404 });
}
