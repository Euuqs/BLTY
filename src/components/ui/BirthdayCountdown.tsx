"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DogMascot, PigMascot, Rose } from "@/components/mascot/Mascots";
import { useNow } from "@/lib/useNow";
import { useFeedback } from "@/components/ui/FeedbackProvider";

const BIRTHDAYS = [
  {
    key: "bai",
    name: "柏欣妤",
    month: 1,
    day: 25,
    icon: DogMascot,
    dot: "dot-bai",
    text: "text-bai",
    glow: "from-bai/20",
    border: "hover:border-bai/40",
    emoji: "\u{1F436}",
    message: "小白狗生日快乐！",
  },
  {
    key: "fan",
    name: "粉丝",
    month: 2,
    day: 27,
    icon: Rose,
    dot: "dot-rose",
    text: "text-rose",
    glow: "from-rose/20",
    border: "hover:border-rose/40",
    emoji: "\u{1F339}",
    message: "感谢一直陪伴的你们！",
  },
  {
    key: "zhu",
    name: "朱怡欣",
    month: 4,
    day: 22,
    icon: PigMascot,
    dot: "dot-zhu",
    text: "text-zhu",
    glow: "from-zhu/20",
    border: "hover:border-zhu/40",
    emoji: "\u{1F437}",
    message: "小猪生日快乐！",
  },
] as const;

function diffDays(target: Date, now: Date) {
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((t.getTime() - n.getTime()) / 86400000);
}

function CountdownNumber({ days, isToday }: { days: number; isToday: boolean }) {
  const [displayDays, setDisplayDays] = useState(days);

  useEffect(() => {
    const start = displayDays;
    const end = days;
    if (start === end) return;

    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayDays(Math.round(start + (end - start) * easeOut));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [days, displayDays]);

  if (isToday) {
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="font-serif text-lg font-semibold text-cp"
      >
        就是今天
        <motion.span
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          className="inline-block ml-1"
        >
          {"\u{1F389}"}
        </motion.span>
      </motion.span>
    );
  }

  return (
    <span className="font-serif text-lg font-semibold">
      还有 <motion.span
        key={displayDays}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="tabular-nums"
      >
        {displayDays}
      </motion.span> 天
    </span>
  );
}

export function BirthdayCountdown() {
  const now = useNow();
  const { spawnParticles, burstConfetti } = useFeedback();
  const [celebratedKey, setCelebratedKey] = useState<string | null>(null);

  const handleCardClick = (
    e: React.MouseEvent<HTMLDivElement>,
    birthday: typeof BIRTHDAYS[number],
    isToday: boolean
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (isToday && celebratedKey !== birthday.key) {
      burstConfetti(3000);
      setCelebratedKey(birthday.key);
    } else {
      spawnParticles(x, y, "hearts", 8);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {BIRTHDAYS.map(({ key, name, month, day, icon: Icon, dot, text, glow, border, emoji, message }) => {
        let thisYear = new Date(now.getFullYear(), month - 1, day);
        if (diffDays(thisYear, now) < 0) thisYear = new Date(now.getFullYear() + 1, month - 1, day);
        const days = diffDays(thisYear, now);
        const isToday = days === 0;
        const isSoon = days > 0 && days <= 7;

        return (
          <motion.div
            key={key}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleCardClick(e, { key, name, month, day, icon: Icon, dot, text, glow, border, emoji, message } as typeof BIRTHDAYS[number], isToday)}
            className={`
              group relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl
              bg-surface/60 border backdrop-blur-sm cursor-pointer
              transition-all duration-300 overflow-hidden
              ${isToday
                ? "border-cp/60 pulse-glow bg-gradient-to-br " + glow + " to-transparent"
                : "border-border " + border
              }
            `}
          >
            {isSoon && !isToday && (
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-2 right-2"
              >
                <span className="text-xs">{"\u{1F525}"}</span>
              </motion.div>
            )}

            <div className="relative shrink-0">
              <motion.div
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon className="w-9 h-9 opacity-90 relative" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${dot}`} />
              </motion.div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] text-muted tracking-wider truncate">
                {name}生日 {"\u00B7"} {month}月{day}日
              </p>
              <div className={text}>
                <CountdownNumber days={days} isToday={isToday} />
              </div>
            </div>

            <AnimatePresence>
              {isToday && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="text-2xl"
                >
                  {emoji}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
}
