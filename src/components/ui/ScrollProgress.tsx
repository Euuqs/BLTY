"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[60] bg-gradient-to-r from-bai via-cp to-zhu"
    />
  );
}

export function ScrollMascot() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "calc(100vw - 60px)"]);
  const bounce = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 15,
  });

  return (
    <motion.div
      style={{ x, rotate, scale: bounce }}
      className="fixed top-2 z-[59] pointer-events-none text-sm"
      aria-hidden
    >
      {"\u{1F43E}"}
    </motion.div>
  );
}
