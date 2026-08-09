"use client";

import { DogMascot, PigMascot, Rose } from "@/components/mascot/Mascots";
import { useNow } from "@/lib/useNow";

const BIRTHDAYS = [
  { key: "bai", name: "柏欣妤", month: 1, day: 25, icon: DogMascot, dot: "dot-bai", text: "text-bai" },
  { key: "fan", name: "粉丝", month: 2, day: 27, icon: Rose, dot: "dot-rose", text: "text-rose" },
  { key: "zhu", name: "朱怡欣", month: 4, day: 22, icon: PigMascot, dot: "dot-zhu", text: "text-zhu" },
] as const;

function diffDays(target: Date, now: Date) {
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((t.getTime() - n.getTime()) / 86400000);
}

export function BirthdayCountdown() {
  const now = useNow();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {BIRTHDAYS.map(({ key, name, month, day, icon: Icon, dot, text }) => {
        let thisYear = new Date(now.getFullYear(), month - 1, day);
        if (diffDays(thisYear, now) < 0) thisYear = new Date(now.getFullYear() + 1, month - 1, day);
        const days = diffDays(thisYear, now);
        const isToday = days === 0;

        return (
          <div
            key={key}
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-surface/60 border border-border backdrop-blur-sm"
          >
            <div className="relative shrink-0">
              <Icon className="w-9 h-9 opacity-90 relative" />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${dot}`} />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-muted tracking-wider truncate">
                {name}生日 {"\u00B7"} {month}月{day}日
              </p>
              <p className={`font-serif text-lg font-semibold mt-0.5 ${text}`}>
                {isToday ? "就是今天" : `还有 ${days} 天`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
