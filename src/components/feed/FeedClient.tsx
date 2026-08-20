"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BentoTile } from "@/components/bento/BentoTile";
import { MonthFilter } from "@/components/ui/MonthFilter";
import { TypeIcon } from "@/components/ui/TypeIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFeedback } from "@/components/ui/FeedbackProvider";
import { ArrowUpRight } from "@/components/mascot/Mascots";
import { formatDateTime, formatMonth } from "@/lib/date";
import type { Feed } from "@/lib/velite";

const getLabel = (m: string) => m === "A" ? "柏欣妤" : m === "B" ? "朱怡欣" : "双人";
const getColor = (m: string) => m === "A" ? "text-bai" : m === "B" ? "text-zhu" : "text-gradient-cp";

type MemberFilter = "all" | "A" | "B" | "both";

const memberOptions: { key: MemberFilter; label: string; dot: string; activeClass: string }[] = [
  { key: "all", label: "全部", dot: "", activeClass: "bg-cp text-background border-cp shadow-[0_0_12px_oklch(0.65_0.22_295/0.4)]" },
  { key: "A", label: "柏欣妤", dot: "dot-bai", activeClass: "bg-bai text-background border-bai shadow-[0_0_12px_oklch(0.92_0.01_260/0.4)]" },
  { key: "B", label: "朱怡欣", dot: "dot-zhu", activeClass: "bg-zhu text-background border-zhu shadow-[0_0_12px_oklch(0.55_0.20_250/0.4)]" },
  { key: "both", label: "双人", dot: "dot-cp", activeClass: "bg-cp text-background border-cp shadow-[0_0_12px_oklch(0.65_0.22_295/0.4)]" },
];

interface FeedClientProps {
  feeds: Feed[];
}

export function FeedClient({ feeds }: FeedClientProps) {
  const { createRipple } = useFeedback();
  const allMonths = [...new Set(feeds.map(f => formatMonth(f.date)))].sort().reverse();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberFilter>("all");

  const filtered = useMemo(
    () => feeds.filter((f) => {
      const monthMatch = !selectedMonth || formatMonth(f.date) === selectedMonth;
      const memberMatch = selectedMember === "all" || f.member === selectedMember;
      return monthMatch && memberMatch;
    }),
    [feeds, selectedMonth, selectedMember]
  );

  // 纯时间线：按日期倒序，单人/双人交错混排
  const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));

  const stats = useMemo(() => ({
    total: filtered.length,
    bai: filtered.filter(f => f.member === "A").length,
    zhu: filtered.filter(f => f.member === "B").length,
    both: filtered.filter(f => f.member === "both").length,
  }), [filtered]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <MonthFilter
        months={allMonths}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
      />

      {/* 成员筛选 */}
      <div className="flex flex-wrap items-center gap-1.5">
        {memberOptions.map((opt) => (
          <motion.button
            key={opt.key}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              createRipple(e);
              setSelectedMember(opt.key);
            }}
            className={`relative overflow-hidden px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all duration-200 btn-press ripple-container ${
              selectedMember === opt.key
                ? opt.activeClass
                : "bg-surface/50 text-muted border-border hover:border-cp/50 hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {opt.dot && <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />}
              {opt.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* 统计行 */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
        <span className="px-3 py-1.5 rounded-full bg-surface-2/60 border border-border text-muted">
          共 {stats.total} 条
        </span>
        <span className="px-3 py-1.5 rounded-full bg-surface/50 border border-bai/25 text-bai/90">
          <span className="w-1.5 h-1.5 rounded-full dot-bai inline-block mr-1.5 align-middle" />
          柏 {stats.bai}
        </span>
        <span className="px-3 py-1.5 rounded-full bg-surface/50 border border-zhu/25 text-zhu">
          <span className="w-1.5 h-1.5 rounded-full dot-zhu inline-block mr-1.5 align-middle" />
          朱 {stats.zhu}
        </span>
        <span className="px-3 py-1.5 rounded-full bg-surface/50 border border-cp/25 text-cp/90">
          <span className="w-1.5 h-1.5 rounded-full dot-cp inline-block mr-1.5 align-middle" />
          双人 {stats.both}
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-[12px] sm:left-[13px] top-2 bottom-2 w-px bg-gradient-to-b from-cp/30 via-zhu/20 to-bai/10" />
        <div className="flex flex-col gap-4 sm:gap-5">
          {sorted.map((item, idx) => {
            const month = formatMonth(item.date);
            const prevMonth = idx > 0 ? formatMonth(sorted[idx - 1].date) : null;
            const isNewMonth = month !== prevMonth;
            return (
              <div key={item.slug} id={item.slug}>
                {isNewMonth && (
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <span className="font-mono text-[10px] tracking-wider text-cp px-3 py-1 rounded-full bg-background border border-cp/20">
                      {month}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
                <div className="relative pl-10 sm:pl-12">
                  {/* 类型图标节点 */}
                  <div className="absolute left-0 top-4 w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] rounded-full bg-surface border border-border flex items-center justify-center shadow-[0_0_12px_oklch(0.65_0.22_295/0.15)]">
                    <TypeIcon name={item.type ?? "其他"} className={"w-3 h-3 sm:w-3.5 sm:h-3.5 " + getColor(item.member)} />
                  </div>
                  <BentoTile interactive={!!item.link} href={item.link}>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={"text-[10px] font-mono " + getColor(item.member)}>{getLabel(item.member)}</span>
                      <span className="text-muted/30 text-[10px]">{"\u00B7"}</span>
                      <span className="text-[10px] font-mono text-muted">{formatDateTime(item.date)}</span>
                      {item.type && (
                        <>
                          <span className="text-muted/30 text-[10px]">{"\u00B7"}</span>
                          <TypeIcon name={item.type} className="w-3 h-3 text-cp" />
                          <span className="text-[10px] font-mono text-cp uppercase tracking-wider">{item.type}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-semibold mb-2">{item.title}</h3>
                    {item.description && <p className="text-sm text-muted leading-relaxed">{item.description}</p>}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cp/10 text-cp/80 border border-cp/15">
                            {"#"}{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.link && (
                      <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono text-cp/70 group-hover:text-cp transition-colors">
                        查看来源 <ArrowUpRight className="w-4 h-4" />
                      </span>
                    )}
                  </BentoTile>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {sorted.length === 0 && (
        <EmptyState message="暂无匹配的动态" hint="换个筛选条件试试" member="both" />
      )}
    </div>
  );
}
