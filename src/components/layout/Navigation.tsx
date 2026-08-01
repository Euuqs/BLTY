import Link from "next/link";

const navItems = [
  { href: "/", label: "首页", mono: "00" },
  { href: "/same-styles", label: "同款", mono: "01" },
  { href: "/schedule", label: "行程", mono: "02" },
  { href: "/feed", label: "动态", mono: "03" },
];

export function Navigation() {
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface transition-all duration-200"
            >
              <span className="font-mono text-[9px] tracking-[0.2em] opacity-40">
                {item.mono}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}