"use client";

import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { useFeedback } from "./FeedbackProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { createRipple, spawnParticles } = useFeedback();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    const rect = e.currentTarget.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, "sparkles", 5);
    toggleTheme();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="relative w-11 h-11 lg:w-9 lg:h-9 rounded-lg bg-surface/50 border border-border flex items-center justify-center text-muted hover:text-cp transition-colors btn-press overflow-hidden"
      aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="text-base"
          >
            {"\u2600"}
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="text-base"
          >
            {"\u263E"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
