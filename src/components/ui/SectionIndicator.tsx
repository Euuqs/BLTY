"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function SectionIndicator({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      let currentId = sections[0]?.id ?? "";

      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollY) {
          currentId = id;
        }
      }

      setActiveId(currentId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sections]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      aria-label="页面段落导航"
      className="fixed left-3 md:left-5 z-40 hidden lg:flex flex-col items-center gap-3"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      {sections.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className="group relative flex items-center"
            aria-label={`跳转到${label}`}
          >
            <span
              className={`section-dot block rounded-full border transition-all duration-300 ${
                isActive
                  ? "w-2.5 h-2.5 bg-cp border-cp shadow-[0_0_12px_oklch(0.65_0.22_295/0.5)]"
                  : "w-1.5 h-1.5 bg-muted/40 border-muted/30 hover:bg-muted/60 hover:border-muted/50"
              }`}
            />
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: -8, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -8, width: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-full mr-3 whitespace-nowrap text-[10px] font-mono text-foreground bg-surface/80 backdrop-blur px-2 py-1 rounded border border-border/50"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </motion.nav>
  );
}
