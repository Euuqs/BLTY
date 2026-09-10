import { getCompanionProvider } from "@/lib/ai/registry";
import { COMPANION_LIMITS, parseCompanionChatRequest } from "@/lib/companion/contract";
import { generateCompanionEvents } from "@/lib/companion/service";
import { publishedCompanionContent } from "@/lib/companion/content-index";
import { encodeCompanionStreamEvent } from "@/lib/companion/stream";
import type { CompanionErrorCode, CompanionStreamEvent } from "@/lib/companion/types";
import {
  getRequestClientKey,
  MemoryRateLimiter,
  readJsonBody,
  readPositiveInteger,
  RequestBodyTooLargeError,
} from "@/lib/companion/http";

export const runtime = "nodejs";

const chatLimiter = new MemoryRateLimiter(
  readPositiveInteger(process.env.COMPANION_CHAT_RATE_LIMIT, 10),
  readPositiveInteger(process.env.COMPANION_RATE_LIMIT_WINDOW_MS, 60_000),
);

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const rateLimit = chatLimiter.check(getRequestClientKey(request));
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

  let input;
  try {
    input = parseCompanionChatRequest(await readJsonBody(request));
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return jsonError("请求内容过大", 413);
    }
    return jsonError(error instanceof SyntaxError ? "请求格式错误" : error instanceof Error ? error.message : "Invalid request", 400);
  }

  let provider;
  try {
    provider = getCompanionProvider();
  } catch {
    return jsonError("Companion provider is not configured", 503);
  }

  const requestId = crypto.randomUUID();
  const timeoutController = new AbortController();
  let didTimeout = false;
  let cancelled = false;
  const timeout = setTimeout(
    () => {
      didTimeout = true;
      timeoutController.abort(new DOMException("Timed out", "TimeoutError"));
    },
    COMPANION_LIMITS.requestTimeoutMs,
  );
  const signal = AbortSignal.any([request.signal, timeoutController.signal]);

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of generateCompanionEvents(
          requestId,
          input,
          { provider, stories: publishedCompanionContent },
          signal,
        )) {
          controller.enqueue(encodeCompanionStreamEvent(event));
        }
      } catch (error) {
        console.error("Companion provider request failed", {
          requestId,
          provider: provider.id,
          model: provider.model,
          error: error instanceof Error ? error.message : "Unknown provider error",
        });
        if (!request.signal.aborted && !cancelled) {
          const event: CompanionStreamEvent = {
            type: "error",
            code: (didTimeout ? "TIMEOUT" : "PROVIDER_UNAVAILABLE") as CompanionErrorCode,
            message: didTimeout
              ? "回复等待时间过长，请稍后再试。"
              : "陪伴者暂时没有回应，请稍后再试。",
          };
          controller.enqueue(encodeCompanionStreamEvent(event));
        }
      } finally {
        clearTimeout(timeout);
        if (!cancelled) controller.close();
      }
    },
    cancel() {
      cancelled = true;
      clearTimeout(timeout);
      timeoutController.abort(new DOMException("Cancelled", "AbortError"));
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
