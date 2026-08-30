"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFeedback } from "./FeedbackProvider";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const EASTER_EGGS: Record<string, { emoji: string; message: string; confetti?: boolean; particle?: "hearts" | "sparkles" }> = {
  "0125": { emoji: "\u{1F382}", message: "柏欣妤生日快乐！", confetti: true },
  "0422": { emoji: "🎂", message: "朱怡欣生日快乐！", confetti: true },
  "0520": { emoji: "\u{1F495}", message: "520 快乐！", particle: "hearts" },
};

export function EasterEggs() {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [easterEmoji, setEasterEmoji] = useState<string | null>(null);
  const { burstConfetti, spawnParticles } = useFeedback();

  const dismissNotification = () => {
    setNotification(null);
    setEasterEmoji(null);
  };

  const showNotification = useCallback((emoji: string, message: string, triggerConfetti = false, particle?: "hearts" | "sparkles") => {
    setEasterEmoji(emoji);
    setNotification(message);
    if (triggerConfetti) burstConfetti(4000);
    if (particle) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          spawnParticles(
            window.innerWidth / 2 + (Math.random() - 0.5) * 200,
            window.innerHeight / 2 + (Math.random() - 0.5) * 200,
            particle,
            8
          );
        }, i * 100);
      }
    }
    setTimeout(() => {
      setNotification(null);
      setEasterEmoji(null);
    }, 4000);
  }, [burstConfetti, spawnParticles]);

  // Konami code listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[konamiIndex]) {
        const next = konamiIndex + 1;
        if (next === KONAMI.length) {
          showNotification("\u{1F389}", "Konami 码解锁！你是真爱粉！", true, "hearts");
          setKonamiIndex(0);
        } else {
          setKonamiIndex(next);
        }
      } else {
        setKonamiIndex(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [konamiIndex, showNotification]);

  // Welcome message once per session + date-based easter eggs
  useEffect(() => {
    let welcomeTimer: ReturnType<typeof setTimeout> | undefined;
    if (!sessionStorage.getItem("cp-welcome-shown")) {
      sessionStorage.setItem("cp-welcome-shown", "1");
      welcomeTimer = setTimeout(() => {
        showNotification("\u{1F49C}", "欢迎来看柏里挑怡");
      }, 1400);
    }

    const now = new Date();
    const mmdd = `${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const egg = EASTER_EGGS[mmdd];
    let eggTimer: ReturnType<typeof setTimeout> | undefined;
    if (egg) {
      eggTimer = setTimeout(() => {
        showNotification(egg.emoji, egg.message, egg.confetti, egg.particle);
      }, 5500);
    }

    return () => {
      if (welcomeTimer) clearTimeout(welcomeTimer);
      if (eggTimer) clearTimeout(eggTimer);
    };
  }, [showNotification]);

  // Logo click easter egg (rapid 5 clicks within 3s)
  useEffect(() => {
    const logo = document.querySelector('a[href="/"]');
    if (!logo) return;
    let clicks: number[] = [];
    const handler = (e: Event) => {
      const me = e as MouseEvent;
      const now = Date.now();
      clicks = [...clicks.filter((t) => now - t < 3000), now];
      if (clicks.length >= 5) {
        clicks = [];
        showNotification("\u{1F43E}", "你发现了隐藏萌宠！", true, "hearts");
      } else if (clicks.length >= 3) {
        spawnParticles(me.clientX, me.clientY, "sparkles", 5);
      }
    };
    logo.addEventListener("click", handler);
    return () => logo.removeEventListener("click", handler);
  }, [showNotification, spawnParticles]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 24, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-20 right-4 sm:right-6 z-[200] max-w-[calc(100vw-2rem)] px-4 py-3 sm:px-5 rounded-2xl bg-surface/95 backdrop-blur-lg border border-cp/25 shadow-lg flex items-center gap-3"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span aria-hidden="true" className="text-3xl animate-bounce-in">{easterEmoji}</span>
          <span className="text-sm font-bold text-foreground whitespace-nowrap">{notification}</span>
          <button
            type="button"
            onClick={dismissNotification}
            className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            aria-label="关闭提示"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
