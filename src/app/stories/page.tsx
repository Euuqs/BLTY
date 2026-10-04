import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RandomStoryDoor } from "@/components/stories/RandomStoryDoor";
import { StoryArchive } from "@/components/stories/StoryArchive";
import { StageTicketAlbum } from "@/components/stories/StageTicketBook";
import { StoryRelationshipMap, type StoryMapRoute } from "@/components/stories/StoryRelationshipMap";
import { StoriesHero } from "@/components/stories/StoriesHero";
import { ArrowRight } from "@/components/mascot/Mascots";
import { publishedStories } from "@/lib/velite";

export const metadata: Metadata = {
  title: "故事档案",
  description: "按年份、人物与内容类型整理柏欣妤和朱怡欣的公开故事、舞台与重要节点。",
};

export default function StoriesPage() {
  const stories = [...publishedStories].sort((a, b) => b.date.localeCompare(a.date));
  const storiesById = new Map(stories.map((story) => [story.id, story]));
  const mapRouteDefinitions = [
    { id: "firsts", label: "从组队到第一次见面", note: "邀请、见面与第一次一起直播", storyIds: ["story-20220227-best-partner-invitation", "story-20220310-first-airport-meeting", "story-20220310-first-two-person-photo", "story-20220312-first-joint-livestream"] },
    { id: "care", label: "藏在小事里的照顾", note: "送药、零食、外卖与生日蛋糕", storyIds: ["story-20220320-medicine-delivery", "story-draft-20220324-snacks", "story-book-batch3-20220327", "story-20220422-birthday-cake"] },
    { id: "birthday", label: "生日留下的记录", note: "从祝福与读信，到礼物和定制舞台", storyIds: ["story-book-batch3-20220512", "story-book-batch3-20220515", "story-2026-april-gift", "story-2026-birthday-performances"] },
    { id: "stage", label: "后来，一起站上舞台", note: "2026 年共同舞台与杭州巡演记录", storyIds: ["story-2026-golden-song", "story-2026-birthday-performances", "story-2026-private-signal-announcement", "story-2026-private-signal-hangzhou"] },
    { id: "anniversary", label: "从第一天到四周年", note: "只按公开记录回看组队时间线", storyIds: ["story-20220227-best-partner-invitation", "story-20220308-best-partner-name", "story-2026-team-fourth-anniversary"] },
  ];
  const storyMapRoutes: StoryMapRoute[] = mapRouteDefinitions.map((route) => ({
    id: route.id,
    label: route.label,
    note: route.note,
    stories: route.storyIds.flatMap((id) => {
      const story = storiesById.get(id);
      return story ? [{ slug: story.slug, title: story.title, date: story.date, summary: story.summary }] : [];
    }),
  }));

  return (
    <div className="stories-page">
      <StoriesHero storyCount={stories.length} />

      <section className="stories-reading-routes" aria-labelledby="stories-routes-title">
        <div>
          <p>不知道从哪里开始？</p>
          <h2 id="stories-routes-title">按自己的时间，选择一种读法。</h2>
        </div>
        <nav aria-label="故事阅读路线">
          <Link href="/start" prefetch={false}>
            <span>第一次来</span>
            <strong>10 分钟认识她们</strong>
            <small>六个节点，先建立最基本的时间线。</small>
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href="/highlights" prefetch={false}>
            <span>想看精选</span>
            <strong>经典舞台与重要节点</strong>
            <small>八个瞬间，先看最值得记住的公开记录。</small>
            <ArrowRight aria-hidden="true" />
          </Link>
          <a href="#recent-updates">
            <span>回来看看</span>
            <strong>最近更新了什么</strong>
            <small>直接查看本次新增的页面与整理内容。</small>
            <ArrowRight aria-hidden="true" />
          </a>
        </nav>
      </section>

      <RandomStoryDoor
        stories={stories.map(({ slug, title, date, summary }) => ({ slug, title, date, summary }))}
      />

      <StageTicketAlbum
        performances={stories
          .filter((story) => story.types.includes("performance"))
          .map(({ slug, title, date, summary }) => ({ slug, title, date, summary }))}
      />

      <StoryRelationshipMap routes={storyMapRoutes} />

      <section className="stories-curated-arcs" aria-labelledby="stories-arcs-title">
        <header>
          <p>有人会从一朵玫瑰开始，也有人先遇见一场舞台。</p>
          <h2 id="stories-arcs-title">顺着她们走过的路读</h2>
        </header>
        <nav aria-label="精选故事线">
          <Link href="/stories?arc=最佳拍档开始#archive" prefetch={false}><span>01</span><strong>从红玫瑰开始</strong><small>组队邀请、第一次连麦与队名</small><ArrowRight aria-hidden="true" /></Link>
          <Link href="/stories?arc=第一次见面#archive" prefetch={false}><span>02</span><strong>终于见到彼此</strong><small>接机、麻将和第一张双人合照</small><ArrowRight aria-hidden="true" /></Link>
          <Link href="/stories?arc=第一次双人直播#archive" prefetch={false}><span>03</span><strong>第一次一起直播</strong><small>征集问题、筹备与完整直播</small><ArrowRight aria-hidden="true" /></Link>
          <Link href="/stories?arc=PRIVATE%20SIGNAL#archive" prefetch={false}><span>04</span><strong>PRIVATE SIGNAL</strong><small>从公开邀请走到杭州现场</small><ArrowRight aria-hidden="true" /></Link>
        </nav>
      </section>

      <Suspense fallback={<div className="stories-archive-loading" aria-label="正在整理故事目录" />}>
        <StoryArchive stories={stories} />
      </Suspense>

      <section className="stories-updates" id="recent-updates" aria-labelledby="stories-updates-title">
        <header>
          <p>2026.10.02</p>
          <h2 id="stories-updates-title">最近更新</h2>
        </header>
        <div>
          <article><time dateTime="2026-10-02">10.02</time><h3>故事档案正式开放</h3><p>公开故事现在可以按年份、故事线、人物与内容筛选。</p></article>
          <article><time dateTime="2026-10-02">10.02</time><h3>开放 {stories.length} 个详情页</h3><p>每篇分别展示事实、整理说明、来源与核对状态。</p></article>
          <article><time dateTime="2026-10-02">10.02</time><h3>加入快速补档路线</h3><p>第一次来的读者可以先用六个节点建立基础时间线。</p></article>
        </div>
      </section>
    </div>
  );
}
