"use client";

import { useState } from "react";
import { BentoTile } from "@/components/bento/BentoTile";
import { MonthFilter } from "@/components/ui/MonthFilter";
import { formatMonth, formatDay, formatWeekday } from "@/lib/date";
import type { Schedule } from "@/lib/velite";

const getDot = (m: string) => m === "A" ? "dot-bai" : m === "B" ? "dot-zhu" : "dot-cp";
const getLabel = (m: string) => m === "A" ? "柏欣妤" : m === "B" ? "朱怡欣" : "双人";
const getColor = (m: string) => m === "A" ? "text-bai" : m === "B" ? "text-zhu" : "text-gradient-cp";

interface ScheduleClientProps {
  schedules: Schedule[];
}

export function ScheduleClient({ schedules }: ScheduleClientProps) {
  const allMonths = [...new Set(schedules.map(s => formatMonth(s.date)))].sort().reverse();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const filteredSchedules = selectedMonth
    ? schedules.filter(s => formatMonth(s.date) === selectedMonth)
    : schedules;

  const grouped = filteredSchedules.reduce<Record<string, Schedule[]>>((acc, s) => {
    const month = formatMonth(s.date);
    if (!acc[month]) acc[month] = [];
    acc[month].push(s);
    return acc;
  }, {});
  const months = Object.keys(grouped).sort().reverse();

  return (
    <div className="flex flex-col gap-8">
      <MonthFilter
        months={allMonths}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
      />

      <div className="flex flex-col gap-8">
        {months.map((month) => (
          <section key={month}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-mono text-sm tracking-wider text-cp">{month}</h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] font-mono text-muted">{grouped[month].length} 项</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {grouped[month].map((item) => (
                <BentoTile key={item.slug} className="flex-row items-start gap-4">
                  <div className="flex flex-col items-center min-w-[3.5rem]">
                    <span className="font-mono text-[10px] text-muted">
                      {formatWeekday(item.date)}
                    </span>
                    <span className="font-serif text-3xl font-semibold text-foreground">
                      {formatDay(item.date)}
                    </span>
                  </div>
                  <div className="w-px self-stretch bg-border/60" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className={"w-1.5 h-1.5 rounded-full " + getDot(item.member)} />
                      <span className={"text-[10px] font-mono " + getColor(item.member)}>{getLabel(item.member)}</span>
                      {item.type && (
                        <>
                          <span className="text-muted/30 text-[10px]">{"\u00B7"}</span>
                          <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{item.type}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-semibold">{item.title}</h3>
                    {(item.time || item.location) && (
                      <p className="text-xs text-muted font-mono flex items-center gap-2 flex-wrap">
                        {item.time && <span>⏰ {item.time}</span>}
                        {item.location && <span>📍 {item.location}</span>}
                      </p>
                    )}
                    {item.description && <p className="text-xs text-muted/70 leading-relaxed">{item.description}</p>}
                  </div>
                </BentoTile>
              ))}
            </div>
          </section>
        ))}
        {months.length === 0 && (
          <div className="text-center py-12 text-muted">
            该月份暂无行程
          </div>
        )}
      </div>
    </div>
  );
}
