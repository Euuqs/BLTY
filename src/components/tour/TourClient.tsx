"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
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
  const reduceMotion = useReducedMotion();
  return (
    <div className="tour-archive">
      <section className="tour-hero" aria-labelledby="tour-title">
        <motion.div className="tour-hero-copy" initial={reduceMotion ? false : { y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease }}>
          <div className="tour-status"><i /> 演出已结束</div>
          <p className="tour-kicker">PRIVATE SIGNAL · STAGE ARCHIVE</p>
          <h1 id="tour-title">演出已落幕，<br /><span>舞台仍在发光。</span></h1>
          <p className="tour-hero-lede">柏欣妤 × 朱怡欣 双人巡演 · 杭州站</p>
          <dl className="tour-facts"><div><dt>DATE</dt><dd>2026.08.22</dd></div><div><dt>CITY</dt><dd>杭州</dd></div><div><dt>VIDEOS</dt><dd>03</dd></div></dl>
          <div className="tour-actions"><a href={STAGE_VIDEOS[0].url} target="_blank" rel="noopener noreferrer" className="tour-primary">从第一支舞台开始看 <ArrowUpRight /></a><a href="#featured-stages" className="tour-secondary">浏览全部舞台 <ArrowRight /></a></div>
        </motion.div>
        <motion.div className="tour-hero-image" initial={reduceMotion ? false : { scale: 0.992 }} animate={{ scale: 1 }} transition={{ duration: 0.75, ease }}>
          <Image src="/static/tour/stage-full-focus.jpg" alt="PRIVATE SIGNAL 杭州站演出结束后柏欣妤与朱怡欣在舞台上合影" fill priority loading="eager" fetchPriority="high" sizes="(max-width: 860px) 100vw, 54vw" className="object-cover" /><span>PHOTO · 官博</span>
        </motion.div>
      </section>

      <section id="featured-stages" className="tour-section" aria-labelledby="featured-heading">
        <header className="tour-section-heading"><div><p className="tour-kicker">SELECTED STAGES · 01</p><h2 id="featured-heading">精选舞台</h2></div><p>三段真实影像，回到那晚仍在发光的每一个瞬间。点击卡片将前往 B 站原视频。</p></header>
        <div className="tour-stage-grid">{STAGE_VIDEOS.map((video, index) => <StageCard key={video.id} video={video} index={index} />)}</div>
      </section>

      <section className="tour-section tour-memory-section" aria-labelledby="memory-heading">
        <header className="tour-section-heading"><div><p className="tour-kicker">MEMORIES · 02</p><h2 id="memory-heading">那一天</h2></div><p>舞台之外，也收藏花墙、见面会与落幕后的安静回声。</p></header>
        <div className="tour-memory-grid">{MEMORIES.map((item, index) => <motion.figure key={item.title} className={`tour-memory-card tour-memory-${index + 1}`} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6, delay: index * 0.05, ease }}><div className="tour-memory-media"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></div><figcaption><div><span>{item.note}</span><h3>{item.title}</h3></div><p>图片来源：{item.credit}</p></figcaption></motion.figure>)}</div>
      </section>

      <section className="tour-credits" aria-labelledby="credits-heading"><p className="tour-kicker">CREDITS · 03</p><h2 id="credits-heading">关于这些记录</h2><div><p>视频由 B 站账号「白白的猪饲养bot」发布。本页仅整理舞台索引，所有观看行为均跳转至原视频，不下载、不镜像，也不主张视频版权。</p><p>照片署名分别为二十七号痕迹、claroscuro-、官博与应援会。感谢每一位记录者，让那一天有迹可循。</p></div></section>
    </div>
  );
}
