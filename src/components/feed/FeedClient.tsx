"use client";

import { useState } from "react";
import { BentoTile } from "@/components/bento/BentoTile";
import { MonthFilter } from "@/components/ui/MonthFilter";
import { formatDateTime, formatMonth } from "@/lib/date";
import type { Feed } from "@/lib/velite";

const getDot = (m: string) => m === "A" ? "dot-bai" : m === "B" ? "dot-zhu" : "dot-cp";
const getLabel = (m: string) => m === "A" ? "柏欣妤" : m === "B" ? "朱怡欣" : "双人";
const getColor = (m: string) => m === "A" ? "text-bai" : m === "B" ? "text-zhu" : "text-gradient-cp";

interface FeedClientProps {
  feeds: Feed[];
}

export function FeedClient({ feeds }: FeedClientProps) {
  const allMonths = [...new Set(feeds.map(f => formatMonth(f.date)))].sort().reverse();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const filteredFeeds = selectedMonth
    ? feeds.filter(f => formatMonth(f.date) === selectedMonth)
    : feeds;

  const sorted = [...filteredFeeds].reverse();

  const grouped = sorted.reduce<Record<string, Feed[]>>((acc, item) => {
    const month = formatMonth(item.date);
    if (!acc[month]) acc[month] = [];
    acc[month].push(item);
    return acc;
  }, {});
  const displayMonths = Object.keys(grouped).sort().reverse();

  return (
    <div className="flex flex-col gap-8">
      <MonthFilter
        months={allMonths}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
      />

      <div className="flex flex-col gap-8">
        {displayMonths.map((month) => (
          <section key={month}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-mono text-sm tracking-wider text-cp">{month}</h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] font-mono text-muted">{grouped[month].length} 条</span>
            </div>
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-cp/30 via-zhu/20 to-bai/10" />
              <div className="flex flex-col gap-5">
                {grouped[month].map((item) => (
                  <div key={item.slug} className="relative pl-12">
                    <div className={"absolute left-[9px] top-5 w-[14px] h-[14px] rounded-full border-2 border-background " + getDot(item.member)} />
                    <BentoTile>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={"text-[10px] font-mono " + getColor(item.member)}>{getLabel(item.member)}</span>
                        <span className="text-muted/30 text-[10px]">{"\u00B7"}</span>
                        <span className="text-[10px] font-mono text-muted">{formatDateTime(item.date)}</span>
                        {item.type && (
                          <>
                            <span className="text-muted/30 text-[10px]">{"\u00B7"}</span>
                            <span className="text-[10px] font-mono text-cp uppercase tracking-wider">{item.type}</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-semibold mb-2">{item.title}</h3>
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
                    </BentoTile>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
        {sorted.length === 0 && (
          <div className="text-center py-12 text-muted">
            该月份暂无动态
          </div>
        )}
      </div>
    </div>
  );
}
