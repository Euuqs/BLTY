"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页", mono: "00" },
  { href: "/same-styles", label: "同款", mono: "01" },
  { href: "/schedule", label: "行程", mono: "02" },
  { href: "/feed", label: "动态", mono: "03" },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center -space-x-1">
            <span className="w-3 h-3 rounded-full bg-bai shadow-[0_0_8px_oklch(0.92_0.01_260/0.6)] z-10" />
            <span className="w-3 h-3 rounded-full bg-zhu shadow-[0_0_8px_oklch(0.55_0.20_250/0.6)]" />
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight text-foreground group-hover:text-cp transition-colors duration-300">
            柏里挑怡
          </span>
        </Link>
        <div className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 " +
                  (active ? "text-foreground bg-surface" : "text-muted hover:text-foreground hover:bg-surface")
                }
              >
                <span className={`font-mono text-[9px] tracking-[0.2em] ${active ? "text-cp opacity-90" : "opacity-40"}`}>
                  {item.mono}
                </span>
                <span>{item.label}</span>
                {/* 渐变下划线 */}
                <span
                  className={`absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-bai via-cp to-zhu transition-transform duration-300 origin-left ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
