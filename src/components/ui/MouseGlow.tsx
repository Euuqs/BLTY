"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function MouseGlow() {
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 200, damping: 30 });
  const springY = useSpring(y, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (isTouch) return;

    const handleMove = (e: MouseEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) {
        setIsTouch(true);
        return;
      }
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [x, y, visible, isTouch]);

  if (isTouch) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] opacity-0 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
          background:
            "radial-gradient(600px circle at center, oklch(0.75 0.18 295 / 0.08), transparent 60%)",
        }}
        className="absolute -left-[300px] -top-[300px] w-[600px] h-[600px] rounded-full"
      />
    </motion.div>
  );
}
