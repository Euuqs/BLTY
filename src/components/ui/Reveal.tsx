"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  blur?: boolean;
  once?: boolean;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0,
  direction = "up",
  blur = false,
  once = true,
}: RevealProps) {
  const offset = direction === "up" ? 26 : direction === "down" ? -26 : direction === "left" ? 26 : direction === "right" ? -26 : 0;
  const scale = direction === "scale" ? 0.92 : 1;

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction !== "left" && direction !== "right" ? offset : 0,
      x: direction === "left" || direction === "right" ? offset : 0,
      scale,
      filter: blur ? "blur(10px)" : undefined,
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: blur ? "blur(0px)" : undefined,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  if (staggerDelay > 0) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once, margin: "-60px" }}
        className={className}
      >
        <motion.div variants={itemVariants} className="contents">
          {children}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: direction !== "left" && direction !== "right" ? offset : 0,
        x: direction === "left" || direction === "right" ? offset : 0,
        scale,
        filter: blur ? "blur(10px)" : undefined,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: blur ? "blur(0px)" : undefined,
      }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealChildren({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
