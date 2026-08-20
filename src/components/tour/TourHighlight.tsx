"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BentoTile } from "@/components/bento/BentoTile";
import { DogMascot, PigMascot } from "@/components/mascot/Mascots";
import { useFeedback } from "@/components/ui/FeedbackProvider";
import { useNow } from "@/lib/useNow";

function diffDays(target: Date, now: Date) {
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((t.getTime() - n.getTime()) / 86400000);
}

export function TourHighlight() {
  const now = useNow();
  const { createRipple, spawnParticles } = useFeedback();

  const tourDate = new Date(2026, 7, 22); // Aug 22, 2026
  const daysLeft = diffDays(tourDate, now);
  const isSoon = daysLeft >= 0 && daysLeft <= 7;
  const isToday = daysLeft === 0;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    createRipple(e);
    const rect = e.currentTarget.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, "sparkles", 10);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href="/tour"
        onClick={handleClick}
        className="block"
      >
        <BentoTile className="relative overflow-hidden p-0 group cursor-pointer ripple-container gradient-border bento-tile-interactive">
          <div className="absolute inset-0 bg-gradient-to-br from-cp/20 via-surface to-zhu/15 pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cp/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-bai/10 blur-3xl pointer-events-none" />

          <div className="relative p-5 md:p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative shrink-0">
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                >
                  <DogMascot className="w-8 h-8 text-bai" />
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                  className="absolute -right-3 -bottom-1"
                >
                  <PigMascot className="w-6 h-6 text-zhu" />
                </motion.div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-cp/20 border border-cp/40 text-[9px] font-mono text-cp tracking-widest">
                    TOUR 2026
                  </span>
                  <span className="text-[10px] font-mono text-muted">杭州站</span>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-semibold mt-1 truncate">
                  PRIVATE SIGNAL
                  <span className="ml-2 text-cp">· 杭州</span>
                </h3>
                <p className="text-xs text-muted mt-0.5 truncate">
                  08.22 周六 19:00 · 新天地太阳剧场
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isToday ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="px-3 py-1.5 rounded-full bg-cp text-background text-xs font-mono font-semibold"
                >
                  就是今天
                </motion.div>
              ) : isSoon ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted">还有</span>
                  <motion.span
                    key={daysLeft}
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-serif text-2xl font-semibold text-cp tabular-nums"
                  >
                    {daysLeft}
                  </motion.span>
                  <span className="text-[10px] font-mono text-muted">天</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted">即将开启</span>
                </div>
              )}

              <motion.div
                className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-2 border border-border group-hover:border-cp/50 transition-colors"
                whileHover={{ scale: 1.1, x: 4 }}
              >
                <span className="text-sm">→</span>
              </motion.div>
            </div>
          </div>
        </BentoTile>
      </Link>
    </motion.div>
  );
}