"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { DogMascot, PigMascot } from "@/components/mascot/Mascots";
import { useFeedback } from "@/components/ui/FeedbackProvider";

interface EmptyStateProps {
  message: string;
  hint?: string;
  member?: "A" | "B" | "both";
}

const ENCOURAGEMENTS = [
  "别急，好东西值得等待~",
  "换个角度看看吧！",
  "汪！这里空空的~",
  "哼哼，再找找看？",
  "心动正在加载中...",
  "柏里挑怡，等你发现！",
];

export function EmptyState({ message, hint, member = "both" }: EmptyStateProps) {
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const { spawnParticles } = useFeedback();

  const handleMascotClick = (e: React.MouseEvent, type: "hearts" | "sparkles") => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    spawnParticles(x, y, type, 5);

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount <= ENCOURAGEMENTS.length) {
      setEncouragement(ENCOURAGEMENTS[newCount - 1]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <div className="flex items-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => handleMascotClick(e, "sparkles")}
          className={`cursor-pointer transition-opacity ${member === "B" ? "opacity-20" : "opacity-70 hover:opacity-100"}`}
        >
          <DogMascot className="mascot-float w-16 h-16" />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => handleMascotClick(e, "hearts")}
          className={`-ml-3 cursor-pointer transition-opacity ${member === "A" ? "opacity-20" : "opacity-70 hover:opacity-100"}`}
        >
          <PigMascot className="mascot-float mascot-float-delayed w-16 h-16" />
        </motion.div>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="font-serif text-lg text-foreground/80">{message}</p>
        {hint && <p className="text-xs font-mono text-muted">{hint}</p>}
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: encouragement ? 1 : 0,
            height: encouragement ? "auto" : 0,
          }}
          className="text-xs text-cp/80 font-mono mt-2 overflow-hidden"
        >
          {encouragement}
        </motion.p>
        {clickCount > 0 && clickCount < ENCOURAGEMENTS.length && (
          <p className="text-[10px] text-muted/50 font-mono mt-1">
            再点几下还有惊喜哦 ({clickCount}/{ENCOURAGEMENTS.length})
          </p>
        )}
      </div>
    </motion.div>
  );
}
