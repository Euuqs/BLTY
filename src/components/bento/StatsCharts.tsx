"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  publishedFeeds as feeds,
  publishedSameStyles as sameStyles,
  publishedSchedules as schedules,
} from "@/lib/velite";

const CATEGORY_COLORS: Record<string, { stroke: string; glow: string; label: string }> = {
  "衣服": { stroke: "oklch(0.65 0.22 295)", glow: "oklch(0.60 0.25 295)", label: "cp" },
  "饰品": { stroke: "oklch(0.58 0.22 20)", glow: "oklch(0.52 0.24 15)", label: "rose" },
  "零食": { stroke: "oklch(0.72 0.17 75)", glow: "oklch(0.67 0.19 70)", label: "amber" },
  "美妆": { stroke: "oklch(0.60 0.18 250)", glow: "oklch(0.55 0.20 250)", label: "zhu" },
  "鞋包": { stroke: "oklch(0.85 0.07 260)", glow: "oklch(0.82 0.09 260)", label: "bai" },
  "其他": { stroke: "oklch(0.55 0.10 285)", glow: "oklch(0.50 0.12 285)", label: "muted" },
};

function MiniBarChart() {
  const data = useMemo(() => {
    const months: Record<string, number> = {};
    [...schedules, ...feeds, ...sameStyles].forEach((item: { date?: string }) => {
      if (item.date) {
        const m = item.date.slice(0, 7);
        months[m] = (months[m] || 0) + 1;
      }
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6);
  }, []);

  const max = Math.max(...data.map(([, v]) => v), 1);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-2">
      <p className="text-[11px] font-mono text-foreground/70 tracking-wider uppercase">
        Activity Trend
      </p>
      <div className="flex items-end gap-1.5 h-16">
        {data.map(([month, count], i) => (
          <motion.div
            key={month}
            initial={{ height: 0 }}
            animate={visible ? { height: `${(count / max) * 100}%` } : {}}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className="flex-1 rounded-t-md min-h-[2px] relative group"
            style={{
              background: "linear-gradient(180deg, oklch(0.65 0.22 295) 0%, oklch(0.60 0.18 250) 100%)",
            }}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-foreground transition-opacity whitespace-nowrap">
              {count}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {data.map(([month]) => (
          <span key={month} className="flex-1 text-center text-[10px] text-muted/90 font-mono tabular-nums">
            {month.slice(5)}
          </span>
        ))}
      </div>
    </div>
  );
}

function CategoryDonut() {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    const cats: Record<string, number> = {};
    sameStyles.forEach((s) => {
      cats[s.category] = (cats[s.category] || 0) + 1;
    });
    const total = Object.values(cats).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(cats)
      .map(([name, value]) => ({
        name,
        value,
        pct: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    return sorted.map((d, idx) => {
      const dashLength = (d.pct / 100) * circumference;
      const gapLength = circumference - dashLength;
      const preceding = sorted
        .slice(0, idx)
        .reduce((sum, s) => sum + (s.pct / 100) * circumference, 0);
      return {
        ...d,
        dash: dashLength,
        gap: gapLength,
        offset: -preceding,
      };
    });
  }, [circumference]);

  const total = segments.reduce((a, d) => a + d.value, 0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setMounted(true), 50);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleHover = (idx: number | null) => {
    setHoverIdx(idx);
    if (idx !== null) setPulseKey((k) => k + 1);
  };

  return (
    <div ref={ref} className="space-y-2 donut-chart-mobile">
      <p className="text-[11px] font-mono text-foreground/70 tracking-wider uppercase">
        Style Categories
      </p>
      <div className="flex items-center gap-3 sm:gap-4">
        <motion.div
          className="relative w-[110px] h-[110px] sm:w-[100px] sm:h-[100px] flex-shrink-0 donut-container"
          initial={false}
          animate={mounted ? { rotate: [0, -3, 0] } : {}}
          transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
        >
          <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
            {/* 背景轨道 */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="oklch(0.25 0.04 285)"
              strokeWidth="12"
              className="opacity-40"
            />
            {/* 数据段 */}
            {segments.map((d, i) => {
              const stroke = CATEGORY_COLORS[d.name]?.stroke ?? CATEGORY_COLORS["其他"].stroke;
              const glow = CATEGORY_COLORS[d.name]?.glow ?? CATEGORY_COLORS["其他"].glow;
              const isHovered = hoverIdx === i;
              return (
                <motion.circle
                  key={d.name}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isHovered ? 14 : 12}
                  strokeDasharray={`${d.dash} ${d.gap}`}
                  strokeDashoffset={d.offset}
                  strokeLinecap="butt"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: mounted ? (hoverIdx === null || isHovered ? 0.92 : 0.3) : 0,
                    scale: mounted ? 1 : 0.8,
                  }}
                  transition={{
                    opacity: { delay: 0.3 + i * 0.12, duration: 0.5 },
                    scale: { delay: 0.3 + i * 0.12, duration: 0.5 },
                    default: { duration: 0.2 },
                  }}
                  style={{
                    cursor: "pointer",
                    filter: isHovered
                      ? `drop-shadow(0 0 8px ${glow})`
                      : "none",
                    transition: "stroke-width 0.2s ease",
                    transformOrigin: "50px 50px",
                  }}
                  onMouseEnter={() => handleHover(i)}
                  onMouseLeave={() => handleHover(null)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] font-mono text-foreground/60 tracking-widest">TOTAL</span>
            <motion.span
              key={pulseKey}
              className="font-serif text-xl font-bold text-foreground leading-tight"
              animate={{ scale: hoverIdx !== null ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
            >
              {hoverIdx !== null ? segments[hoverIdx].value : total}
            </motion.span>
            <motion.span
              key={`label-${pulseKey}`}
              className="text-[10px] font-mono text-foreground/70"
              animate={{ opacity: [0, 1], y: [4, 0] }}
              transition={{ duration: 0.3 }}
            >
              {hoverIdx !== null ? segments[hoverIdx].name : "同款"}
            </motion.span>
          </div>
        </motion.div>
        <div className="space-y-1.5 flex-1">
          {segments.map((d, i) => {
            const stroke = CATEGORY_COLORS[d.name]?.stroke ?? CATEGORY_COLORS["其他"].stroke;
            const glow = CATEGORY_COLORS[d.name]?.glow ?? CATEGORY_COLORS["其他"].glow;
            return (
              <div
                key={d.name}
                className="flex items-center gap-2 text-xs cursor-pointer"
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={() => handleHover(null)}
              >
                <motion.span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: stroke, boxShadow: hoverIdx === i ? `0 0 8px ${glow}` : "none" }}
                  animate={hoverIdx === i ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                  transition={{ duration: 0.6, repeat: hoverIdx === i ? Infinity : 0 }}
                />
                <span className="text-foreground/80 flex-1">{d.name}</span>
                <motion.span
                  className="text-foreground font-mono text-[11px] font-semibold tabular-nums"
                  animate={hoverIdx === i ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {d.value}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MemberBars() {
  const data = useMemo(() => {
    let bai = 0, zhu = 0, cp = 0;
    sameStyles.forEach((s) => {
      if (s.member === "A") bai++;
      else if (s.member === "B") zhu++;
      else cp++;
    });
    return { bai, zhu, cp };
  }, []);

  const total = data.bai + data.zhu + data.cp;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const bars = [
    { label: "柏欣妤", value: data.bai, pct: total > 0 ? (data.bai / total) * 100 : 0, gradient: "linear-gradient(90deg, oklch(0.85 0.07 260), oklch(0.65 0.22 295))" },
    { label: "朱怡欣", value: data.zhu, pct: total > 0 ? (data.zhu / total) * 100 : 0, gradient: "linear-gradient(90deg, oklch(0.60 0.18 250), oklch(0.65 0.22 295))" },
    { label: "双人", value: data.cp, pct: total > 0 ? (data.cp / total) * 100 : 0, gradient: "linear-gradient(90deg, oklch(0.85 0.07 260), oklch(0.65 0.22 295), oklch(0.60 0.18 250))" },
  ];

  return (
    <div ref={ref} className="space-y-3">
      <p className="text-[11px] font-mono text-foreground/70 tracking-wider uppercase">
        Member Distribution
      </p>
      {bars.map((d, i) => (
        <div key={d.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-foreground/80">{d.label}</span>
            <span className="text-foreground font-mono font-semibold tabular-nums">{d.value}</span>
          </div>
          <div className="h-2 bg-surface-3/80 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={visible ? { width: `${d.pct}%` } : {}}
              transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: d.gradient }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsCharts() {
  return (
    <div className="bento-tile bg-surface/90 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground font-mono">Data Insights</h3>
        <span className="text-[10px] text-cp/80 font-mono tracking-wider uppercase">live</span>
      </div>
      <MiniBarChart />
      <div className="border-t border-border/80 pt-4">
        <CategoryDonut />
      </div>
      <div className="border-t border-border/80 pt-4">
        <MemberBars />
      </div>
    </div>
  );
}
