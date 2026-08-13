"use client";

import { motion } from "motion/react";
import { useFeedback } from "./FeedbackProvider";

interface MonthFilterProps {
  months: string[];
  selectedMonth: string | null;
  onSelectMonth: (month: string | null) => void;
  label?: string;
}

export function MonthFilter({ months, selectedMonth, onSelectMonth, label = "全部" }: MonthFilterProps) {
  const { createRipple } = useFeedback();

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      <motion.button
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          createRipple(e);
          onSelectMonth(null);
        }}
        className={`relative overflow-hidden text-[10px] font-mono px-3 py-2 sm:py-1.5 rounded-full border transition-all btn-press ripple-container ${
          selectedMonth === null
            ? "bg-cp text-background border-cp shadow-[0_0_12px_oklch(0.65_0.22_295/0.4)]"
            : "bg-transparent text-muted border-border hover:border-cp/50 hover:text-cp/80"
        }`}
      >
        {label}
      </motion.button>
      {months.map((month) => (
        <motion.button
          key={month}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            createRipple(e);
            onSelectMonth(month);
          }}
          className={`relative overflow-hidden text-[10px] font-mono px-3 py-2 sm:py-1.5 rounded-full border transition-all btn-press ripple-container ${
            selectedMonth === month
              ? "bg-cp text-background border-cp shadow-[0_0_12px_oklch(0.65_0.22_295/0.4)]"
              : "bg-transparent text-muted border-border hover:border-cp/50 hover:text-cp/80"
          }`}
        >
          {month}
        </motion.button>
      ))}
    </div>
  );
}
