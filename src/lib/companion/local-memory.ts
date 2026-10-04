import type { CompanionDiscoveredMemory } from "./types";

export const COMPANION_MEMORY_KEY = "cp-site:companion-memories:v1";
export const COMPANION_MEMORY_EVENT = "cp-site:companion-memory-change";

export function readCompanionMemories(): CompanionDiscoveredMemory[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(COMPANION_MEMORY_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.slice(0, 8).filter((item): item is CompanionDiscoveredMemory =>
      typeof item?.id === "string" &&
      typeof item?.title === "string" &&
      typeof item?.excerpt === "string",
    );
  } catch {
    return [];
  }
}

export function rememberCompanionMemory(memory: CompanionDiscoveredMemory) {
  const current = readCompanionMemories();
  if (current.some((item) => item.id === memory.id)) return;
  window.localStorage.setItem(COMPANION_MEMORY_KEY, JSON.stringify([...current, memory].slice(-8)));
  window.dispatchEvent(new Event(COMPANION_MEMORY_EVENT));
}
