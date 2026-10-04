"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "@/components/mascot/Mascots";

type MapStory = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export type StoryMapRoute = {
  id: string;
  label: string;
  note: string;
  stories: MapStory[];
};

export function StoryRelationshipMap({ routes }: { routes: StoryMapRoute[] }) {
  const [activeId, setActiveId] = useState(routes[0]?.id ?? "");
  const activeRoute = routes.find((route) => route.id === activeId) ?? routes[0];
  if (!activeRoute) return null;

  return (
    <section className="story-map" aria-labelledby="story-map-title">
      <header>
        <p>同一件事，在几年后也许会有新的回声</p>
        <h2 id="story-map-title">沿着主题，把故事连起来</h2>
        <span>连线表示整理主题与时间顺序，不代表对私人关系的判断。</span>
      </header>

      <div className="story-map-fold">
        <nav aria-label="选择故事主题">
          {routes.map((route, index) => (
            <button
              type="button"
              key={route.id}
              className={route.id === activeRoute.id ? "is-active" : ""}
              aria-pressed={route.id === activeRoute.id}
              onClick={() => setActiveId(route.id)}
            >
              <em>{String(index + 1).padStart(2, "0")}</em>
              <span>{route.label}</span>
            </button>
          ))}
        </nav>

        <div className="story-map-route" key={activeRoute.id}>
          <div className="story-map-route-heading">
            <p>{activeRoute.label}</p>
            <span>{activeRoute.note}</span>
          </div>
          <ol>
            {activeRoute.stories.map((story, index) => (
              <li key={story.slug}>
                <i aria-hidden="true">{String(index + 1).padStart(2, "0")}</i>
                <Link href={`/stories/${story.slug}`} prefetch={false}>
                  <time dateTime={story.date}>{story.date.slice(0, 10).replaceAll("-", ".")}</time>
                  <strong>{story.title}</strong>
                  <span>{story.summary}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
