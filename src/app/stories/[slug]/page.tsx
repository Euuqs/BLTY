import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "@/components/mascot/Mascots";
import { SourceIssueButton } from "@/components/stories/SourceIssueButton";
import { StageTicketStamp } from "@/components/stories/StageTicketBook";
import { StoryEasterEgg } from "@/components/stories/StoryEasterEgg";
import { publishedStories } from "@/lib/velite";

type StoryPageProps = { params: Promise<{ slug: string }> };

const confidenceLabels = {
  confirmed: "已核对公开来源",
  partial: "部分内容仍待核对",
  unverified: "尚未完成独立核对",
} as const;

const confidenceNotes = {
  confirmed: "关键事实已有可回看的公开材料支持，可沿来源链接继续核对。",
  partial: "主要情节已有公开记录，个别时间、原话或上下文仍在补充。",
  unverified: "来自整理资料或回忆，暂时不作为确定事实延伸解读。",
} as const;

const sourceKindLabels = {
  self: "本人发布",
  official: "官方内容",
  "full-recording": "完整录像",
  "fan-archive": "粉丝整理",
  "search-index": "检索线索",
} as const;

const storyMemories: Record<string, { id: string; title: string; excerpt: string }> = {
  "story-20220227-best-partner-invitation": { id: "red-rose", title: "故事从一朵红玫瑰开始", excerpt: "接受邀请" },
  "story-20220304-ferris-wheel-promise": { id: "ferris-wheel", title: "一个被记下来的约定", excerpt: "以后一起坐摩天轮" },
  "story-2026-april-gift": { id: "little-girl", title: "礼物旁边留下的一句话", excerpt: "永远做小女孩" },
  "story-20260805-xiaocui-baixiaohua": { id: "xiaocui-baixiaohua", title: "临时起好的两个名字", excerpt: "小翠与柏小花" },
};

function getSourcePlatform(url: string) {
  const hostname = new URL(url).hostname.replace(/^www\./, "");
  if (hostname.endsWith("bilibili.com")) return "哔哩哔哩";
  if (hostname.endsWith("weibo.com")) return "微博";
  if (hostname.endsWith("douyin.com")) return "抖音";
  if (hostname.endsWith("snh48.com")) return "SNH48 官方";
  return hostname;
}

export function generateStaticParams() {
  return publishedStories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const story = publishedStories.find((item) => item.slug === decodedSlug);
  if (!story) return {};
  return { title: story.title, description: story.summary };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const story = publishedStories.find((item) => item.slug === decodedSlug);
  if (!story) notFound();
  const chronologicalStories = [...publishedStories].sort((a, b) => a.date.localeCompare(b.date));
  const storyIndex = chronologicalStories.findIndex((item) => item.id === story.id);
  const previousStory = storyIndex > 0 ? chronologicalStories[storyIndex - 1] : undefined;
  const nextStory = storyIndex >= 0 && storyIndex < chronologicalStories.length - 1 ? chronologicalStories[storyIndex + 1] : undefined;
  const sameArcStories = story.arc
    ? chronologicalStories.filter((item) => item.id !== story.id && item.arc === story.arc).slice(-4)
    : [];

  return (
    <article className="story-detail">
      <Link href="/stories" prefetch={false} className="story-detail-back">返回故事档案 <ArrowRight aria-hidden="true" /></Link>

      <header className="story-detail-header">
        <div className="story-detail-date">
          <time dateTime={story.date}>{story.date.slice(0, 10).replaceAll("-", ".")}</time>
          <span>{story.member === "both" ? "双人故事" : story.member === "A" ? "柏欣妤" : "朱怡欣"}</span>
        </div>
        <h1>{story.title}</h1>
        <p>{story.summary}</p>
        <div className={`story-detail-confidence is-${story.confidence}`}>{confidenceLabels[story.confidence]}</div>
      </header>

      <div className="story-detail-layout">
        <main>
          <section className="story-detail-facts" aria-labelledby="story-facts-title">
            <h2 id="story-facts-title">可以确认的内容</h2>
            <ol>
              {story.facts.map((fact, index) => <li key={`${story.id}-fact-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{fact}</p></li>)}
            </ol>
          </section>

          {story.html && <section className="story-detail-body" dangerouslySetInnerHTML={{ __html: story.html }} />}

          {(story.interpretation || story.meaning) && (
            <section className="story-detail-notes" aria-label="整理说明">
              {story.interpretation && <div><h2>如何理解</h2><p>{story.interpretation}</p></div>}
              {story.meaning && <div><h2>为什么收录</h2><p>{story.meaning}</p></div>}
            </section>
          )}
        </main>

        <aside className="story-detail-aside">
          <div>
            <h2>档案位置</h2>
            <dl>
              <div><dt>时期</dt><dd>{story.era}</dd></div>
              {story.arc && <div><dt>故事线</dt><dd>{story.arc}</dd></div>}
              <div><dt>内容</dt><dd>{story.types.map((type) => ({ event: "事件", interaction: "互动", timeline: "时间线", milestone: "重要节点", performance: "舞台", daily: "日常" })[type]).join("、")}</dd></div>
            </dl>
          </div>

          <div className="story-detail-sources">
            <h2>公开来源</h2>
            {story.sources.length > 0 ? story.sources.map((source) => (
              <div className="story-source-entry" key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  <span>
                    <small>{source.kind ? sourceKindLabels[source.kind] : "公开链接"} · {getSourcePlatform(source.url)}</small>
                    {source.title}
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <div className="story-source-support">
                  {source.checkedAt && <span>最近核对 {source.checkedAt.replaceAll("-", ".")}</span>}
                  {source.availability === "unavailable" && <span>原链接已失效</span>}
                  {source.backup && <a href={source.backup.url} target="_blank" rel="noopener noreferrer">备用：{source.backup.title}</a>}
                  <SourceIssueButton storyTitle={story.title} sourceTitle={source.title} sourceUrl={source.url} />
                </div>
              </div>
            )) : <p>当前条目依据整理资料收录，原始公开链接仍在补充。</p>}
            <p className="story-detail-source-note"><strong>{confidenceLabels[story.confidence]}</strong>{confidenceNotes[story.confidence]}</p>
          </div>
        </aside>
      </div>

      {storyMemories[story.id] && <StoryEasterEgg memory={storyMemories[story.id]} />}

      {story.types.includes("performance") && (
        <StageTicketStamp story={{ slug: story.slug, title: story.title, date: story.date, summary: story.summary }} />
      )}

      {sameArcStories.length > 0 && (
        <section className="story-detail-arc" aria-labelledby="story-arc-title">
          <header>
            <p>沿着这条线继续看</p>
            <h2 id="story-arc-title">{story.arc}</h2>
          </header>
          <div>
            {sameArcStories.map((item) => (
              <Link href={`/stories/${item.slug}`} prefetch={false} key={item.id}>
                <time dateTime={item.date}>{item.date.slice(0, 10).replaceAll("-", ".")}</time>
                <strong>{item.title}</strong>
                <span>{item.summary}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {(previousStory || nextStory) && (
        <nav className="story-detail-neighbors" aria-label="前后故事">
          {previousStory ? (
            <Link href={`/stories/${previousStory.slug}`} prefetch={false}>
              <small>前一篇</small>
              <strong>{previousStory.title}</strong>
              <span>{previousStory.date.slice(0, 10).replaceAll("-", ".")}</span>
            </Link>
          ) : <span />}
          {nextStory && (
            <Link href={`/stories/${nextStory.slug}`} prefetch={false}>
              <small>后一篇</small>
              <strong>{nextStory.title}</strong>
              <span>{nextStory.date.slice(0, 10).replaceAll("-", ".")}</span>
            </Link>
          )}
        </nav>
      )}

      <footer className="story-detail-footer">
        <p>发现时间、原话或来源有误？欢迎通过页面右下角的“提意见”告诉我们。</p>
        <Link href="/stories" prefetch={false}>继续翻故事 <ArrowRight aria-hidden="true" /></Link>
      </footer>
    </article>
  );
}
