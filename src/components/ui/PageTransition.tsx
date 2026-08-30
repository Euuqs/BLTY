"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const navProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    mass: 0.5,
  });

  return (
    <>
      <motion.div
        key={`page-bar-${pathname}`}
        initial={{ scaleX: 0, opacity: 0.8 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          scaleX: navProgress,
          transformOrigin: "0% 50%",
        }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[70] bg-gradient-to-r from-bai via-cp to-zhu rounded-b shadow-[0_0_10px_oklch(0.65_0.22_295/0.5)]"
      />
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.995 }}
        transition={{
          opacity: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
