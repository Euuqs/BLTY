"use client";

import { useState, useEffect, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { DogMascot, PigMascot, ArrowUpRight } from "@/components/mascot/Mascots";
import { useFeedback } from "@/components/ui/FeedbackProvider";

export function TourNotice() {
  const [visible, setVisible] = useState(false);
  const { createRipple, spawnParticles } = useFeedback();

  useEffect(() => {
    const dismissed = sessionStorage.getItem("tour-notice-dismissed");
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const handleDismiss = (e?: ReactMouseEvent<HTMLElement>) => {
    if (e) createRipple(e);
    setVisible(false);
    sessionStorage.setItem("tour-notice-dismissed", "1");
  };

  const handleNav = (e: ReactMouseEvent<HTMLElement>) => {
    createRipple(e);
    const rect = e.currentTarget.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, "sparkles", 8);
    setVisible(false);
    sessionStorage.setItem("tour-notice-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative overflow-hidden rounded-2xl border border-cp/40 bg-gradient-to-r from-cp/15 via-surface to-zhu/15 backdrop-blur-sm"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-cp/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-bai/10 blur-2xl pointer-events-none" />

          <div className="relative flex items-center gap-3 px-4 py-3">
            <div className="flex items-center gap-2 shrink-0">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <DogMascot className="w-7 h-7 text-bai" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.5 }}
                className="-ml-3"
              >
                <PigMascot className="w-6 h-6 text-zhu" />
              </motion.div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-cp/20 border border-cp/40 text-[9px] font-mono text-cp tracking-widest">
                  TOUR 2026
                </span>
                <span className="font-mono text-[10px] text-muted">08.22 杭州站</span>
              </div>
              <p className="text-sm font-medium mt-0.5 truncate">
                PRIVATE SIGNAL 巡演攻略已上线
                <span className="hidden sm:inline text-muted font-normal ml-2">痛楼 · 大屏 · 场外应援全汇总</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/tour"
                onClick={handleNav}
                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cp to-[oklch(0.55_0.22_340)] text-white text-xs font-medium btn-press shadow-[0_0_16px_oklch(0.65_0.22_295/0.3)] ripple-container"
              >
                查看攻略
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDismiss}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-2 border border-border text-muted hover:text-foreground hover:border-cp/40 transition-colors text-sm ripple-container"
                aria-label="关闭提示"
              >
                ✕
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}