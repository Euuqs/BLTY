"use client";

import { useCompanion } from "./CompanionProvider";
import { ChatIcon } from "./icons";

export function CompanionTrigger() {
  const { isOpen, open } = useCompanion();
  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={open}
      aria-label="打开故事陪伴者"
      aria-haspopup="dialog"
      className="floating-control floating-control-right floating-control-primary btn-press flex min-h-12 items-center gap-2 rounded-full border border-cp/35 bg-surface-2/95 px-4 py-2.5 text-sm font-medium text-foreground shadow-glow backdrop-blur-xl transition-transform hover:-translate-y-0.5"
    >
      <ChatIcon className="h-5 w-5 text-cp" />
      <span>陪我聊聊</span>
    </button>
  );
}
