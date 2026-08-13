"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { DogMascot, PigMascot, Paw, Rose } from "@/components/mascot/Mascots";
import { useFeedback } from "@/components/ui/FeedbackProvider";

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

  const message = getMessage();

  return (
    <div className="relative flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.15, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBaiClick}
          className="cursor-pointer"
        >
          <DogMascot className="mascot-float w-9 h-9 opacity-80 hover:opacity-100 transition-opacity" />
        </motion.div>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cp/50 text-base tracking-widest"
        >
          {"\u2665"}
        </motion.span>
        <motion.div
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleZhuClick}
          className="cursor-pointer"
        >
          <PigMascot className="mascot-float mascot-float-delayed w-9 h-9 opacity-80 hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
      <Paw className="absolute -bottom-2 -left-8 w-4 h-4 text-muted/20 rotate-[-16deg]" />
      <Paw className="absolute -bottom-2 -right-8 w-3.5 h-3.5 text-muted/15 rotate-[12deg]" />
      <Rose className="mascot-float absolute -top-3 right-10 w-4 h-4 text-rose/40 rotate-[18deg]" />
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="text-[10px] font-mono text-cp/70 mt-1"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
