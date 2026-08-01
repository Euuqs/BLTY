"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface BentoTileProps {
  children: ReactNode;
  className?: string;
  colSpan?: string;
  rowSpan?: string;
  onClick?: () => void;
  interactive?: boolean;
  noPadding?: boolean;
}

export function BentoTile({
  children,
  className = "",
  colSpan,
  rowSpan,
  onClick,
  interactive = false,
  noPadding = false,
}: BentoTileProps) {
  const baseClass = `bento-tile ${noPadding ? "" : "p-5 md:p-6"} flex flex-col`;
  const spanClass = [colSpan, rowSpan].filter(Boolean).join(" ");

  if (interactive) {
    return (
      <motion.div
        layout
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={`${baseClass} ${spanClass} ${className} cursor-pointer`}
        onClick={onClick}
        tabIndex={0}
        role="button"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClass} ${spanClass} ${className}`}>
      {children}
    </div>
  );
}
