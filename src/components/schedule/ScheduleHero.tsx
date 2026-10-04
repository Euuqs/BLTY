"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function ScheduleHero({ itemCount }: { itemCount: number }) {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.01, 1.065]);
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 12]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.68, 1], reduceMotion ? [1, 1, 1] : [1, 0.82, 0.48]);
  const transitionOpacity = useTransform(scrollYProgress, [0.68, 1], reduceMotion ? [0, 0] : [0, 1]);

  return (
    <header ref={heroRef} className="schedule-hero" aria-labelledby="schedule-page-title">
      <motion.div className="schedule-hero-photo" initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div style={{ scale: imageScale, y: imageY }}>
          <Image src="/static/hero/stage-hero.jpg" alt="柏欣妤与朱怡欣舞台现场" fill priority sizes="(max-width: 680px) 100vw, 56vw" className="object-cover" />
        </motion.div>
        <span aria-hidden="true">NEXT SCENE · LIVE & STAGE</span>
        <motion.i style={{ opacity: transitionOpacity }} aria-hidden="true" />
      </motion.div>
      <motion.div className="schedule-hero-copy" style={{ opacity: copyOpacity }}>
        <motion.p initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>§ 03 · SCHEDULE</motion.p>
        <motion.h1 id="schedule-page-title" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}>下一站，<span>见。</span></motion.h1>
        <p>综艺、直播、演出与线下活动。把还未发生的期待，安静地放进同一条时间线。</p>
        <div><strong>{itemCount}</strong><span>项公开行程记录</span></div>
      </motion.div>
    </header>
  );
}
