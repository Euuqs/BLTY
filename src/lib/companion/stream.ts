import type { CompanionStreamEvent } from "./types";

export function encodeCompanionStreamEvent(event: CompanionStreamEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

