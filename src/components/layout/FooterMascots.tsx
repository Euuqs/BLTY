"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { DogMascot, PigMascot, Paw, Rose, Heart } from "@/components/mascot/Mascots";
import { useFeedback } from "@/components/ui/FeedbackProvider";
import { useNow } from "@/lib/useNow";

export function FooterMascots() {
  const { spawnParticles } = useFeedback();
  const [baiClicks, setBaiClicks] = useState(0);
  const [zhuClicks, setZhuClicks] = useState(0);

  const handleBaiClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnParticles(x, y, "sparkles", 5);
    setBaiClicks((c) => c + 1);
  };

  const handleZhuClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnParticles(x, y, "hearts", 5);
    setZhuClicks((c) => c + 1);
  };

  const getMessage = () => {
    const total = baiClicks + zhuClicks;
    if (total === 0) return null;
    if (total < 3) return "再摸摸我们~";
    if (total < 6) return "好舒服呀！";
    if (total < 10) return "汪/哼哼~";
    return "最爱你啦！";
  };

  const now = useNow();
  const message = getMessage();

  const dateTimeStr = useMemo(() => {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${min}`;
  }, [now]);

  const year = now.getFullYear();

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.15, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBaiClick}
          className="flex h-11 w-11 items-center justify-center rounded-full cursor-pointer"
          aria-label="和柏欣妤萌宠互动"
        >
          <DogMascot className="mascot-float w-9 h-9 opacity-80 hover:opacity-100 transition-opacity" />
        </motion.button>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cp/50 text-base tracking-widest"
        >
          <Heart className="w-4 h-4 text-cp/50" />
        </motion.span>
        <motion.button
          type="button"
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleZhuClick}
          className="flex h-11 w-11 items-center justify-center rounded-full cursor-pointer"
          aria-label="和朱怡欣萌宠互动"
        >
          <PigMascot className="mascot-float mascot-float-delayed w-9 h-9 opacity-80 hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>
      <Paw className="absolute -bottom-2 -left-8 w-4 h-4 text-muted/20 rotate-[-16deg]" />
      <Paw className="absolute -bottom-2 -right-8 w-3.5 h-3.5 text-muted/15 rotate-[12deg]" />
      <motion.div
        className="absolute -top-3 right-10"
        animate={{
          y: [0, -4, 0],
          rotate: [18, 25, 18],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Rose className="w-5 h-5 text-rose/60 drop-shadow-[0_0_8px_oklch(0.58_0.22_20/0.5)]" />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="text-[10px] font-mono text-cp/70 mt-1"
        >
          {message}
        </motion.p>
      )}
      <div className="flex flex-col items-center gap-1 mt-2 pt-2 border-t border-border/40 w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-mono text-muted/60 tracking-wider flex items-center gap-1.5"
        >
          <span className="w-1 h-1 rounded-full bg-cp animate-pulse" />
          {dateTimeStr}
        </motion.p>
        <p className="text-[9px] font-mono text-muted/40">
          &copy; {year} 柏里挑怡 · 心动穿越千里
        </p>
      </div>
    </div>
  );
}
