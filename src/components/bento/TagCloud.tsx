"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sameStyles, feeds } from "@/lib/velite";

interface TagCloudProps {
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function TagCloud({ onTagClick, className = "" }: TagCloudProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const tagData = useMemo(() => {
    const counts: Record<string, number> = {};
    sameStyles.forEach((s) => {
      if (s.category) counts[s.category] = (counts[s.category] || 0) + 1;
    });
    feeds.forEach((f) => {
      f.tags?.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        weight: 0.7 + (count / total) * 2,
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const colors = [
    "text-bai/80 hover:text-bai",
    "text-zhu/80 hover:text-zhu",
    "text-cp/80 hover:text-cp",
    "text-sky-400/80 hover:text-sky-400",
    "text-emerald-400/80 hover:text-emerald-400",
    "text-amber-400/80 hover:text-amber-400",
  ];

  return (
    <div className={`bento-tile p-5 ${className}`}>
      <h3 className="text-sm font-bold text-foreground font-mono mb-4">
        {"\u{1F3F7}"} Tag Cloud
      </h3>
      <div className="flex flex-wrap gap-2">
        {tagData.map((tag, i) => (
          <motion.button
            key={tag.name}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelected(selected === tag.name ? null : tag.name);
              onTagClick?.(tag.name);
            }}
            className={`px-3 py-1 rounded-full bg-surface-2/50 text-xs font-mono transition-all ${
              selected === tag.name
                ? "bg-cp/20 text-cp ring-1 ring-cp/40"
                : colors[i % colors.length]
            }`}
            style={{ fontSize: `${0.7 + tag.weight * 0.15}rem` }}
          >
            #{tag.name}
            <span className="ml-1 text-[9px] opacity-60">{tag.count}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-muted mt-3 pt-3 border-t border-border/50">
              已筛选: <span className="text-cp">#{selected}</span>
              <button
                onClick={() => {
                  setSelected(null);
                  onTagClick?.("");
                }}
                className="ml-2 text-muted/60 hover:text-muted"
              >
                {"\u2715"} 清除
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
