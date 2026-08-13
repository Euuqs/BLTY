"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useFeedback } from "@/components/ui/FeedbackProvider";

interface BentoTileProps {
  children: ReactNode;
  className?: string;
  colSpan?: string;
  rowSpan?: string;
  id?: string;
  onClick?: () => void;
  href?: string;
  interactive?: boolean;
  noPadding?: boolean;
  feedbackType?: "hearts" | "sparkles" | "none";
}

export function BentoTile({
  children,
  className = "",
  colSpan,
  rowSpan,
  id,
  onClick,
  href,
  interactive = false,
  noPadding = false,
  feedbackType = "sparkles",
}: BentoTileProps) {
  const { createRipple } = useFeedback();

  const baseClass = `bento-tile ${noPadding ? "" : "p-5 md:p-6"} flex flex-col`;
  const spanClass = [colSpan, rowSpan].filter(Boolean).join(" ");

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (interactive && feedbackType !== "none") {
      createRipple(e);
    }
    onClick?.();
  };

  const isLink = Boolean(href);

  if (interactive) {
    if (isLink) {
      return (
        <a
          id={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          tabIndex={0}
          className={`${baseClass} ${spanClass} ${className} cursor-pointer ripple-container gradient-border bento-tile-interactive`}
        >
          {children}
        </a>
      );
    }

    return (
      <motion.div
        id={id}
        layout
        whileHover={{ y: -4, scale: 1.015 }}
        whileTap={{ scale: 0.98, y: -1 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className={`${baseClass} ${spanClass} ${className} cursor-pointer ripple-container gradient-border`}
        onClick={handleClick}
        tabIndex={0}
        role="button"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div id={id} className={`${baseClass} ${spanClass} ${className}`}>
      {children}
    </div>
  );
}
