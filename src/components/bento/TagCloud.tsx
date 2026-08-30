"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  publishedFeeds as feeds,
  publishedSameStyles as sameStyles,
} from "@/lib/velite";

interface TagCloudProps {
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function TagCloud({ onTagClick, className = "" }: TagCloudProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

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
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const colors = [
    "text-foreground/85 hover:text-foreground",
    "text-zhu/90 hover:text-zhu",
    "text-cp/90 hover:text-cp",
    "text-rose/90 hover:text-rose",
  ];
  const initialTagCount = 14;
  const visibleTags = expanded ? tagData : tagData.slice(0, initialTagCount);

  return (
    <div className={`bento-tile p-5 ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-bold text-foreground font-mono">Tag Cloud</h3>
        <span className="text-[10px] text-muted/80 font-mono tabular-nums">
          {tagData.length} tags
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag, i) => {
          const sizeClass = i < 3 ? "text-sm" : i < 8 ? "text-xs" : "text-[11px]";
          return (
          <motion.button
            key={tag.name}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelected(selected === tag.name ? null : tag.name);
              onTagClick?.(tag.name);
            }}
            className={`min-h-11 px-3 py-1.5 rounded-full bg-surface-2/70 ${sizeClass} font-mono transition-all ${
              selected === tag.name
                ? "bg-cp/20 text-cp ring-1 ring-cp/40"
              : colors[i % colors.length]
            }`}
          >
            #{tag.name}
            <span className="ml-1 text-[9px] opacity-60">{tag.count}</span>
          </motion.button>
          );
        })}
      </div>
      {tagData.length > initialTagCount && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="mt-4 min-h-11 w-full rounded-lg border border-border/70 bg-surface-2/40 px-3 py-2 text-xs font-mono text-muted transition-colors hover:border-cp/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cp/60"
        >
          {expanded ? "收起标签" : `展开全部（${tagData.length - initialTagCount}）`}
        </button>
      )}
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
