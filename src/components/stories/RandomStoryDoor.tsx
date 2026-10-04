"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "@/components/mascot/Mascots";

type RandomStory = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

const LAST_RANDOM_STORY_KEY = "cp-site:last-random-story";

export function RandomStoryDoor({ stories }: { stories: RandomStory[] }) {
  const router = useRouter();
  const [isTurning, setIsTurning] = useState(false);

  function openRandomStory() {
    if (isTurning || stories.length === 0) return;

    const lastSlug = window.sessionStorage.getItem(LAST_RANDOM_STORY_KEY);
    const unreadPool = stories.filter((story) => story.slug !== lastSlug);
    const pool = unreadPool.length > 0 ? unreadPool : stories;
    const story = pool[Math.floor(Math.random() * pool.length)];

    window.sessionStorage.setItem(LAST_RANDOM_STORY_KEY, story.slug);
    setIsTurning(true);
    router.push(`/stories/${story.slug}`);
  }

  return (
    <section className="stories-random-door" aria-labelledby="stories-random-title">
      <div className="stories-random-note" aria-hidden="true">
        <span>随手一翻</span>
        <strong>?</strong>
        <small>哪一天，会先被你遇见</small>
      </div>
      <div className="stories-random-copy">
        <p>不必每次都从第一篇开始</p>
        <h2 id="stories-random-title">随手翻到一天</h2>
        <p>让档案替你挑一段已经公开收录的故事。可能是一场舞台，也可能只是一件后来被记住的小事。</p>
        <button type="button" onClick={openRandomStory} disabled={isTurning || stories.length === 0}>
          <span>{isTurning ? "正在翻页…" : "替我翻一页"}</span>
          <ArrowRight aria-hidden="true" />
        </button>
        <small>只从 {stories.length} 篇公开记录中选择 · 不会连续遇见同一篇</small>
      </div>
    </section>
  );
}
