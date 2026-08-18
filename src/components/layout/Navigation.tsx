"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useFeedback } from "@/components/ui/FeedbackProvider";
import { SearchPalette } from "@/components/ui/SearchPalette";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SoundToggle } from "@/components/ui/SoundToggle";

const navItems = [
  { href: "/", label: "首页", mono: "00" },
  { href: "/same-styles", label: "同款", mono: "01" },
  { href: "/schedule", label: "行程", mono: "02" },
  { href: "/feed", label: "动态", mono: "03" },
];

export function Navigation() {
  const pathname = usePathname();
  const { createRipple } = useFeedback();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between h-16">
        <Link
          href="/"
          prefetch={false}
          className="flex items-center gap-2.5 group ripple-container rounded-lg px-2 py-1 -mx-2"
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
          <div className="hidden sm:flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={
                    "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 btn-press ripple-container " +
                    (active
                      ? "text-foreground bg-surface"
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
                      className="absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-bai via-cp to-zhu"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border/50">
            <SearchPalette />
            <div className="hidden sm:flex items-center gap-1.5">
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
                <span>{"\u{1F4A1}"}</span>
                <span className="hidden md:inline">意见</span>
              </motion.button>
              <ThemeToggle />
              <SoundToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex items-center justify-center gap-1 pb-2 px-4 overflow-x-auto safe-bottom">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={
                "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ripple-container btn-press " +
                (active
                  ? "text-foreground bg-surface"
                  : "text-muted hover:text-foreground hover:bg-surface/60")
              }
              onClick={(e) => createRipple(e)}
            >
              <span className={`font-mono text-[9px] ${active ? "text-cp" : "opacity-40"}`}>
                {item.mono}
              </span>
              {item.label}
            </Link>
          );
        })}
        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border/50">
          <ThemeToggle />
          <SoundToggle />
        </div>
      </div>
    </nav>
  );
}
