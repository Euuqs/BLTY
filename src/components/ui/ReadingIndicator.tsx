"use client";

import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function ReadingIndicator({
  title = "",
  wordCount,
}: {
  title?: string;
  wordCount?: number;
}) {
  const { scrollYProgress, scrollY } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
  });
  const percentage = useTransform(smoothProgress, (v) => Math.round(v * 100));
  const [visible, setVisible] = useState(false);

  const readingMinutes = wordCount
    ? Math.max(1, Math.round(wordCount / 400))
    : null;

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setVisible(latest > 200);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 30 }}
      transition={{ duration: 0.3 }}
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-3 pointer-events-none"
    >
      <motion.div className="relative w-10 h-10">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="oklch(0.28 0.04 285)"
            strokeWidth="3"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="url(#readingGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="100"
            style={{
              strokeDashoffset: useTransform(smoothProgress, (v) => 100 - v * 100),
            }}
          />
          <defs>
            <linearGradient id="readingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--bai)" />
              <stop offset="50%" stopColor="var(--cp)" />
              <stop offset="100%" stopColor="var(--zhu)" />
            </linearGradient>
          </defs>
        </svg>
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-foreground"
          style={{ opacity: useTransform(smoothProgress, [0, 0.5, 1], [0.5, 1, 1]) }}
        >
          <motion.span>{percentage}</motion.span>
          <span className="text-[8px] text-muted">%</span>
        </motion.span>
      </motion.div>

      {readingMinutes !== null && (
        <motion.div
          className="text-[9px] font-mono text-muted/60 text-center leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>{"\u23F1"} {readingMinutes} 分钟</div>
          <div className="text-muted/40">{title.slice(0, 6)}</div>
        </motion.div>
      )}
    </motion.div>
  );
}
