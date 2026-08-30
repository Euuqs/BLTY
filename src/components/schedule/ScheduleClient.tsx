"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BentoTile } from "@/components/bento/BentoTile";
import { MonthFilter } from "@/components/ui/MonthFilter";
import { TypeIcon } from "@/components/ui/TypeIcon";
import { MetaIcon } from "@/components/ui/MetaIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFeedback } from "@/components/ui/FeedbackProvider";
import { useNow } from "@/lib/useNow";
import { formatMonth, formatDay, formatWeekday } from "@/lib/date";
import type { Schedule } from "@/lib/velite";

const getDot = (m: string) => m === "A" ? "dot-bai" : m === "B" ? "dot-zhu" : "dot-cp";
const getLabel = (m: string) => m === "A" ? "柏欣妤" : m === "B" ? "朱怡欣" : "双人";
const getColor = (m: string) => m === "A" ? "text-bai" : m === "B" ? "text-zhu" : "text-gradient-cp";

type MemberFilter = "all" | "A" | "B" | "both";

const memberOptions: { key: MemberFilter; label: string; dot: string; activeClass: string }[] = [
  { key: "all", label: "全部", dot: "", activeClass: "bg-cp text-background border-cp shadow-[0_0_0_1px_oklch(0.65_0.22_295/0.25)]" },
  { key: "A", label: "柏欣妤", dot: "dot-bai", activeClass: "bg-bai text-background border-bai shadow-[0_0_0_1px_oklch(0.92_0.01_260/0.25)]" },
  { key: "B", label: "朱怡欣", dot: "dot-zhu", activeClass: "bg-zhu text-background border-zhu shadow-[0_0_0_1px_oklch(0.55_0.20_250/0.25)]" },
  { key: "both", label: "双人", dot: "dot-cp", activeClass: "bg-cp text-background border-cp shadow-[0_0_0_1px_oklch(0.65_0.22_295/0.25)]" },
];

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

const scheduleTimeLabel = (item: Schedule) => {
  if (item.timeMode === "all-day") return "全天";
  if (item.timeMode === "tbd") return "待定";
  return item.time ?? "待定";
};

interface ScheduleClientProps {
  schedules: Schedule[];
}

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

function CalendarGrid({
  year,
  month,
  items,
  selectedDate,
  onSelectDate,
}: {
  year: number;
  month: number;
  items: Schedule[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}) {
  const { createRipple } = useFeedback();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const offset = (firstDay + 6) % 7;
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
    <div className="grid grid-cols-7 gap-0.5 sm:gap-1.5">
      {WEEKDAYS.map((w) => (
        <div key={w} className="text-center text-[9px] sm:text-[10px] font-mono text-muted/60 py-1">{w}</div>
      ))}
      {cells.map((day, i) => {
        if (day === null) return <div key={`e${i}`} />;
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayItems = items.filter((s) => s.date.slice(0, 10) === dateStr);
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === selectedDate;
        const hasEvents = dayItems.length > 0;
        const MAX_SHOW = 3;
        const extra = dayItems.length - MAX_SHOW;
        return (
          <button
            type="button"
            key={dateStr}
            disabled={!hasEvents}
            aria-label={`${year}年${month}月${day}日${hasEvents ? `，${dayItems.length}项行程` : "，无行程"}`}
            aria-pressed={isSelected}
            onClick={(e) => {
              if (hasEvents) {
                createRipple(e);
                onSelectDate(isSelected ? null : dateStr);
              }
            }}
            className={`min-h-[2.8rem] sm:min-h-[3.4rem] rounded-lg border p-1 sm:p-1.5 flex flex-col gap-0.5 sm:gap-1 transition-colors ${
              hasEvents ? "cursor-pointer hover:border-cp/60" : ""
            } ${
              isSelected
                ? "border-cp bg-cp/15 ring-1 ring-cp/30"
                : isToday
                  ? "border-cp/60 bg-cp/10"
                  : hasEvents
                    ? "border-cp/30 bg-surface-2/50"
                    : "border-border/40 bg-surface/30"
            }`}
          >
            <span
              className={`text-[11px] sm:text-xs font-mono leading-none ${
                isToday ? "text-cp font-semibold" : isSelected ? "text-cp" : hasEvents ? "text-foreground/80" : "text-muted/40"
              }`}
            >
              {day}
            </span>
            {/* 移动端只显示圆点指示器，sm 以上显示文字 */}
            <div className="hidden sm:flex sm:flex-col gap-1">
              {dayItems.slice(0, MAX_SHOW).map((s) => (
                <div key={s.slug} className="flex items-center gap-1 min-w-0" title={`${s.title} · ${scheduleTimeLabel(s)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDot(s.member)}`} />
                  <span className="truncate text-[10px] font-mono text-foreground/75 leading-tight">{s.title}</span>
                </div>
              ))}
              {extra > 0 && <span className="text-[9px] font-mono text-muted/60 leading-none">+{extra} 项</span>}
            </div>
            {/* 移动端：圆点行 */}
            {hasEvents && (
              <div className="flex sm:hidden items-center gap-0.5 mt-auto flex-wrap">
                {dayItems.slice(0, 4).map((s) => (
                  <span key={s.slug} className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDot(s.member)}`} />
                ))}
                {dayItems.length > 4 && <span className="text-[8px] text-muted/60 leading-none">+{dayItems.length - 4}</span>}
              </div>
            )}
          </button>
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
    const startMinutes = toMinutes(item.time);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    if (startMinutes !== null && currentMinutes >= startMinutes && currentMinutes <= startMinutes + 180) {
      return { text: "进行中", cls: "text-rose border-rose/50 bg-rose/10" };
    }
    return { text: "今天", cls: "text-cp border-cp/50 bg-cp/10" };
  }
  const diffDays = Math.round(
    (new Date(dateStr + "T00:00:00").getTime() - new Date(todayStr + "T00:00:00").getTime()) / 86400000
  );
  if (diffDays === 1) return { text: "明天", cls: "text-cp border-cp/40" };
  return { text: `还有 ${diffDays} 天`, cls: "text-cp/80 border-cp/30 bg-cp/5" };
}

export function ScheduleClient({ schedules }: ScheduleClientProps) {
  const allMonths = [...new Set(schedules.map(s => formatMonth(s.date)))].sort().reverse();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberFilter>("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const now = useNow();
  const { createRipple } = useFeedback();

  const currentMonth = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const isCurrentMonth = selectedMonth === currentMonth;

  const filteredSchedules = useMemo(() => {
    return schedules
      .filter((s) => {
        const monthMatch = !selectedMonth || formatMonth(s.date) === selectedMonth;
        const memberMatch = selectedMember === "all" || s.member === selectedMember;
        return monthMatch && memberMatch;
      })
      .sort(sortByTime);
  }, [schedules, selectedMonth, selectedMember]);

  const selectedDateItems = useMemo(() => {
    if (!selectedDate) return [];
    return filteredSchedules
      .filter((s) => s.date.slice(0, 10) === selectedDate)
      .sort(sortByTime);
  }, [filteredSchedules, selectedDate]);

  const goToToday = (e: React.MouseEvent<HTMLElement>) => {
    createRipple(e);
    setSelectedMonth(currentMonth);
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setSelectedDate(todayStr);
    if (view !== "calendar") setView("calendar");
  };

  const grouped = filteredSchedules.reduce<Record<string, Schedule[]>>((acc, s) => {
    const month = formatMonth(s.date);
    if (!acc[month]) acc[month] = [];
    acc[month].push(s);
    return acc;
  }, {});
  const months = Object.keys(grouped).sort().reverse();

  return (
    <div className="schedule-page flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <MonthFilter
          months={allMonths}
          selectedMonth={selectedMonth}
          onSelectMonth={(m) => {
            setSelectedMonth(m);
            setSelectedDate(null);
          }}
        />

        {/* 成员筛选 */}
        <div role="group" aria-label="按成员筛选" className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 overflow-x-auto sm:overflow-visible scrollbar-hide pb-1 sm:pb-0">
          {memberOptions.map((opt) => (
            <motion.button
              key={opt.key}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                createRipple(e);
                setSelectedMember(opt.key);
                setSelectedDate(null);
              }}
                aria-pressed={selectedMember === opt.key}
                className={`relative overflow-hidden shrink-0 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all duration-200 btn-press ripple-container ${
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

        <div className="flex items-center gap-2 flex-wrap">
          <div role="group" aria-label="切换行程视图" className="flex items-center gap-1.5 w-fit bg-surface/60 border border-border rounded-full p-1">
            {(["list", "calendar"] as const).map((v) => (
              <motion.button
                key={v}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  createRipple(e);
                  setView(v);
                }}
                aria-pressed={view === v}
                aria-label={v === "list" ? "列表视图" : "月历视图"}
                className={"relative overflow-hidden px-3.5 py-1 rounded-full text-[10px] font-mono transition-all duration-200 btn-press ripple-container " +
                  (view === v
                    ? "bg-cp text-background shadow-[0_0_0_1px_oklch(0.65_0.22_295/0.25)]"
                    : "text-muted hover:text-foreground")}
              >
                {v === "list" ? "列表" : "月历"}
              </motion.button>
            ))}
          </div>
          {!isCurrentMonth && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToToday}
              className="relative overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono border border-cp/40 bg-cp/10 text-cp hover:bg-cp/20 transition-all btn-press ripple-container"
            >
              <MetaIcon name="pin" className="w-3.5 h-3.5" /> 回到今日
            </motion.button>
          )}
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
                <BentoTile className="schedule-calendar p-5">
                  <CalendarGrid
                    year={y}
                    month={m}
                    items={grouped[month]}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-border/60">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-muted">点击日期查看详情，共 {grouped[month].length} 项</span>
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
                  {selectedDate && selectedDate.startsWith(month) && selectedDateItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-cp/20"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-xs text-cp">{selectedDate}</span>
                        <span className="text-[10px] font-mono text-muted">共 {selectedDateItems.length} 项行程</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {selectedDateItems.map((item) => (
                          <div
                            key={item.slug}
                            className="flex items-start gap-3 p-3 rounded-lg bg-surface-2/50 border border-border/40"
                          >
                            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getDot(item.member)}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className={`text-[10px] font-mono ${getColor(item.member)}`}>{getLabel(item.member)}</span>
                                {item.type && (
                                  <>
                                    <span className="text-muted/30 text-[10px]">{"\u00B7"}</span>
                                    <TypeIcon name={item.type} className="w-3 h-3 text-cp" />
                                    <span className="text-[10px] font-mono text-cp/80 uppercase tracking-wider">{item.type}</span>
                                  </>
                                )}
                                <span className="text-[10px] font-mono text-muted ml-auto inline-flex items-center gap-1"><MetaIcon name="clock" className="w-3 h-3" />{scheduleTimeLabel(item)}</span>
                              </div>
                              <h4 className="font-serif text-sm font-semibold mb-1">{item.title}</h4>
                              {item.location && <p className="text-[11px] text-muted font-mono inline-flex items-center gap-1"><MetaIcon name="pin" className="w-3 h-3 shrink-0" />{item.location}</p>}
                              {item.description && <p className="text-xs text-muted/70 leading-relaxed mt-1">{item.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </BentoTile>
              ) : (
                <div className="schedule-list grid grid-cols-1 md:grid-cols-2 gap-3">
                  {grouped[month].map((item) => {
                    const status = getStatus(item, now);
                    return (
                      <BentoTile key={item.slug} id={item.slug} className="schedule-entry flex-row items-start gap-4">
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
                          {(item.timeMode || item.time || item.location) && (
                            <p className="text-xs text-muted font-mono flex items-center gap-2 flex-wrap">
                              <span className="inline-flex items-center gap-1"><MetaIcon name="clock" className="w-3 h-3" />{scheduleTimeLabel(item)}</span>
                              {item.location && <span className="inline-flex items-center gap-1"><MetaIcon name="pin" className="w-3 h-3" />{item.location}</span>}
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
