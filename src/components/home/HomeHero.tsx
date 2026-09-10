"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "@/components/mascot/Mascots";

interface HomeHeroProps {
  styleCount: number;
  scheduleCount: number;
  feedCount: number;
  categories: { label: string; count: number }[];
  categoryTotal: number;
  latestDate: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeHero({ styleCount, scheduleCount, feedCount }: HomeHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 42]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.015, reduceMotion ? 1.015 : 1.075]);

  const rise = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.72, ease } } };

  return (
    <section ref={heroRef} className="editorial-home">
      <div className="editorial-hero">
        <motion.div className="editorial-copy" initial={reduceMotion ? false : "hidden"} animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } } }}>
          <motion.p className="editorial-eyebrow" variants={rise}>For a brighter tomorrow</motion.p>
          <motion.h1 variants={rise}>柏里挑<span>怡</span></motion.h1>
          <motion.p className="editorial-lede" variants={rise}>因为有你 · 所以更好</motion.p>
          <motion.div className="editorial-rule" variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.85, ease } } }} />
          <motion.p className="editorial-body" variants={rise}>
            在平行的世界里相遇，在同一片星光下闪耀。<br />谢谢你们，让喜欢变成了更温暖的事。
          </motion.p>
          <motion.div className="editorial-actions" variants={rise}>
            <Link className="editorial-primary" href="/tour" prefetch={false}>一起走下去 <ArrowRight className="h-4 w-4" /></Link>
            <a className="editorial-secondary" href="#about-us">了解她们</a>
          </motion.div>
          <motion.p className="editorial-script" aria-hidden="true" variants={rise}>Same dreams,<br />brighter together.</motion.p>
        </motion.div>

        <motion.div className="editorial-photo" style={{ y: imageY }} initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease }}>
          <motion.div className="editorial-photo-inner" style={{ scale: imageScale }}>
            <Image src="/hero-wedding.jpg" alt="柏欣妤与朱怡欣婚纱合影" fill sizes="(max-width: 767px) 100vw, 70vw" className="object-cover" priority loading="eager" />
          </motion.div>
          <p className="editorial-photo-note" aria-hidden="true">Be together<br />Always</p>
          <div className="editorial-since" aria-label="自 2020 年起">Since <i /> 2020</div>
        </motion.div>
      </div>

      <motion.section id="about-us" className="editorial-about" initial={reduceMotion ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease }}>
        <div className="editorial-about-copy">
          <p className="editorial-eyebrow">About us</p>
          <h2>关于她们</h2>
          <p className="editorial-about-lede">两份闪耀的个体 · 一个更美好的我们</p>
          <p>不同的光，汇成更亮的星河。这里记录着她们的现在，也收藏着和你一起走向未来的每一步。</p>
        </div>
        <div className="editorial-about-image"><Image src="/hero-wedding.jpg" alt="柏欣妤与朱怡欣" fill sizes="(max-width: 767px) 100vw, 48vw" className="object-cover" /></div>
        <div className="editorial-about-stats" aria-label="网站内容统计">
          <span><strong>{styleCount}</strong> 同款</span><span><strong>{scheduleCount}</strong> 行程</span><span><strong>{feedCount}</strong> 动态</span>
        </div>
      </motion.section>
    </section>
  );
}
