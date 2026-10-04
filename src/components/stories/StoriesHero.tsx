"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function StoriesHero({ storyCount }: { storyCount: number }) {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1.015, 1.07],
  );
  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 14]);
  const copyY = useTransform(scrollYProgress, [0, 0.8], reduceMotion ? [0, 0] : [0, -12]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.62, 1], reduceMotion ? [1, 1, 1] : [1, 0.82, 0.48]);
  const transitionOpacity = useTransform(scrollYProgress, [0.68, 1], reduceMotion ? [0, 0] : [0, 1]);

  return (
    <header ref={heroRef} className="stories-hero" aria-labelledby="stories-page-title">
      <motion.div className="stories-hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          所有故事，都从可以找到的记录开始
        </motion.p>
        <motion.h1
          id="stories-page-title"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          故事档案
        </motion.h1>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.28 }}
        >
          <p>这里收录公开发生过的舞台、互动与重要节点。事实、解释和粉丝感受会被分开书写。</p>
          <span>{storyCount} 篇公开记录</span>
        </motion.div>
      </motion.div>

      <motion.figure
        initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1.15, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="stories-hero-image" style={{ scale: imageScale, y: imageY }}>
          <Image
            src="/static/mascots/casual-theater.jpg"
            alt="柏欣妤与朱怡欣在剧场合影"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 46vw"
            className="object-cover"
          />
        </motion.div>
        <div className="stories-hero-caption" aria-hidden="true">
          <span>ARCHIVE · PUBLIC RECORDS</span>
          <span>SCROLL TO OPEN</span>
        </div>
        <motion.div className="stories-hero-transition" style={{ opacity: transitionOpacity }} aria-hidden="true" />
      </motion.figure>
    </header>
  );
}
