"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/mascot/Mascots";

type StageVideo = { id: string; title: string; subtitle: string; image: string; imageAlt: string; credit: string; bvid: string; url: string; featured?: boolean };

const STAGE_VIDEOS: StageVideo[] = [
  { id: "full-focus", title: "杭州站全场 Focus", subtitle: "PRIVATE SIGNAL · 双人巡演完整舞台记录", image: "/static/tour/stage-full-focus.jpg", imageAlt: "柏欣妤与朱怡欣在杭州站舞台结束时与蛋糕合影", credit: "图片来源：官博", bvid: "BV1gftG6bEJh", url: "https://www.bilibili.com/video/BV1gftG6bEJh/?share_source=copy_web&vd_source=9b2b73877b97341943e40def22c2624c", featured: true },
  { id: "koi", title: "《恋》", subtitle: "双机位混剪 Focus", image: "/static/tour/stage-koi.jpg", imageAlt: "柏欣妤与朱怡欣身着白色舞台服表演《恋》", credit: "图片来源：二十七号痕迹", bvid: "BV1ZTtq6gEGd", url: "https://www.bilibili.com/video/BV1ZTtq6gEGd/?share_source=copy_web&vd_source=9b2b73877b97341943e40def22c2624c" },
  { id: "atheism", title: "《无神论》", subtitle: "双机位混剪 Focus", image: "/static/tour/stage-atheism.jpg", imageAlt: "柏欣妤与朱怡欣身着红色舞台服表演《无神论》", credit: "图片来源：二十七号痕迹", bvid: "BV1mbbp6XE9c", url: "https://www.bilibili.com/video/BV1mbbp6XE9c/?share_source=copy_web&vd_source=9b2b73877b97341943e40def22c2624c" },
];

const MEMORIES = [
  { title: "《丘比特的失误》", note: "舞台瞬间", image: "/static/tour/moment-cupid-mistake.jpg", alt: "柏欣妤与朱怡欣在粉色布景中表演《丘比特的失误》", credit: "claroscuro-" },
  { title: "花墙应援", note: "场外记忆", image: "/static/tour/memory-flower-wall.jpg", alt: "PRIVATE SIGNAL 杭州站蓝白色花墙应援布置", credit: "应援会" },
  { title: "END", note: "落幕之后", image: "/static/tour/stage-full-focus.jpg", alt: "演出结束后柏欣妤与朱怡欣在舞台上合影", credit: "官博" },
  { title: "见面会", note: "同一天的相遇", image: "/static/tour/memory-fan-meeting.jpg", alt: "柏欣妤与朱怡欣在见面会剧场座位前合影", credit: "官博" },
] as const;

const TOUR_STOPS = [
  {
    index: "01",
    date: "2025.05.24",
    city: "武汉",
    venue: "MAO Livehouse",
    title: "心跳花火",
    image: "/static/tour/heartbeat-wuhan-official-03.jpg",
    imageAlt: "心跳花火武汉站官方主题视觉，包含柏欣妤与朱怡欣双人照片",
    imageCredit: "SNH48 官方微博",
    sourceHref: "https://weibo.com/2689280541/Pt0EXvL8C",
    description: "从《First Love》到《月光下》，双人舞台、个人曲目与多轮互动组成巡演的第一站。",
    highlights: ["First Love", "Circle", "月光下"],
    storyHref: "/stories/2025-05-24-心跳花火武汉站",
    videoHref: "https://www.bilibili.com/video/BV1QYj8zFEgv/",
  },
  {
    index: "02",
    date: "2025.11.15",
    city: "厦门",
    venue: "沃克秀 LIVEHOUSE",
    title: "心跳花火",
    image: "/static/tour/heartbeat-xiamen-official-01.jpg",
    imageAlt: "心跳花火厦门站见面会，柏欣妤与朱怡欣在橙色背景前合影",
    imageCredit: "SNH48 官方微博",
    sourceHref: "https://weibo.com/2689280541/5233619074552911",
    description: "半年后的第二站加入《Whistle》《要你说爱我》《暖暖》，也留下更完整的游戏与应援现场。",
    highlights: ["Whistle", "要你说爱我", "暖暖"],
    storyHref: "/stories/2025-11-15-心跳花火厦门站",
    videoHref: "https://www.bilibili.com/video/BV1yNCYBgENz/",
  },
  {
    index: "03",
    date: "2026.08.22",
    city: "杭州",
    venue: "新天地太阳剧场",
    title: "PRIVATE SIGNAL",
    image: "/static/tour/stage-full-focus.jpg",
    imageAlt: "PRIVATE SIGNAL 杭州站演出结束后柏欣妤与朱怡欣在舞台上合影",
    imageCredit: "SNH48 官方微博",
    sourceHref: "https://weibo.com/u/2689280541",
    description: "新的巡演主题在杭州落地，舞台、MC、游戏与演后记录共同组成下一章。",
    highlights: ["恋", "无神论", "丘比特的失误"],
    storyHref: "/stories/2026-08-22-private-signal-杭州站",
    videoHref: "https://www.bilibili.com/video/BV1gftG6bEJh/",
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function StageCard({ video, index }: { video: StageVideo; index: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.a href={video.url} target="_blank" rel="noopener noreferrer" className={`tour-stage-card ${video.featured ? "tour-stage-card-featured" : ""}`} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65, delay: index * 0.06, ease }} aria-label={`${video.title}，前往哔哩哔哩观看（新窗口）`}>
      <div className="tour-stage-media"><Image src={video.image} alt={video.imageAlt} fill sizes={video.featured ? "(max-width: 767px) 100vw, 64vw" : "(max-width: 767px) 100vw, 34vw"} className="object-cover" /><span className="tour-stage-pill">BILIBILI VIDEO</span></div>
      <div className="tour-stage-copy">
        <p className="tour-kicker">柏欣妤 × 朱怡欣 · 2026.08.22</p>
        <div className="tour-stage-title-row"><h3>{video.title}</h3><span className="tour-external" aria-hidden="true"><ArrowUpRight /></span></div>
        <p>{video.subtitle}</p>
        <div className="tour-stage-meta"><span>视频：白白的猪饲养bot</span><span>{video.credit}</span><span className="tour-stage-bvid">{video.bvid}</span></div>
      </div>
    </motion.a>
  );
}

export function TourClient() {
  const heroRef = useRef<HTMLElement>(null);
  const photoBoundsRef = useRef<DOMRect | null>(null);
  const reduceMotion = useReducedMotion() === true;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 62, damping: 24, mass: 0.65 });
  const smoothY = useSpring(pointerY, { stiffness: 62, damping: 24, mass: 0.65 });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const pointerIntensity = useTransform(scrollYProgress, [0, 0.58, 0.88, 1], reduceMotion ? [0, 0, 0, 0] : [1, 1, 0.24, 0]);
  const imageX = useTransform(() => smoothX.get() * 5 * pointerIntensity.get());
  const pointerImageY = useTransform(() => smoothY.get() * 3 * pointerIntensity.get());
  const scrollImageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 14]);
  const imageY = useTransform(() => pointerImageY.get() + scrollImageY.get());
  const imageScale = useTransform(scrollYProgress, [0, 0.18, 1], reduceMotion ? [1, 1, 1] : [1.01, 1.01, 1.065]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.62, 1], reduceMotion ? [1, 1, 1] : [1, 0.84, 0.46]);
  const copyY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -12]);
  const transitionOpacity = useTransform(scrollYProgress, [0.7, 1], reduceMotion ? [0, 0] : [0, 1]);

  const updatePointer = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const bounds = photoBoundsRef.current;
    if (!bounds) return;
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  };

  return (
    <div className="tour-archive">
      <section ref={heroRef} className="tour-hero" aria-labelledby="tour-title">
        <motion.div className="tour-hero-copy" style={{ opacity: copyOpacity, y: copyY }} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }}>
          <div className="tour-status"><i /> 三场演出已收录</div>
          <p className="tour-kicker">TOUR ARCHIVE · 2025—2026</p>
          <h1 id="tour-title">三座城市，<br /><span>一路都有回声。</span></h1>
          <p className="tour-hero-lede">柏欣妤 × 朱怡欣 双人巡演档案</p>
          <dl className="tour-facts"><div><dt>YEARS</dt><dd>2025—2026</dd></div><div><dt>CITIES</dt><dd>武汉 · 厦门 · 杭州</dd></div><div><dt>STOPS</dt><dd>03</dd></div></dl>
          <div className="tour-actions"><a href="#tour-route" className="tour-primary">沿着巡演路线看 <ArrowRight /></a><a href="#featured-stages" className="tour-secondary">看杭州精选舞台 <ArrowRight /></a></div>
        </motion.div>
        <motion.div
          className="tour-hero-image"
          initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.15, delay: 0.08, ease }}
          onPointerEnter={(event) => { photoBoundsRef.current = event.currentTarget.getBoundingClientRect(); }}
          onPointerMove={updatePointer}
          onPointerLeave={() => { pointerX.set(0); pointerY.set(0); photoBoundsRef.current = null; }}
        >
          <motion.div className="tour-hero-image-inner" style={{ x: imageX, y: imageY, scale: imageScale }}>
            <Image src="/static/tour/stage-full-focus.jpg" alt="PRIVATE SIGNAL 杭州站演出结束后柏欣妤与朱怡欣在舞台上合影" fill priority loading="eager" fetchPriority="high" sizes="(max-width: 860px) 100vw, 54vw" className="object-cover" />
          </motion.div>
          <span>PHOTO · 官博</span>
          <motion.i className="tour-hero-transition" style={{ opacity: transitionOpacity }} aria-hidden="true" />
        </motion.div>
      </section>

      <section id="tour-route" className="tour-section tour-route-section" aria-labelledby="route-heading">
        <header className="tour-section-heading"><div><p className="tour-kicker">THREE STOPS · 01</p><h2 id="route-heading">从武汉，到厦门，再到杭州</h2></div><p>不是三张孤立的演出卡片，而是一条跨过两年的舞台路线。每一站都可以继续进入事实档案，或直接回到完整影像。</p></header>
        <div className="tour-route" role="list">
          {TOUR_STOPS.map((stop, index) => (
            <motion.article className="tour-stop" key={`${stop.date}-${stop.city}`} role="listitem" initial={reduceMotion ? false : { opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.58, delay: index * 0.08, ease }}>
              <div className="tour-stop-marker" aria-hidden="true"><span>{stop.index}</span><i /></div>
              <div className="tour-stop-meta"><time dateTime={stop.date.replaceAll(".", "-")}>{stop.date}</time><span>{stop.city} · {stop.venue}</span></div>
              <div className="tour-stop-story">
                <figure className="tour-stop-photo">
                  <div><Image src={stop.image} alt={stop.imageAlt} fill sizes="(max-width: 620px) calc(100vw - 4.25rem), (max-width: 860px) 55vw, 30vw" className="object-cover" /></div>
                  <figcaption>图片来源：<a href={stop.sourceHref} target="_blank" rel="noopener noreferrer">{stop.imageCredit} <ArrowUpRight aria-hidden="true" /></a></figcaption>
                </figure>
                <p>{index < 2 ? "心跳花火巡演" : "PRIVATE SIGNAL 巡演"}</p><h3>{stop.title} · {stop.city}站</h3><div>{stop.description}</div><ul aria-label="代表曲目">{stop.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="tour-stop-actions"><Link href={stop.storyHref} prefetch={false}>读这一站的档案 <ArrowRight aria-hidden="true" /></Link><a href={stop.videoHref} target="_blank" rel="noopener noreferrer">看完整影像 <ArrowUpRight aria-hidden="true" /></a></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="featured-stages" className="tour-section" aria-labelledby="featured-heading">
        <header className="tour-section-heading"><div><p className="tour-kicker">HANGZHOU SELECTION · 02</p><h2 id="featured-heading">杭州站精选舞台</h2></div><p>三段真实影像，回到 PRIVATE SIGNAL 杭州站仍在发光的每一个瞬间。点击卡片将前往 B 站原视频。</p></header>
        <div className="tour-stage-grid">{STAGE_VIDEOS.map((video, index) => <StageCard key={video.id} video={video} index={index} />)}</div>
      </section>

      <section className="tour-section tour-memory-section" aria-labelledby="memory-heading">
        <header className="tour-section-heading"><div><p className="tour-kicker">HANGZHOU MEMORIES · 03</p><h2 id="memory-heading">杭州那一天</h2></div><p>舞台之外，也收藏花墙、见面会与落幕后的安静回声。</p></header>
        <div className="tour-memory-grid">{MEMORIES.map((item, index) => <motion.figure key={item.title} className={`tour-memory-card tour-memory-${index + 1}`} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6, delay: index * 0.05, ease }}><div className="tour-memory-media"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></div><figcaption><div><span>{item.note}</span><h3>{item.title}</h3></div><p>图片来源：{item.credit}</p></figcaption></motion.figure>)}</div>
      </section>

      <section className="tour-credits" aria-labelledby="credits-heading"><p className="tour-kicker">CREDITS · 04</p><h2 id="credits-heading">关于这些记录</h2><div><p>武汉站影像来自「星屿耀-」，厦门站与杭州站完整记录来自「白白的猪饲养bot」。本页只整理索引，观看均跳转至原视频，不下载、不镜像，也不主张视频版权。</p><p>杭州站照片署名分别为二十七号痕迹、claroscuro-、官博与应援会。感谢每一位记录者，让三座城市的舞台有迹可循。</p></div></section>
    </div>
  );
}
