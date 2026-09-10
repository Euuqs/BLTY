import type {
  CompanionChatRequest,
  CompanionMessage,
  CompanionPageContext,
} from "./types";

export const COMPANION_LIMITS = {
  messageCharacters: 2_000,
  conversationMessages: 12,
  messageCharactersInHistory: 4_000,
  pageTitleCharacters: 120,
  anonymousSessionIdCharacters: 128,
  recommendations: 2,
  requestTimeoutMs: 30_000,
} as const;

const roles = new Set(["user", "assistant"]);
const pageTypes = new Set([
  "home",
  "same-style",
  "schedule",
  "feed",
  "tour",
  "story",
  "unknown",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readOptionalString(
  value: unknown,
  field: string,
  maxLength: number,
): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") throw new Error(`${field} must be a string`);
  const normalized = value.trim();
  if (!normalized) return undefined;
  if (normalized.length > maxLength) throw new Error(`${field} is too long`);
  return normalized;
}

function parseMessage(value: unknown, index: number): CompanionMessage {
  if (!isRecord(value)) throw new Error(`conversation[${index}] must be an object`);

  const id = readOptionalString(value.id, `conversation[${index}].id`, 128);
  const content = readOptionalString(
    value.content,
    `conversation[${index}].content`,
    COMPANION_LIMITS.messageCharactersInHistory,
  );

  if (!id || !content || typeof value.role !== "string" || !roles.has(value.role)) {
    throw new Error(`conversation[${index}] is invalid`);
  }

  return {
    id,
    role: value.role as CompanionMessage["role"],
    content,
    createdAt: readOptionalString(value.createdAt, `conversation[${index}].createdAt`, 64),
  };
}

function parsePageContext(value: unknown): CompanionPageContext | undefined {
  if (value === undefined) return undefined;
  if (!isRecord(value) || typeof value.pageType !== "string" || !pageTypes.has(value.pageType)) {
    throw new Error("pageContext is invalid");
  }

  return {
    pageType: value.pageType as CompanionPageContext["pageType"],
    contentId: readOptionalString(value.contentId, "pageContext.contentId", 128),
    title: readOptionalString(
      value.title,
      "pageContext.title",
      COMPANION_LIMITS.pageTitleCharacters,
    ),
    date: readOptionalString(value.date, "pageContext.date", 32),
  };
}

export function parseCompanionChatRequest(value: unknown): CompanionChatRequest {
  if (!isRecord(value)) throw new Error("request body must be an object");

  const message = readOptionalString(
    value.message,
    "message",
    COMPANION_LIMITS.messageCharacters,
  );
  if (!message) throw new Error("message is required");

  let conversation: CompanionMessage[] | undefined;
  if (value.conversation !== undefined) {
    if (!Array.isArray(value.conversation)) throw new Error("conversation must be an array");
    if (value.conversation.length > COMPANION_LIMITS.conversationMessages) {
      throw new Error("conversation has too many messages");
    }
    conversation = value.conversation.map(parseMessage);
  }

  return {
    message,
    conversation,
    pageContext: parsePageContext(value.pageContext),
    anonymousSessionId: readOptionalString(
      value.anonymousSessionId,
      "anonymousSessionId",
      COMPANION_LIMITS.anonymousSessionIdCharacters,
    ),
  };
}

