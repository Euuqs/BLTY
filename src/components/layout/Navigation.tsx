"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useFeedback } from "@/components/ui/FeedbackProvider";
import { SearchPalette } from "@/components/ui/SearchPalette";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { MetaIcon } from "@/components/ui/MetaIcon";

const navItems = [
  { href: "/", label: "首页", mono: "00" },
  { href: "/same-styles", label: "同款", mono: "01" },
  { href: "/schedule", label: "行程", mono: "02" },
  { href: "/feed", label: "动态", mono: "03" },
  { href: "/tour", label: "巡演", mono: "05" },
];

export function Navigation() {
  const pathname = usePathname();
  const { createRipple } = useFeedback();
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const [mobileNavHasMore, setMobileNavHasMore] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const nav = mobileNavRef.current;
    if (!nav) return;
    const updateHint = () => {
      setMobileNavHasMore(nav.scrollWidth - nav.clientWidth - nav.scrollLeft > 8);
    };
    updateHint();
    window.addEventListener("resize", updateHint);
    return () => window.removeEventListener("resize", updateHint);
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between h-16">
        <Link
          href="/"
          prefetch={false}
          className="flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap group ripple-container rounded-lg px-2 py-1 -mx-2"
          onClick={(e) => createRipple(e)}
        >
          <div className="relative flex items-center -space-x-1">
            <motion.span
              whileHover={{ scale: 1.3 }}
              className="w-3 h-3 rounded-full bg-bai shadow-[0_0_8px_oklch(0.92_0.01_260/0.6)] z-10"
            />
            <motion.span
              whileHover={{ scale: 1.3 }}
              className="w-3 h-3 rounded-full bg-zhu shadow-[0_0_8px_oklch(0.55_0.20_250/0.6)]"
            />
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground group-hover:text-cp transition-colors duration-300">
            柏里挑怡
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={
                    "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 btn-press ripple-container border border-transparent " +
                    (active
                      ? "text-foreground bg-surface-2 border border-cp/20"
                      : "text-muted hover:text-foreground hover:bg-surface")
                  }
                  onClick={(e) => createRipple(e)}
                >
                  <span
                    className={`font-mono text-[9px] tracking-[0.2em] ${
                      active ? "text-cp opacity-90" : "opacity-40"
                    }`}
                  >
                    {item.mono}
                  </span>
                  <span>{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-bai via-cp to-zhu shadow-[0_0_8px_oklch(0.65_0.22_295/0.5)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border/50">
            <SearchPalette />
            <div className="hidden lg:flex items-center gap-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  createRipple(e);
                  window.dispatchEvent(new Event("open-feedback"));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/50 border border-border text-muted text-xs font-mono hover:border-cp/40 hover:text-foreground transition-all btn-press ripple-container"
                aria-label="提意见"
                title="意见箱"
              >
                <MetaIcon name="lightbulb" className="w-3.5 h-3.5" />
                <span className="hidden md:inline">意见</span>
              </motion.button>
              <ThemeToggle />
              <SoundToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden relative">
        <div
          ref={mobileNavRef}
          onScroll={() => {
            const nav = mobileNavRef.current;
            if (nav) setMobileNavHasMore(nav.scrollWidth - nav.clientWidth - nav.scrollLeft > 8);
          }}
          className="flex items-center gap-1 pb-2 px-4 pr-12 overflow-x-auto scrollbar-hide safe-bottom snap-x-mandatory"
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={
                  "relative flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap shrink-0 ripple-container btn-press snap-center min-h-[44px] border border-transparent " +
                  (active
                    ? "text-foreground bg-surface-2 border border-cp/20"
                    : "text-muted hover:text-foreground hover:bg-surface/60")
                }
                onClick={(e) => createRipple(e)}
              >
                <span className={`font-mono text-[9px] ${active ? "text-cp" : "opacity-40"}`}>
                  {item.mono}
                </span>
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-bai via-cp to-zhu shadow-[0_0_8px_oklch(0.65_0.22_295/0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border/50 shrink-0">
            <ThemeToggle />
            <SoundToggle />
          </div>
        </div>
        {mobileNavHasMore && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 bottom-2 flex w-10 items-center justify-end bg-gradient-to-l from-background via-background/90 to-transparent pr-2 text-lg text-cp/80"
          >
            ›
          </span>
        )}
      </div>
    </nav>
  );
}
