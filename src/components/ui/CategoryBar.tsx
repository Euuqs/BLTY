"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CATEGORY_STYLES: Record<string, { gradient: string; glow: string; dot: string }> = {
  "衣服": {
    gradient: "linear-gradient(90deg, oklch(0.65 0.22 295), oklch(0.58 0.22 20))",
    glow: "oklch(0.60 0.25 295)",
    dot: "bg-cp",
  },
  "饰品": {
    gradient: "linear-gradient(90deg, oklch(0.58 0.22 20), oklch(0.70 0.16 75))",
    glow: "oklch(0.52 0.24 15)",
    dot: "bg-rose",
  },
  "零食": {
    gradient: "linear-gradient(90deg, oklch(0.72 0.17 75), oklch(0.60 0.18 250))",
    glow: "oklch(0.67 0.19 70)",
    dot: "bg-amber",
  },
  "美妆": {
    gradient: "linear-gradient(90deg, oklch(0.60 0.18 250), oklch(0.85 0.07 260))",
    glow: "oklch(0.55 0.20 250)",
    dot: "bg-zhu",
  },
  "鞋包": {
    gradient: "linear-gradient(90deg, oklch(0.85 0.07 260), oklch(0.55 0.10 285))",
    glow: "oklch(0.82 0.09 260)",
    dot: "bg-bai",
  },
  "其他": {
    gradient: "linear-gradient(90deg, oklch(0.55 0.10 285), oklch(0.65 0.22 295))",
    glow: "oklch(0.50 0.12 285)",
    dot: "bg-muted",
  },
};

interface CategoryBarProps {
  items: { label: string; count: number }[];
  total: number;
}

export function CategoryBar({ items, total }: CategoryBarProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (total === 0) return null;

  return (
    <div ref={ref} className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-border/60">
      {items.map((item, i) => {
        const pct = Math.round((item.count / total) * 100);
        const style = CATEGORY_STYLES[item.label] || CATEGORY_STYLES["其他"];
        const displayPct = Math.max(pct, 3);

        return (
          <div key={item.label} className="flex items-center gap-2.5 group">
            <div className="flex items-center gap-1.5 w-12 shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              <span className="font-mono text-[10px] text-muted group-hover:text-foreground transition-colors">
                {item.label}
              </span>
            </div>
            <div className="relative flex-1 h-2 rounded-full bg-surface-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={visible ? { width: `${displayPct}%` } : {}}
                transition={{
                  delay: 0.1 + i * 0.12,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-y-0 left-0 rounded-full group-hover:brightness-110 transition-[filter] duration-300"
                style={{
                  background: style.gradient,
                  boxShadow: visible ? `0 0 12px ${style.glow}` : "none",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.div>
            </div>
            <div className="flex items-center gap-1 w-10 text-right shrink-0">
              <motion.span
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.3 }}
                className="font-mono text-[10px] text-muted/80 tabular-nums"
              >
                {pct}%
              </motion.span>
              <span className="font-mono text-[10px] text-muted/50 group-hover:text-foreground/70 transition-colors tabular-nums">
                {item.count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
