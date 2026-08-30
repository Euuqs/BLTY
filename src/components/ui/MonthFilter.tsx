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
    <div role="group" aria-label="按月份筛选" className="flex flex-nowrap sm:flex-wrap gap-1.5 sm:gap-2 overflow-x-auto sm:overflow-visible scrollbar-hide pb-1 sm:pb-0">
      <motion.button
        type="button"
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          createRipple(e);
          onSelectMonth(null);
        }}
        aria-pressed={selectedMonth === null}
        className={`relative overflow-hidden shrink-0 text-[10px] font-mono px-3 py-2 sm:py-1.5 rounded-full border transition-all btn-press ripple-container ${
          selectedMonth === null
            ? "bg-cp text-background border-cp shadow-[0_0_0_1px_oklch(0.65_0.22_295/0.25)]"
            : "bg-transparent text-muted border-border hover:border-cp/50 hover:text-cp/80"
        }`}
      >
        {label}
      </motion.button>
      {months.map((month) => (
        <motion.button
          key={month}
          type="button"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            createRipple(e);
            onSelectMonth(month);
          }}
          aria-pressed={selectedMonth === month}
          className={`relative overflow-hidden shrink-0 text-[10px] font-mono px-3 py-2 sm:py-1.5 rounded-full border transition-all btn-press ripple-container ${
            selectedMonth === month
              ? "bg-cp text-background border-cp shadow-[0_0_0_1px_oklch(0.65_0.22_295/0.25)]"
              : "bg-transparent text-muted border-border hover:border-cp/50 hover:text-cp/80"
          }`}
        >
          {month}
        </motion.button>
      ))}
    </div>
  );
}
