"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "motion/react";
import { useFeedback } from "./FeedbackProvider";

export function BackToTop() {
  const [show, setShow] = useState(false);
  const [mood, setMood] = useState<"idle" | "happy" | "love">("idle");
  const { scrollY } = useScroll();
  const { spawnParticles, createRipple } = useFeedback();

  useEffect(() => {
    return scrollY.on("change", (v) => {
      setShow(v > 400);
      if (v > 1500) setMood("love");
      else if (v > 800) setMood("happy");
      else setMood("idle");
    });
  }, [scrollY]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e as unknown as React.MouseEvent<HTMLElement>);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      spawnParticles(window.innerWidth / 2, window.innerHeight - 100, "hearts", 8);
    }, 500);
  };

  const moods = {
    idle: { emoji: "\u{1F43E}", label: "回到顶部" },
    happy: { emoji: "\u{1F60A}", label: "你滑了好多！" },
    love: { emoji: "\u{1F495}", label: "真爱粉！" },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={handleClick}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 group"
          aria-label="回到顶部"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bai/80 to-zhu/80 backdrop-blur flex items-center justify-center text-xl shadow-glow border border-white/10 btn-press overflow-hidden ripple-container">
              <motion.span
                animate={mood === "love" ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: mood === "love" ? Infinity : 0, duration: 1 }}
              >
                {moods[mood].emoji}
              </motion.span>
            </div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 rounded-lg bg-surface/90 backdrop-blur text-[10px] font-mono text-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            >
              {moods[mood].label}
            </motion.span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
