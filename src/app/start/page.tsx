import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/mascot/Mascots";

export const metadata: Metadata = {
  title: "10 分钟认识她们",
  description: "用几段简短的故事与影像，认识柏欣妤与朱怡欣。",
};

const chapters = [
  {
    index: "01",
    eyebrow: "先认人 · 柏欣妤",
    title: "清爽小狗，也可以是很漂亮的姐姐",
    summary: "1997 年 1 月 25 日出生，现为 SNH48 Team NII 成员。她直率、热烈，舞台上有很利落的一面；换一种造型，又会显出完全不同的漂亮。先从人物本身开始，而不是急着给两人的关系下结论。",
    note: "记住三个词就好：坦率、行动派、舞台反差。",
  },
  {
    index: "02",
    eyebrow: "再认人 · 朱怡欣",
    title: "浓颜、从容，还有很自然的幽默感",
    summary: "1998 年 4 月 22 日出生，来自 GNZ48 Team Z，同时兼任 SNH48 Team NII。镜头里的她常常漂亮得很有距离感，开口以后却松弛又好笑。先把她当作一个完整的人认识，后面的相处才会更好懂。",
    note: "再记住三个词：从容、敏感、会接住气氛。",
  },
  {
    index: "03",
    eyebrow: "故事起点 · 最佳拍档",
    title: "一次组队邀请，让两个异地的人开始靠近",
    summary: "2022 年最佳拍档组队，是新粉最需要知道的起点。她们不在同一座城市，也不是一开始就拥有现成的默契；邀请、连麦和一日心愿，把最初那段略显青涩的相处留了下来。",
    note: "不用背时间线。先记住：她们是在共同完成一件事的过程中熟悉起来的。",
    href: "/stories/2022-02-27-最佳拍档组队邀请与红玫瑰",
    linkLabel: "看组队起点",
  },
  {
    index: "04",
    eyebrow: "前期相处 · 登堂入室",
    title: "从有点客气，到进入彼此的日常",
    summary: "《关于绿茶如何登堂入室》把前期相处剪得很轻巧：主动靠近、试探边界、逐渐熟悉。它好看的地方不是替她们定义什么，而是几分钟里就能看见性格差异——一个更直接，一个很会顺着气氛把话接住。",
    note: "这是一支有观点的粉丝剪辑；具体事实仍以原始直播和官方内容为准。",
    href: "https://search.bilibili.com/all?keyword=%E6%9F%8F%E6%AC%A3%E5%A6%A4x%E6%9C%B1%E6%80%A1%E6%AC%A3%20%E5%85%B3%E4%BA%8E%E7%BB%BF%E8%8C%B6%E5%A6%82%E4%BD%95%E7%99%BB%E5%A0%82%E5%85%A5%E5%AE%A4",
    linkLabel: "去 B 站看这段剪辑",
    external: true,
  },
  {
    index: "05",
    eyebrow: "再看一眼 · 第三年的记录",
    title: "真正让人留下来的，是时间里的熟悉",
    summary: "不必一开始就读完一整部大事记。第三年的记录把舞台、直播和相处碎片放在一起：比起某个孤立的高糖瞬间，更容易让人看懂她们为什么会越来越自然。",
    note: "看到这里，你已经足够进入完整档案；剩下的故事可以按兴趣慢慢补。",
    href: "https://www.bilibili.com/video/BV1vtPpeoEJ3/",
    linkLabel: "看第三年的记录",
    external: true,
  },
];

export default function StartPage() {
  return (
    <article className="start-page">
      <header className="start-hero">
        <div>
          <p>给第一次点进来的你</p>
          <h1>10 分钟<br />认识她们</h1>
          <p className="start-hero-deck">不背年表。先认清两个各自有趣的人，再看她们怎样从青涩走到熟悉。</p>
          <a href="#start-reading">开始看片 <ArrowRight aria-hidden="true" /></a>
        </div>
        <figure>
          <Image src="/static/tour/stage-full-focus.jpg" alt="柏欣妤与朱怡欣在舞台上合影" fill priority sizes="(max-width: 760px) 100vw, 48vw" className="object-cover" />
        </figure>
      </header>

      <section className="start-preface">
        <h2>这次不从时间线开始</h2>
        <p>先分别认识她们，再看几段双人故事。不急着记住所有日期，也不用立刻读完全部档案；让人物与相处先留下印象，再按自己的兴趣慢慢往后走。</p>
      </section>

      <section className="start-chapters" id="start-reading" aria-label="快速补档路线">
        {chapters.map((chapter) => (
          <article className="start-chapter" key={chapter.index}>
            <div className="start-chapter-date">
              <span>{chapter.index}</span>
              <time>{chapter.eyebrow}</time>
            </div>
            <div className="start-chapter-copy">
              <p>{chapter.note}</p>
              <h2>{chapter.title}</h2>
              <div>{chapter.summary}</div>
              {chapter.href && (chapter.external ? (
                <a href={chapter.href} target="_blank" rel="noreferrer">{chapter.linkLabel} <ArrowRight aria-hidden="true" /></a>
              ) : (
                <Link href={chapter.href} prefetch={false}>{chapter.linkLabel} <ArrowRight aria-hidden="true" /></Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <footer className="start-finish">
        <figure>
          <Image src="/static/mascots/casual-theater.jpg" alt="柏欣妤与朱怡欣在剧场合影" fill sizes="(max-width: 760px) 100vw, 45vw" className="object-cover" />
        </figure>
        <div>
          <p>十分钟只负责把门推开一点。</p>
          <h2>觉得有趣，再顺着她们共同走过的年份慢慢看。</h2>
          <div>
            <Link href="/stories" prefetch={false}>进入完整档案 <ArrowRight aria-hidden="true" /></Link>
            <Link href="/feed" prefetch={false}>看看最近动态</Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
