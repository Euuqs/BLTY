"use client";

import { useState } from "react";
import { rememberCompanionMemory } from "@/lib/companion/local-memory";
import type { CompanionDiscoveredMemory } from "@/lib/companion/types";

export function StoryEasterEgg({ memory }: { memory: CompanionDiscoveredMemory }) {
  const [isOpen, setIsOpen] = useState(false);

  function reveal() {
    setIsOpen(true);
    rememberCompanionMemory(memory);
  }

  return (
    <aside className={`story-easter-egg${isOpen ? " is-open" : ""}`} aria-label="故事彩蛋">
      {!isOpen ? (
        <button type="button" onClick={reveal} aria-expanded="false">
          <span aria-hidden="true">＊</span>
          这里夹着一张小纸条
        </button>
      ) : (
        <div className="story-easter-note">
          <p>你在这页发现了</p>
          <blockquote>“{memory.excerpt}”</blockquote>
          <span>{memory.title}</span>
          <small>故事陪伴者已经替你记下。</small>
        </div>
      )}
    </aside>
  );
}
