"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Story } from "@/lib/velite";
import { ArrowRight } from "@/components/mascot/Mascots";

const memberLabels = { all: "全部人物线", both: "双人故事", A: "柏欣妤", B: "朱怡欣" } as const;
const typeLabels: Record<string, string> = {
  all: "全部内容",
  milestone: "重要节点",
  performance: "舞台",
  interaction: "互动",
  daily: "日常",
  timeline: "时间线",
  event: "事件",
};
const confidenceLabels = { confirmed: "已核对", partial: "部分核对", unverified: "待核对" } as const;

export function StoryArchive({ stories }: { stories: Story[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [year, setYear] = useState(() => searchParams.get("year") ?? "all");
  const [member, setMember] = useState<keyof typeof memberLabels>(() => {
    const value = searchParams.get("member");
    return value && value in memberLabels ? value as keyof typeof memberLabels : "all";
  });
  const [type, setType] = useState(() => searchParams.get("type") ?? "all");
  const [arc, setArc] = useState(() => searchParams.get("arc") ?? "all");
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  const years = useMemo(
    () => Array.from(new Set(stories.map((story) => story.date.slice(0, 4)))).sort().reverse(),
    [stories],
  );

  const arcs = useMemo(() => {
    const counts = stories.reduce<Record<string, number>>((result, story) => {
      if (story.arc) result[story.arc] = (result[story.arc] ?? 0) + 1;
      return result;
    }, {});
    return Object.entries(counts).filter(([, count]) => count > 1).sort(([, a], [, b]) => b - a);
  }, [stories]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (year !== "all") params.set("year", year);
    if (member !== "all") params.set("member", member);
    if (type !== "all") params.set("type", type);
    if (arc !== "all") params.set("arc", arc);
    if (query.trim()) params.set("q", query.trim());
    const nextUrl = params.size > 0 ? `${pathname}?${params.toString()}#archive` : `${pathname}#archive`;
    router.replace(nextUrl, { scroll: false });
  }, [arc, member, pathname, query, router, type, year]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("zh-CN");
    return stories.filter((story) => {
      if (year !== "all" && !story.date.startsWith(year)) return false;
      if (member !== "all" && story.member !== member) return false;
      if (type !== "all" && !story.types.includes(type as Story["types"][number])) return false;
      if (arc !== "all" && story.arc !== arc) return false;
      if (!normalized) return true;
      const haystack = [story.date, story.date.slice(0, 7), story.date.replaceAll("-", "."), story.title, story.summary, story.arc, ...story.tags, ...story.facts].filter(Boolean).join(" ").toLocaleLowerCase("zh-CN");
      return haystack.includes(normalized);
    });
  }, [stories, year, member, type, arc, query]);

  const grouped = useMemo(() => {
    return visible.reduce<Record<string, Story[]>>((result, story) => {
      const storyYear = story.date.slice(0, 4);
      (result[storyYear] ??= []).push(story);
      return result;
    }, {});
  }, [visible]);

  const clearFilters = () => {
    setYear("all");
    setMember("all");
    setType("all");
    setArc("all");
    setQuery("");
  };

  return (
    <div className="stories-explorer" id="archive">
      <section className="stories-filters" aria-label="筛选故事">
        <label className="stories-search">
          <span>搜索故事</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="舞台、礼物、原话或日期"
          />
        </label>

        <fieldset>
          <legend>年份</legend>
          <div>
            <button type="button" className={year === "all" ? "is-active" : ""} onClick={() => setYear("all")}>全部</button>
            {years.map((item) => <button type="button" className={year === item ? "is-active" : ""} onClick={() => setYear(item)} key={item}>{item}</button>)}
          </div>
        </fieldset>

        <fieldset>
          <legend>故事线</legend>
          <div>
            <button type="button" className={arc === "all" ? "is-active" : ""} onClick={() => setArc("all")}>全部故事线</button>
            {arcs.map(([value]) => <button type="button" className={arc === value ? "is-active" : ""} onClick={() => setArc(value)} key={value}>{value}</button>)}
          </div>
        </fieldset>

        <fieldset>
          <legend>人物线</legend>
          <div>
            {(Object.keys(memberLabels) as Array<keyof typeof memberLabels>).map((item) => (
              <button type="button" className={member === item ? "is-active" : ""} onClick={() => setMember(item)} key={item}>{memberLabels[item]}</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>内容</legend>
          <div>
            {Object.entries(typeLabels).map(([value, label]) => (
              <button type="button" className={type === value ? "is-active" : ""} onClick={() => setType(value)} key={value}>{label}</button>
            ))}
          </div>
        </fieldset>
      </section>

      <div className="stories-result-heading" aria-live="polite">
        <p>找到 <strong>{visible.length}</strong> 篇记录</p>
        {(year !== "all" || member !== "all" || type !== "all" || arc !== "all" || query) && <button type="button" onClick={clearFilters}>清除筛选</button>}
      </div>

      {visible.length === 0 ? (
        <section className="stories-empty">
          <h2>这一页暂时没有故事</h2>
          <p>换一个年份或关键词试试，也可以清除筛选重新翻阅。</p>
          <button type="button" onClick={clearFilters}>查看全部故事</button>
        </section>
      ) : (
        <div className="stories-years">
          {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([storyYear, yearStories]) => (
            <section className="stories-year" key={storyYear} aria-labelledby={`stories-year-${storyYear}`}>
              <header>
                <h2 id={`stories-year-${storyYear}`}>{storyYear}</h2>
                <p>{yearStories.length} 篇公开记录</p>
              </header>
              <div className="stories-grid">
                {yearStories.map((story) => (
                  <article className={`story-card story-card-${story.member}`} key={story.id}>
                    <div className="story-card-meta">
                      <time dateTime={story.date}>{story.date.slice(5, 10).replace("-", ".")}</time>
                      <span>{story.arc ?? (story.member === "both" ? "双人故事" : story.member === "A" ? "柏欣妤" : "朱怡欣")}</span>
                    </div>
                    <h3>{story.title}</h3>
                    <p>{story.summary}</p>
                    <div className="story-card-bottom">
                      <span className={`story-confidence is-${story.confidence}`}>{confidenceLabels[story.confidence]}</span>
                      <Link href={`/stories/${story.slug}`} prefetch={false}>阅读全文 <ArrowRight aria-hidden="true" /></Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
