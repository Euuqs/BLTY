"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function FeedHero({ itemCount }: { itemCount: number }) {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 10]);
  const rightY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -8]);
  const imageScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.01, 1.055]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.66, 1], reduceMotion ? [1, 1, 1] : [1, 0.8, 0.44]);
  const transitionOpacity = useTransform(scrollYProgress, [0.7, 1], reduceMotion ? [0, 0] : [0, 1]);

  const portraits = [
    { src: "/static/feed/bai-personal-may-portrait.jpg", alt: "柏欣妤在咖啡馆的五月自拍", label: "柏欣妤 · 五月自拍", credit: "本人微博", source: "https://weibo.com/6375479853/QDZGD1qSs", position: "50% 42%", y: leftY },
    { src: "/static/feed/zhu-personal-0715-01.jpg", alt: "朱怡欣身穿绿色长裙站在金色花园装置前", label: "朱怡欣 · 我们缘分未尽", credit: "本人微博", source: "https://weibo.com/6224125612/R8Q3PySDX", position: "50% 34%", y: rightY },
  ];

  return (
    <header ref={heroRef} className="feed-hero" aria-labelledby="feed-page-title">
      <div className="feed-hero-portraits">
        {portraits.map((portrait, index) => (
          <motion.figure key={portrait.src} initial={reduceMotion ? false : { clipPath: index === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }} animate={{ clipPath: "inset(0 0 0 0)" }} transition={{ duration: 1.1, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div style={{ y: portrait.y, scale: imageScale }}>
              <Image src={portrait.src} alt={portrait.alt} fill priority quality={95} sizes="(max-width: 680px) 60vw, 36vw" className="object-cover" style={{ objectPosition: portrait.position }} />
            </motion.div>
            <figcaption><span>{portrait.label}</span><a href={portrait.source} target="_blank" rel="noopener noreferrer">图片：{portrait.credit}</a></figcaption>
          </motion.figure>
        ))}
      </div>
      <motion.div className="feed-hero-copy" style={{ opacity: copyOpacity }}>
        <p>§ 04 · LIVE NOTES</p>
        <motion.h1 id="feed-page-title" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>此刻，<span>正在发生。</span></motion.h1>
        <p>路透、日常与舞台记录。把散落在公开频道里的近况，按照发生时间重新剪在一起。</p>
        <div><strong>{itemCount}</strong><span>条公开动态</span></div>
      </motion.div>
      <motion.div className="feed-hero-transition" style={{ opacity: transitionOpacity }} aria-hidden="true" />
    </header>
  );
}
