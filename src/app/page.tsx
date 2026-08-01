import Link from "next/link";
import Image from "next/image";
import { BentoTile } from "@/components/bento/BentoTile";
import { sameStyles, schedules, feeds } from "@/lib/velite";
import { formatMonthDay } from "@/lib/date";

export default function Home() {
  const latestStyles = sameStyles.slice(-4).reverse();
  const upcoming = schedules
    .filter((s) => new Date(s.date) >= new Date("2026-08-01"))
    .slice(0, 3);
  const latestFeeds = feeds.slice(-3).reverse();

  const getDot = (m: string) => m === "A" ? "dot-bai" : m === "B" ? "dot-zhu" : "dot-cp";

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-12 gap-4 auto-rows-[minmax(160px,auto)]">
        <BentoTile className="col-span-12 lg:col-span-8 min-h-[440px] flex flex-col justify-between relative overflow-hidden">
          <Image
            src="/hero-wedding.jpg"
            alt="柏里挑怡"
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/20 z-[1]" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] tracking-[0.35em] text-white uppercase">
                {"\u00A7"} 00 {"\u00B7"} Home
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full dot-bai" />
                <span className="text-[10px] font-mono text-white/90">柏欣妤</span>
                <span className="text-white/30 text-[10px]">{"\u00D7"}</span>
                <span className="w-1.5 h-1.5 rounded-full dot-zhu" />
                <span className="text-[10px] font-mono text-white/90">朱怡欣</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex flex-wrap items-center gap-3 mt-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-mono border border-white/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              持续更新
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-mono border border-white/20 backdrop-blur-sm">
              {"\u2605"} 柏欣妤 {"\u00B7"} 白
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zhu/30 text-white text-xs font-mono border border-zhu/40 backdrop-blur-sm">
              {"\u2661"} 朱怡欣 {"\u00B7"} 蓝
            </span>
          </div>
        </BentoTile>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <BentoTile className="flex-1 flex flex-col justify-center">
            <p className="font-mono text-[10px] tracking-widest text-muted mb-3 uppercase">Motto</p>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-gradient-cp font-medium">
              心动穿越千里，<br />所爱柏里挑怡。
            </p>
          </BentoTile>
          <BentoTile className="flex-1">
            <p className="font-mono text-[10px] tracking-widest text-muted mb-3 uppercase">Count</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-serif text-2xl font-semibold text-bai">{sameStyles.length}</p>
                <p className="text-[10px] text-muted font-mono mt-1">同款</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold text-zhu">{schedules.length}</p>
                <p className="text-[10px] text-muted font-mono mt-1">行程</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold text-cp">{feeds.length}</p>
                <p className="text-[10px] text-muted font-mono mt-1">动态</p>
              </div>
            </div>
          </BentoTile>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BentoTile className="col-span-1" interactive>
          <Link href="/same-styles" className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-widest text-muted">{"\u00A7"} 01</span>
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
              <span className="font-mono text-[10px] tracking-widest text-muted">{"\u00A7"} 02</span>
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
              <span className="font-mono text-[10px] tracking-widest text-muted">{"\u00A7"} 03</span>
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
    </div>
  );
}
