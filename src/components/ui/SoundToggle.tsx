"use client";

import { motion } from "motion/react";
import { useSound } from "./SoundProvider";

export function SoundToggle() {
  const { enabled, toggle } = useSound();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="relative w-9 h-9 rounded-lg bg-surface/50 border border-border flex items-center justify-center text-muted hover:text-cp transition-colors btn-press"
      aria-label={enabled ? "关闭音效" : "开启音效"}
      title={enabled ? "音效已开启" : "音效已关闭"}
    >
      <span className="text-sm">{enabled ? "\u{1F50A}" : "\u{1F507}"}</span>
    </motion.button>
  );
}
