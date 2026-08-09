import Link from "next/link";
import { BentoTile } from "@/components/bento/BentoTile";
import { DogMascot, PigMascot, Paw, Rose } from "@/components/mascot/Mascots";
import { HomeHero } from "@/components/home/HomeHero";
import { BirthdayCountdown } from "@/components/ui/BirthdayCountdown";
import { Reveal } from "@/components/ui/Reveal";
import { sameStyles, schedules, feeds } from "@/lib/velite";
import { formatMonthDay } from "@/lib/date";

export default function Home() {
  const latestStyles = sameStyles.slice(-4).reverse();
  const upcoming = schedules
    .filter((s) => new Date(s.date) >= new Date("2026-08-01"))
    .slice(0, 3);
  const latestFeeds = feeds.slice(-3).reverse();

  const getDot = (m: string) => (m === "A" ? "dot-bai" : m === "B" ? "dot-zhu" : "dot-cp");

  const categoryLabels = ["衣服", "饰品", "零食", "美妆", "鞋包", "其他"];
  const categories = categoryLabels.map((label) => ({
    label,
    count: sameStyles.filter((s) => s.category === label).length,
  }));
  const categoryTotal = categories.reduce((a, c) => a + c.count, 0);

  const socialLinks: Record<
    string,
    { platform: string; label: string; url: string }[]
  > = {
    bai: [
      { platform: "微博大号", label: "SNH48-柏欣妤", url: "https://weibo.com/u/6375479853" },
      { platform: "微博小号", label: "就一小波波", url: "https://weibo.com/u/7899620253" },
      { platform: "抖音", label: "道明五", url: "https://v.douyin.com/iqSDa19" },
    ],
    zhu: [
      { platform: "微博大号", label: "GNZ48-朱怡欣-", url: "https://weibo.com/u/6224125612" },
      { platform: "微博小号", label: "我这佛光普照艳阳高照那你呢", url: "https://weibo.com/u/5585636284" },
      { platform: "抖音", label: "见习反派GGB", url: "https://www.douyin.com/user/MS4wLjABAAAAS8ADpNmDEM2dyJNr8_FBAWcqtWk6mdo5eXwEwvYlCiM" },
    ],
  };

  return (
    <div className="flex flex-col gap-6">
      <HomeHero
        styleCount={sameStyles.length}
        scheduleCount={schedules.length}
        feedCount={feeds.length}
        categories={categories}
        categoryTotal={categoryTotal}
      />

      {/* ===== 生日倒计时 ===== */}
      <Reveal>
        <BirthdayCountdown />
      </Reveal>

      {/* ===== 成员档案 · 萌宠标志 ===== */}
      <Reveal delay={0.05}>
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] tracking-[0.35em] text-cp uppercase">
              {"\u00A7"} 01 {"\u00B7"} Profile
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-cp/40 via-border to-transparent" />
            <Rose className="w-4 h-4 text-rose/70" />
            <span className="text-muted/50 text-[10px] font-mono hidden md:inline">
              一对欢喜冤家
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-14 w-14 items-center justify-center rounded-full bg-surface-2 border border-cp/50 shadow-[0_0_28px_oklch(0.65_0.22_295/0.45)]">
              <span className="text-cp text-xl">{"\u2665"}</span>
            </div>

            <BentoTile className="overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-bai/10 blur-3xl pointer-events-none" />
              <Paw className="absolute bottom-3 right-4 w-5 h-5 text-bai/15 rotate-[24deg] pointer-events-none" />
              <Paw className="absolute bottom-3 right-12 w-4 h-4 text-bai/10 rotate-[-8deg] pointer-events-none" />
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                  Profile {"\u00B7"} Bai
                </span>
                <span className="font-mono text-[10px] text-bai/70 tracking-widest">白</span>
              </div>
              <div className="flex flex-col items-center py-2">
                <div className="relative w-32 h-32 md:w-36 md:h-36 transition-transform duration-500 group-hover:scale-105">
                  <div className="absolute inset-4 rounded-full bg-bai/10 blur-xl" />
                  <DogMascot className="relative w-full h-full text-bai" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mt-3">柏欣妤</h2>
                <p className="font-mono text-[10px] text-muted tracking-[0.3em] uppercase mt-1">Bai Xinyu</p>
                <p className="text-sm text-muted mt-2 text-center">
                  「全世界<span className="text-zhu">朱怡欣</span>最喜欢我！」
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                  <span className="px-2.5 py-1 rounded-full bg-surface-2 border border-bai/25 text-[10px] font-mono text-bai/90">SNH48</span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-2 border border-bai/25 text-[10px] font-mono text-bai/90">奶白</span>
                </div>
              </div>
            </BentoTile>

            <BentoTile className="overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-zhu/15 blur-3xl pointer-events-none" />
              <Paw className="absolute bottom-3 right-4 w-5 h-5 text-zhu/20 rotate-[-18deg] pointer-events-none" />
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                  Profile {"\u00B7"} Zhu
                </span>
                <span className="font-mono text-[10px] text-zhu/70 tracking-widest">蓝</span>
              </div>
              <div className="flex flex-col items-center py-2">
                <div className="relative w-32 h-32 md:w-36 md:h-36 transition-transform duration-500 group-hover:scale-105">
                  <div className="absolute inset-4 rounded-full bg-zhu/10 blur-xl" />
                  <PigMascot className="relative w-full h-full text-zhu" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mt-3">朱怡欣</h2>
                <p className="font-mono text-[10px] text-muted tracking-[0.35em] uppercase mt-1">Zhu Yixin</p>
                <p className="text-sm text-muted mt-2 text-center">
                  「全世界我最喜欢<span className="text-bai">柏欣妤</span>了！」
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                  <span className="px-2.5 py-1 rounded-full bg-surface-2 border border-zhu/30 text-[10px] font-mono text-zhu">GNZ48</span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-2 border border-zhu/30 text-[10px] font-mono text-zhu">海盐蓝</span>
                </div>
              </div>
            </BentoTile>
          </div>
        </section>
      </Reveal>

      {/* ===== 社交账号 ===== */}
      <Reveal delay={0.05}>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["bai", "zhu"] as const).map((member) => {
            const isBai = member === "bai";
            const dotClass = isBai ? "dot-bai" : "dot-zhu";
            const borderHover = isBai ? "hover:border-bai/40" : "hover:border-zhu/40";
            const linkHover = isBai ? "group-hover:text-bai" : "group-hover:text-zhu";
            const arrowColor = isBai ? "text-bai/50" : "text-zhu/50";
            return (
              <BentoTile key={member}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={"w-1.5 h-1.5 rounded-full shrink-0 " + dotClass} />
                    <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                      社交 {"\u00B7"} {isBai ? "柏欣妤" : "朱怡欣"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isBai ? (
                      <DogMascot className="w-5 h-5 opacity-80" />
                    ) : (
                      <PigMascot className="w-5 h-5 opacity-80" />
                    )}
                    <span className={"text-sm " + arrowColor}>{"\u2197"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {socialLinks[member].map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        "group flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-2/50 border border-border " +
                        "transition-all duration-200 " + borderHover
                      }
                    >
                      <span className="font-mono text-[10px] text-muted tracking-wider w-16 shrink-0">{s.platform}</span>
                      <span
                        className={
                          "flex-1 min-w-0 text-sm text-foreground transition-colors " + linkHover
                        }
                      >
                        {s.label}
                      </span>
                      <span className={"text-sm shrink-0 " + linkHover + " " + arrowColor}>
                        {"\u2197"}
                      </span>
                    </a>
                  ))}
                </div>
              </BentoTile>
            );
          })}
        </section>
      </Reveal>

      {/* ===== 首页导流 ===== */}
      <Reveal delay={0.05}>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BentoTile className="col-span-1" interactive>
            <Link href="/same-styles" className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] tracking-widest text-muted">{"\u00A7"} 02</span>
                <span className="text-cp text-sm">{"\u2192"}</span>
              </div>
              <h2 className="font-serif text-xl font-semibold mb-2">同款衣橱</h2>
              <p className="text-sm text-muted mb-4">衣服 {"\u00B7"} 饰品 {"\u00B7"} 零食 {"\u00B7"} 美妆</p>
              <div className="mt-auto flex -space-x-2">
                {latestStyles.slice(0, 4).map((s, i) => (
                  <div key={i} className={"w-8 h-8 rounded-lg border-2 border-background cover-" + s.category} />
                ))}
              </div>
            </Link>
          </BentoTile>

          <BentoTile className="col-span-1" interactive>
            <Link href="/schedule" className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] tracking-widest text-muted">{"\u00A7"} 03</span>
                <span className="text-cp text-sm">{"\u2192"}</span>
              </div>
              <h2 className="font-serif text-xl font-semibold mb-2">行程日历</h2>
              <p className="text-sm text-muted mb-4">综艺 {"\u00B7"} 直播 {"\u00B7"} 演出 {"\u00B7"} 活动</p>
              <div className="mt-auto space-y-1.5">
                {upcoming.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={"w-1.5 h-1.5 rounded-full shrink-0 " + getDot(item.member)} />
                    <span className="truncate text-muted">{item.title}</span>
                    <span className="font-mono text-[10px] text-muted/50 ml-auto shrink-0">{formatMonthDay(item.date)}</span>
                  </div>
                ))}
              </div>
            </Link>
          </BentoTile>

          <BentoTile className="col-span-1" interactive>
            <Link href="/feed" className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] tracking-widest text-muted">{"\u00A7"} 04</span>
                <span className="text-cp text-sm">{"\u2192"}</span>
              </div>
              <h2 className="font-serif text-xl font-semibold mb-2">动态时间线</h2>
              <p className="text-sm text-muted mb-4">路透 {"\u00B7"} 日常 {"\u00B7"} 舞台</p>
              <div className="mt-auto space-y-1.5">
                {latestFeeds.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={"w-1.5 h-1.5 rounded-full shrink-0 " + getDot(item.member)} />
                    <span className="truncate text-muted">{item.title}</span>
                  </div>
                ))}
              </div>
            </Link>
          </BentoTile>
        </section>
      </Reveal>
    </div>
  );
}
