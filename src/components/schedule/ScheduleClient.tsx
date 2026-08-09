"use client";

import { useMemo, useState } from "react";
import { BentoTile } from "@/components/bento/BentoTile";
import { MonthFilter } from "@/components/ui/MonthFilter";
import { TypeIcon } from "@/components/ui/TypeIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { useNow } from "@/lib/useNow";
import { formatMonth, formatDay, formatWeekday } from "@/lib/date";
import type { Schedule } from "@/lib/velite";

const getDot = (m: string) => m === "A" ? "dot-bai" : m === "B" ? "dot-zhu" : "dot-cp";
const getLabel = (m: string) => m === "A" ? "柏欣妤" : m === "B" ? "朱怡欣" : "双人";
const getColor = (m: string) => m === "A" ? "text-bai" : m === "B" ? "text-zhu" : "text-gradient-cp";

const toMinutes = (t?: string) => {
  if (!t) return null;
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
};

const sortByTime = (a: Schedule, b: Schedule) => {
  const diff = a.date.localeCompare(b.date);
  if (diff !== 0) return diff;
  return (toMinutes(a.time) ?? Number.MAX_SAFE_INTEGER) - (toMinutes(b.time) ?? Number.MAX_SAFE_INTEGER);
};

interface ScheduleClientProps {
  schedules: Schedule[];
}

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

function CalendarGrid({ year, month, items }: { year: number; month: number; items: Schedule[] }) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const offset = (firstDay + 6) % 7; // 周一起始
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const cells = [
    ...Array.from({ length: offset }, () => null as number | null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {WEEKDAYS.map((w) => (
        <div key={w} className="text-center text-[9px] font-mono text-muted/60 py-1">{w}</div>
      ))}
      {cells.map((day, i) => {
        if (day === null) return <div key={`e${i}`} />;
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayItems = items.filter((s) => s.date.slice(0, 10) === dateStr);
        const isToday = dateStr === todayStr;
        const MAX_SHOW = 3;
        const extra = dayItems.length - MAX_SHOW;
        return (
          <div
            key={dateStr}
            className={`min-h-[3.4rem] rounded-lg border p-1.5 flex flex-col gap-1 transition-colors ${
              isToday
                ? "border-cp/60 bg-cp/10"
                : dayItems.length
                  ? "border-cp/30 bg-surface-2/50"
                  : "border-border/40 bg-surface/30"
            }`}
          >
            <span
              className={`text-[11px] font-mono leading-none ${
                isToday ? "text-cp font-semibold" : dayItems.length ? "text-foreground/80" : "text-muted/40"
              }`}
            >
              {day}
            </span>
            {dayItems.slice(0, MAX_SHOW).map((s) => (
              <div
                key={s.slug}
                className="flex items-center gap-1 min-w-0"
                title={`${s.title}${s.time ? ` · ${s.time}` : ""}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDot(s.member)}`} />
                <span className="truncate text-[10px] font-mono text-foreground/75 leading-tight">
                  {s.title}
                </span>
              </div>
            ))}
            {extra > 0 && (
              <span className="text-[9px] font-mono text-muted/60 leading-none">+{extra} 项</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getStatus(item: Schedule, now: Date) {
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const dateStr = item.date.slice(0, 10);
  if (dateStr < todayStr) {
    return { text: "已结束", cls: "text-muted/50 border-border/50" };
  }
  if (dateStr === todayStr) {
    return { text: "今日", cls: "text-cp border-cp/50" };
  }
  const diffDays = Math.round(
    (new Date(dateStr + "T00:00:00").getTime() - new Date(todayStr + "T00:00:00").getTime()) / 86400000
  );
  if (diffDays === 1) return { text: "明天", cls: "text-cp border-cp/40" };
  return { text: `还有 ${diffDays} 天`, cls: "text-cp/80 border-cp/30" };
}

export function ScheduleClient({ schedules }: ScheduleClientProps) {
  const allMonths = [...new Set(schedules.map(s => formatMonth(s.date)))].sort().reverse();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");
  const now = useNow();

  const filteredSchedules = (selectedMonth
    ? schedules.filter(s => formatMonth(s.date) === selectedMonth)
    : [...schedules]).sort(sortByTime);

  const grouped = filteredSchedules.reduce<Record<string, Schedule[]>>((acc, s) => {
    const month = formatMonth(s.date);
    if (!acc[month]) acc[month] = [];
    acc[month].push(s);
    return acc;
  }, {});
  const months = Object.keys(grouped).sort().reverse();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <MonthFilter
          months={allMonths}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />
        <div className="flex items-center gap-1.5 w-fit bg-surface/60 border border-border rounded-full p-1">
          {(["list", "calendar"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={"px-3.5 py-1 rounded-full text-[10px] font-mono transition-all duration-200 " +
                (view === v
                  ? "bg-cp text-background shadow-[0_0_10px_oklch(0.65_0.22_295/0.4)]"
                  : "text-muted hover:text-foreground")}
            >
              {v === "list" ? "列表" : "月历"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {months.map((month) => {
          const [y, m] = month.split("-").map(Number);
          return (
            <section key={month}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-mono text-sm tracking-wider text-cp">{month}</h2>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] font-mono text-muted">{grouped[month].length} 项</span>
              </div>

              {view === "calendar" ? (
                <BentoTile className="p-5">
                  <CalendarGrid year={y} month={m} items={grouped[month]} />
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-border/60">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-muted">行程按日标注，共 {grouped[month].length} 项</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full dot-bai" /> 柏欣妤
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full dot-zhu" /> 朱怡欣
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full dot-cp" /> 双人
                    </span>
                  </div>
                </BentoTile>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {grouped[month].map((item) => {
                    const status = getStatus(item, now);
                    return (
                      <BentoTile key={item.slug} className="flex-row items-start gap-4">
                        <div className="flex flex-col items-center min-w-[3.5rem]">
                          <span className="font-mono text-[10px] text-muted">
                            {formatWeekday(item.date)}
                          </span>
                          <span className="font-serif text-3xl font-semibold text-foreground">
                            {formatDay(item.date)}
                          </span>
                          {status && (
                            <span className={`mt-1 px-2 py-0.5 rounded-full border text-[9px] font-mono ${status.cls}`}>
                              {status.text}
                            </span>
                          )}
                        </div>
                        <div className="w-px self-stretch bg-border/60" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={"w-1.5 h-1.5 rounded-full " + getDot(item.member)} />
                            <span className={"text-[10px] font-mono " + getColor(item.member)}>{getLabel(item.member)}</span>
                            {item.type && (
                              <>
                                <span className="text-muted/30 text-[10px]">{"\u00B7"}</span>
                                <TypeIcon name={item.type} className="w-3.5 h-3.5 text-cp" />
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
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
        {months.length === 0 && (
          <EmptyState message="该月份暂无行程" hint="换个月份看看" member="both" />
        )}
      </div>
    </div>
  );
}
