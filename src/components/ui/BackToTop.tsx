"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFeedback } from "./FeedbackProvider";
import { DogMascot, Heart, Paw } from "@/components/mascot/Mascots";

export function BackToTop() {
  const [show, setShow] = useState(false);
  const [mood, setMood] = useState<"idle" | "happy" | "love">("idle");
  const { spawnParticles, createRipple } = useFeedback();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setShow(scrollTop > 400);
      if (scrollTop > 1500) setMood("love");
      else if (scrollTop > 800) setMood("happy");
      else setMood("idle");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e as unknown as React.MouseEvent<HTMLElement>);
    
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
    document.documentElement.scrollTo({ top: 0, behavior });
    document.body.scrollTo({ top: 0, behavior });

    if (behavior === "smooth") {
      setTimeout(() => {
        spawnParticles(window.innerWidth / 2, window.innerHeight - 100, "hearts", 8);
      }, 500);
    }
  };

  const moods = {
    idle: { Icon: Paw, label: "回到顶部" },
    happy: { Icon: DogMascot, label: "你滑了好多！" },
    love: { Icon: Heart, label: "真爱粉！" },
  };
  const MoodIcon = moods[mood].Icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={handleClick}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-[60] group btn-press"
          aria-label="回到顶部"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bai/80 to-zhu/80 backdrop-blur flex items-center justify-center text-xl shadow-glow border border-white/10 overflow-hidden ripple-container hover:scale-110 hover:-translate-y-1 transition-transform duration-200">
              <motion.span
                animate={mood === "love" ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: mood === "love" ? Infinity : 0, duration: 1 }}
                className="flex items-center justify-center"
              >
                <MoodIcon className="w-6 h-6 text-background" />
              </motion.span>
            </div>
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 -translate-x-2.5 group-hover:translate-x-0 transition-transform duration-200 whitespace-nowrap px-2 py-1 rounded-lg bg-surface/90 backdrop-blur text-[10px] font-mono text-foreground border border-border opacity-0 group-hover:opacity-100 pointer-events-none">
              {moods[mood].label}
            </span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
