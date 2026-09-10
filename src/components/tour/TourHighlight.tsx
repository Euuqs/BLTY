"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@/components/mascot/Mascots";
import { useFeedback } from "@/components/ui/FeedbackProvider";

export function TourHighlight() {
  const reduceMotion = useReducedMotion();
  const { createRipple, spawnParticles } = useFeedback();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    createRipple(event);
    const rect = event.currentTarget.getBoundingClientRect();
    spawnParticles(rect.right - 42, rect.top + rect.height / 2, "sparkles", 6);
  };

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
      <Link href="/tour" onClick={handleClick} className="tour-highlight-editorial ripple-container" aria-label="浏览 PRIVATE SIGNAL 杭州站舞台档案">
        <div className="tour-highlight-index" aria-hidden="true">01</div>
        <div className="tour-highlight-copy">
          <div className="tour-highlight-meta"><span>STAGE ARCHIVE</span><span>杭州站</span></div>
          <h3>PRIVATE SIGNAL <i>· 杭州</i></h3>
          <p>2026.08.22 · 演出回顾</p>
        </div>
        <div className="tour-highlight-action"><span>浏览舞台档案</span><i aria-hidden="true"><ArrowRight /></i></div>
      </Link>
    </motion.div>
  );
}
