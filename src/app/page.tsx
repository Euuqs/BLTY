import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "@/components/mascot/Mascots";
import { HomeHero } from "@/components/home/HomeHero";
import { ChannelDivider } from "@/components/home/ChannelDivider";
import { SignalTimeline, type SignalMoment, type SignalSideTrack } from "@/components/home/SignalTimeline";
import { BirthdayCountdown } from "@/components/ui/BirthdayCountdown";
import { Reveal } from "@/components/ui/Reveal";
import { TourHighlight } from "@/components/tour/TourHighlight";
import { HomeFanSections } from "@/components/home/HomeFanSections";
import { SectionIndicator } from "@/components/ui/SectionIndicator";
import {
  publishedFeeds as feeds,
  publishedSameStyles as sameStyles,
  publishedSchedules as schedules,
} from "@/lib/velite";
import { formatMonthDay } from "@/lib/date";

export default function Home() {
  const timelineMoments: SignalMoment[] = [
    {
      id: "2026-team-fourth-anniversary",
      date: "2026-02-27",
      title: "组队四周年",
      detailUrl: "/stories/2026-02-27-组队四周年",
      summary: "以双人直播与公开周年内容回看一路以来的舞台和相处变化；2月26日直播独立记录，不定义为提前庆祝。",
      confidence: "confirmed",
      sourceUrl: "https://search.bilibili.com/all?keyword=%E6%9F%8F%E9%87%8C%E6%8C%91%E6%80%A1%202026%20%E5%9B%9B%E5%91%A8%E5%B9%B4%20%E7%9B%B4%E6%92%AD",
      sourceLabel: "查看完整录屏索引",
    },
    {
      id: "2026-golden-song",
      date: "2026-03-14",
      title: "《爱到世界尽头》金曲舞台",
      detailUrl: "/stories/2026-03-14-爱到世界尽头金曲舞台",
      summary: "第十二届金曲大赏共同舞台，延续从《First Love》到新一年合作舞台的故事。",
      confidence: "confirmed",
      sourceUrl: "https://www.bilibili.com/video/BV13uwSz7Efy/",
      sourceLabel: "查看舞台记录",
    },
    {
      id: "2026-april-birthday",
      date: "2026-04-22",
      title: "把听见的愿望变成礼物",
      detailUrl: "/stories/2026-04-22-把听见的愿望变成礼物",
      summary: "柏欣妤准备了朱怡欣提过的双肩包和亲自配置的电脑，并说“永远做小女孩”。",
      quote: "永远做小女孩",
      confidence: "confirmed",
      sourceUrl: "https://www.bilibili.com/video/BV1erdQBrEAk/",
      sourceLabel: "查看送礼片段",
    },
    {
      id: "2026-birthday-performances",
      date: "2026-07-11",
      title: "两场生日定制活动，彼此登场",
      detailUrl: "/stories/2026-07-11-两场生日定制活动彼此登场",
      summary: "《以心为注》与《当我们一起走过》各有一个双人舞台和一个PV；前者另有柏欣妤读信环节。",
      confidence: "confirmed",
      sourceUrl: "https://www.bilibili.com/video/BV1dPNo6eEru/",
      sourceLabel: "查看官方完整公演",
    },
    {
      id: "2026-private-signal-announcement",
      date: "2026-07-17",
      title: "PRIVATE SIGNAL 杭州站官宣",
      detailUrl: "/stories/2026-07-17-private-signal-杭州站官宣",
      summary: "两人同日发布邀请，把一路以来的舞台、默契与属于现场的讯号带到杭州。",
      confidence: "confirmed",
      sourceUrl: "https://weibo.com/6224125612/R96gL2Fb2",
      sourceLabel: "查看本人官宣",
    },
    {
      id: "2026-private-signal-hangzhou",
      date: "2026-08-22",
      title: "PRIVATE SIGNAL · 杭州",
      detailUrl: "/stories/2026-08-22-private-signal-杭州站",
      summary: "双人巡演正式落地杭州；完整舞台、MC、游戏和演后VLOG共同组成这一年的组合事业主线。",
      image: "/static/tour/stage-full-focus.jpg",
      imageAlt: "PRIVATE SIGNAL 杭州站演出结束后，柏欣妤与朱怡欣在舞台上合影",
      confidence: "confirmed",
      sourceUrl: "https://www.bilibili.com/video/BV1gftG6bEJh/",
      sourceLabel: "查看全场记录",
    },
  ];
  const timelineSideTracks: SignalSideTrack[] = [
    {
      id: "bai",
      name: "柏欣妤",
      colorLabel: "白色频道",
      summary: "只记录独立事业成果；与朱怡欣产生明确交集的舞台再汇入紫色主线。",
      moments: [
        { date: "2026-06-27", title: "TEAM NII 新公演《肆时墟》首演" },
        { date: "2026-07-25", title: "《当我们一起走过》音乐舞台畅享会" },
        { date: "2026-08-08", title: "年度青春盛典个人舞台与成绩" },
      ],
    },
    {
      id: "zhu",
      name: "朱怡欣",
      colorLabel: "蓝色频道",
      summary: "保留独立比赛与舞台成长；共同发生的事件仍由紫色主线承接。",
      moments: [
        { date: "2026-06-24", title: "《豪歌2026》战队争锋赛《虫之诗》" },
        { date: "2026-07-24", title: "《豪歌2026》巅峰争夺战《漂浮的蒲公英》" },
        { date: "2026-08-08", title: "年度青春盛典个人舞台与成绩" },
      ],
    },
  ];
  const latestFeeds = [...feeds]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const navSections = [
    { id: "hero", label: "首页" },
    { id: "storyline", label: "故事" },
    { id: "countdown", label: "生日" },
    { id: "tour", label: "巡演" },
    { id: "insights", label: "近况" },
    { id: "profile", label: "档案" },
    { id: "social", label: "社交" },
    { id: "guide", label: "导流" },
    { id: "join", label: "应援" },
  ];

  return (
    <div className="home-page flex flex-col gap-8 lg:gap-10">
      <SectionIndicator sections={navSections} />
      <div id="hero" className="scroll-target">
        <HomeHero
          styleCount={sameStyles.length}
          scheduleCount={schedules.length}
          feedCount={feeds.length}
        />
      </div>

      <div id="storyline" className="scroll-target home-content-section">
        <SignalTimeline moments={timelineMoments} sideTracks={timelineSideTracks} />
      </div>

      {/* ===== 生日倒计时 ===== */}
      <div id="countdown" className="scroll-target home-content-section">
        <ChannelDivider label="MEMORY SIGNAL" note="三个重要的日子" tone="fan" />
        <Reveal>
          <BirthdayCountdown />
        </Reveal>
      </div>

      {/* ===== 巡演宣传 ===== */}
      <div id="tour" className="scroll-target home-content-section">
        <ChannelDivider label="STAGE SIGNAL" note="舞台与共同奔赴" />
        <Reveal delay={0.05}>
          <TourHighlight />
        </Reveal>
      </div>

      {/* ===== 粉丝近况与补档入口 ===== */}
      <div id="insights" className="scroll-target home-content-section">
        <ChannelDivider label="最近发生" note="动态与行程持续更新" tone="zhu" />
        <Reveal delay={0.05}>
          <section className="fan-now" aria-labelledby="fan-now-title">
            <header className="fan-now-heading">
              <p>给刚来的人，也给回来补课的人</p>
              <h2 id="fan-now-title">不用翻遍全网，<br />先从这里追上近况。</h2>
              <div className="fan-now-heading-copy">
                <p>把最近的重要动态、舞台和行程放在一起。每一条都尽量留下出处，方便继续往下看。</p>
                <div className="fan-now-actions">
                  <Link href="/feed" prefetch={false}>看完整动态 <ArrowRight aria-hidden="true" /></Link>
                  <Link href="/schedule" prefetch={false}>查看近期行程</Link>
                </div>
              </div>
            </header>

            <div className="fan-now-body">
              <ol className="fan-now-feed" aria-label="最近三条动态">
                {latestFeeds.map((item, index) => (
                  <li key={item.slug ?? `${item.date}-${index}`}>
                    <Link href="/feed" prefetch={false} className="fan-now-item">
                      <span className="fan-now-date">{formatMonthDay(item.date)}</span>
                      <span className={`fan-now-member fan-now-member-${item.member}`}>
                        {item.member === "A" ? "柏欣妤" : item.member === "B" ? "朱怡欣" : "两个人"}
                      </span>
                      <span className="fan-now-story">
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ol>

              <aside className="fan-now-guide" aria-label="新粉补档建议">
                <span className="fan-now-handwriting">第一次来？</span>
                <h3>按你现在最想知道的开始</h3>
                <nav>
                  <Link href="/start" prefetch={false}><em>01</em><span>第一次来，想先快速认识她们</span></Link>
                  <Link href="/tour" prefetch={false}><em>02</em><span>想看最近的双人舞台</span></Link>
                  <Link href="/same-styles" prefetch={false}><em>03</em><span>想翻翻她们出现过的同款</span></Link>
                </nav>
                <p>不必按顺序读。故事会一直补，错漏也会持续修正。</p>
              </aside>
            </div>
          </section>
        </Reveal>
      </div>

      <HomeFanSections />
    </div>
  );
}
