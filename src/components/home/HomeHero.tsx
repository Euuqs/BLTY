"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

interface HomeHeroProps {
  styleCount: number;
  scheduleCount: number;
  feedCount: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeHero({ styleCount, scheduleCount, feedCount }: HomeHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const photoBoundsRef = useRef<DOMRect | null>(null);
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion === true;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 72, damping: 22, mass: 0.8 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 72, damping: 22, mass: 0.8 });
  const lightPointerX = useSpring(pointerX, { stiffness: 42, damping: 20, mass: 1.15 });
  const lightPointerY = useSpring(pointerY, { stiffness: 42, damping: 20, mass: 1.15 });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const pointerIntensity = useTransform(scrollYProgress, [0, 0.55, 0.84, 1], shouldReduceMotion ? [0, 0, 0, 0] : [1, 1, 0.28, 0]);
  const photoX = useTransform(() => smoothPointerX.get() * pointerIntensity.get() * 6);
  const photoY = useTransform(() => smoothPointerY.get() * pointerIntensity.get() * 4);
  const washX = useTransform(() => smoothPointerX.get() * pointerIntensity.get() * 10);
  const washY = useTransform(() => smoothPointerY.get() * pointerIntensity.get() * 6);
  const lightX = useTransform(() => lightPointerX.get() * pointerIntensity.get() * 84);
  const lightY = useTransform(() => lightPointerY.get() * pointerIntensity.get() * 52);
  const baiWash = useTransform(smoothPointerX, [-1, 0, 1], shouldReduceMotion ? [0.05, 0.05, 0.05] : [0.16, 0.05, 0.015]);
  const zhuWash = useTransform(smoothPointerX, [-1, 0, 1], shouldReduceMotion ? [0.04, 0.04, 0.04] : [0.015, 0.04, 0.14]);
  const lightOpacity = useTransform(pointerIntensity, [0, 1], [0, 0.58]);
  const imageY = useTransform(scrollYProgress, [0, 0.15, 0.72, 1], shouldReduceMotion ? [0, 0, 0, 0] : [0, 0, 12, 16]);
  const imageScale = useTransform(scrollYProgress, [0, 0.15, 0.72, 1], shouldReduceMotion ? [1.008, 1.008, 1.008, 1.008] : [1.008, 1.008, 1.052, 1.06]);
  const transitionOpacity = useTransform(scrollYProgress, [0.7, 0.88, 1], shouldReduceMotion ? [0, 0, 0] : [0, 0.58, 1]);
  const { scrollYProgress: storyProgress } = useScroll({ target: storyRef, offset: ["start end", "end start"] });
  const storyImageScale = useTransform(storyProgress, [0, 0.58, 1], shouldReduceMotion ? [1, 1, 1] : [1.045, 1.015, 1]);
  const storyImageY = useTransform(storyProgress, [0, 1], shouldReduceMotion ? [0, 0] : [10, -8]);

  return (
    <section className="editorial-home">
      <section ref={heroRef} className="editorial-hero editorial-hero-visual" aria-label="柏欣妤与朱怡欣的故事影像">
        <motion.div
          className="editorial-photo"
          style={{ y: imageY }}
          initial={shouldReduceMotion ? false : { opacity: 0.72, scale: 0.992 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.88, ease }}
          onPointerEnter={(event) => {
            if (shouldReduceMotion || event.pointerType === "touch") return;
            photoBoundsRef.current = event.currentTarget.getBoundingClientRect();
          }}
          onPointerMove={(event) => {
            if (shouldReduceMotion || event.pointerType === "touch") return;
            const bounds = photoBoundsRef.current;
            if (!bounds) return;
            pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
            pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
          }}
          onPointerLeave={() => {
            photoBoundsRef.current = null;
            pointerX.set(0);
            pointerY.set(0);
          }}
        >
          <motion.div className="editorial-photo-inner" style={{ scale: imageScale, x: photoX, y: photoY }}>
            <Image src="/hero-wedding.jpg" alt="柏欣妤与朱怡欣婚纱合影" fill sizes="(max-width: 767px) 100vw, 70vw" className="object-cover" priority loading="eager" />
          </motion.div>
          <motion.div className="editorial-channel-wash is-bai" style={{ opacity: baiWash, x: washX, y: washY }} aria-hidden="true" />
          <motion.div className="editorial-channel-wash is-zhu" style={{ opacity: zhuWash, x: washX, y: washY }} aria-hidden="true" />
          <motion.div className="editorial-ambient-light" style={{ x: lightX, y: lightY, opacity: lightOpacity }} aria-hidden="true" />
          <div className="editorial-visual-frame" aria-hidden="true" />
          <div className="editorial-visual-haze" aria-hidden="true" />
        </motion.div>
        <motion.div className="editorial-scene-transition" style={{ opacity: transitionOpacity }} aria-hidden="true" />
      </section>

      <motion.section ref={storyRef} id="about-us" className="editorial-about" aria-labelledby="about-us-title" initial={shouldReduceMotion ? false : { opacity: 0.78 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: shouldReduceMotion ? 0.2 : 0.7, ease }}>
        <div className="editorial-about-copy">
          <p className="editorial-eyebrow">Chapter 01 · About us</p>
          <h2 id="about-us-title">关于她们</h2>
          <p className="editorial-about-lede">两份闪耀的个体 · 一个更美好的我们</p>
          <p>不同的光，汇成更亮的星河。这里记录着她们的现在，也收藏着和你一起走向未来的每一步。</p>
        </div>
        <div className="editorial-about-image">
          <motion.div className="editorial-about-image-inner" style={{ scale: storyImageScale, y: storyImageY }}>
            <Image src="/hero-wedding.jpg" alt="柏欣妤与朱怡欣" fill sizes="(max-width: 767px) 100vw, 48vw" className="object-cover" />
          </motion.div>
          <span className="editorial-about-caption" aria-hidden="true">Two lights, one story</span>
        </div>
        <div className="editorial-about-stats" aria-label="网站内容统计">
          <span><strong>{styleCount}</strong> 同款</span><span><strong>{scheduleCount}</strong> 行程</span><span><strong>{feedCount}</strong> 动态</span>
        </div>
      </motion.section>
    </section>
  );
}
