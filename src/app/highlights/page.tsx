import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/mascot/Mascots";
import { publishedStories } from "@/lib/velite";

export const metadata: Metadata = {
  title: "经典舞台与重要节点",
  description: "从公开记录中选出少量代表舞台与重要节点，适合第一次补档或想快速回看的读者。",
};

const selections = [
  { id: "story-20220227-best-partner-invitation", note: "故事从一次明确的组队邀请开始。" },
  { id: "story-20220310-first-two-person-photo", note: "第一次见面留下了第一张双人合照。" },
  { id: "story-20220312-first-joint-livestream", note: "第一次一起面对镜头，也第一次让大家听见她们的相处。" },
  { id: "story-2026-golden-song", note: "几年以后，她们继续把共同经历留在舞台上。" },
  { id: "story-2026-april-gift", note: "听见对方说过的话，并把它认真放进一份礼物里。" },
  { id: "story-2026-birthday-performances", note: "两场生日定制演出，各自为彼此留出一个位置。" },
  { id: "story-2026-private-signal-announcement", note: "属于双人巡演的讯号第一次公开发出。" },
  { id: "story-2026-private-signal-hangzhou", note: "从邀请走到现场，这条舞台线终于在杭州落地。" },
];

export default function HighlightsPage() {
  const stories = selections
    .map((selection) => {
      const story = publishedStories.find((item) => item.id === selection.id);
      return story ? { ...selection, story } : undefined;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <article className="highlights-page">
      <header className="highlights-hero">
        <div>
          <p>如果只想先记住几个瞬间</p>
          <h1>经典舞台<br />与重要节点</h1>
          <p className="highlights-hero-copy">这不是排名，也不是全部故事。这里只选少量具有公开记录、能够继续查找来源的节点。</p>
          <a href="#highlights-list">开始翻阅 <ArrowRight aria-hidden="true" /></a>
        </div>
        <figure>
          <Image src="/static/tour/stage-full-focus.jpg" alt="柏欣妤与朱怡欣在舞台上合影" fill priority sizes="(max-width: 760px) 100vw, 50vw" className="object-cover" />
        </figure>
      </header>

      <section className="highlights-intro">
        <h2>八个瞬间，两种读法</h2>
        <p>可以按时间一路读下去，也可以只打开吸引你的标题。每一篇都保留核对状态和公开来源，不用先接受任何关系结论。</p>
      </section>

      <section className="highlights-list" id="highlights-list" aria-label="精选故事">
        {stories.map(({ story, note }, index) => (
          <article key={story.id}>
            <div className="highlights-index">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <time dateTime={story.date}>{story.date.slice(0, 10).replaceAll("-", ".")}</time>
            </div>
            <div className="highlights-copy">
              <p>{note}</p>
              <h2>{story.title}</h2>
              <div>{story.summary}</div>
              <Link href={`/stories/${story.slug}`} prefetch={false}>查看记录与来源 <ArrowRight aria-hidden="true" /></Link>
            </div>
          </article>
        ))}
      </section>

      <footer className="highlights-footer">
        <p>还想继续往前或往后翻？完整档案里收录了更多日常、互动与待核对记录。</p>
        <Link href="/stories#archive" prefetch={false}>进入完整档案 <ArrowRight aria-hidden="true" /></Link>
      </footer>
    </article>
  );
}
