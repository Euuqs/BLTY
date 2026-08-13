"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { sameStyles, schedules, feeds } from "@/lib/velite";

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
      <p className="text-[10px] font-mono text-muted tracking-wider uppercase">
        Activity Trend
      </p>
      <div className="flex items-end gap-1.5 h-16">
        {data.map(([month, count], i) => (
          <motion.div
            key={month}
            initial={{ height: 0 }}
            animate={visible ? { height: `${(count / max) * 100}%` } : {}}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className="flex-1 bg-gradient-to-t from-cp/60 to-bai/60 rounded-t-md min-h-[2px] relative group"
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {count}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {data.map(([month]) => (
          <span key={month} className="flex-1 text-center text-[9px] text-muted font-mono">
            {month.slice(5)}
          </span>
        ))}
      </div>
    </div>
  );
}

function CategoryDonut() {
  const data = useMemo(() => {
    const cats: Record<string, number> = {};
    sameStyles.forEach((s) => {
      cats[s.category] = (cats[s.category] || 0) + 1;
    });
    const total = Object.values(cats).reduce((a, b) => a + b, 0);
    return Object.entries(cats).map(([name, value]) => ({
      name,
      value,
      pct: (value / total) * 100,
    }));
  }, []);

  const colors = ["#7dd3fc", "#c084fc", "#f9a8d4", "#fbbf24", "#34d399", "#f87171"];
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

  let cumulative = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div ref={ref} className="space-y-2">
      <p className="text-[10px] font-mono text-muted tracking-wider uppercase">
        Style Categories
      </p>
      <div className="flex items-center gap-4">
        <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
          {data.map((d, i) => {
            const dash = (d.pct / 100) * circumference;
            const gap = circumference - dash;
            const offset = -cumulative;
            cumulative += dash;
            return (
              <motion.circle
                key={d.name}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth="12"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
                initial={{ pathLength: 0 }}
                animate={visible ? { pathLength: 1 } : {}}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="opacity-80"
              />
            );
          })}
        </svg>
        <div className="space-y-1 flex-1">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: colors[i % colors.length] }}
              />
              <span className="text-muted flex-1">{d.name}</span>
              <span className="text-foreground font-mono text-[10px]">{d.value}</span>
            </div>
          ))}
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

  return (
    <div ref={ref} className="space-y-3">
      <p className="text-[10px] font-mono text-muted tracking-wider uppercase">
        Member Distribution
      </p>
      {[
        { label: "柏欣妤", value: data.bai, color: "from-sky-400 to-sky-300", pct: (data.bai / total) * 100 },
        { label: "朱怡欣", value: data.zhu, color: "from-pink-400 to-pink-300", pct: (data.zhu / total) * 100 },
        { label: "双人", value: data.cp, color: "from-cp to-zhu", pct: (data.cp / total) * 100 },
      ].map((d, i) => (
        <div key={d.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted">{d.label}</span>
            <span className="text-foreground font-mono">{d.value}</span>
          </div>
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={visible ? { width: `${d.pct}%` } : {}}
              transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${d.color} rounded-full`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsCharts() {
  return (
    <div className="bento-tile p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground font-mono">{"\u{1F4CA}"} Data Insights</h3>
        <span className="text-[10px] text-muted font-mono">live</span>
      </div>
      <MiniBarChart />
      <div className="border-t border-border/50 pt-4">
        <CategoryDonut />
      </div>
      <div className="border-t border-border/50 pt-4">
        <MemberBars />
      </div>
    </div>
  );
}
