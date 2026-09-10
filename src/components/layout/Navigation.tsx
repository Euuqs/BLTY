"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SearchPalette } from "@/components/ui/SearchPalette";

const navItems = [
  { href: "/", label: "首页" }, { href: "/same-styles", label: "同款" },
  { href: "/schedule", label: "行程" }, { href: "/feed", label: "动态" },
  { href: "/tour", label: "巡演" },
];

export function Navigation() {
  const pathname = usePathname();
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <nav className="editorial-nav" aria-label="主导航">
      <div className="editorial-nav-inner">
        <Link href="/" prefetch={false} className="editorial-brand" aria-label="柏里挑怡首页"><span>柏里挑怡</span><small>Two hearts · one story</small></Link>
        <div className="editorial-nav-links">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return <Link key={item.href} href={item.href} prefetch={false} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>{item.label}{active && <motion.i layoutId="editorial-nav-underline" transition={{ type: "spring", stiffness: 360, damping: 32 }} />}</Link>;
          })}
        </div>
        <SearchPalette />
      </div>
    </nav>
  );
}
