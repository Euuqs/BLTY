"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "motion/react";
import { BentoTile } from "@/components/bento/BentoTile";
import { Reveal } from "@/components/ui/Reveal";
import { useNow } from "@/lib/useNow";
import { useFeedback } from "@/components/ui/FeedbackProvider";
import { DogMascot, PigMascot, Rose, Paw, Heart, ArrowUpRight } from "@/components/mascot/Mascots";
import { MetaIcon } from "@/components/ui/MetaIcon";

const VENUE = {
  name: "杭州新天地太阳剧场",
  address: "浙江省杭州市拱墅区东文街88号",
  date: "2026-08-22",
  time: "19:00",
  doorTime: "17:30 检票",
};

const CHECKIN_SPOTS = [
  {
    id: "pain-building",
    badge: "1",
    title: "痛楼应援",
    subtitle: "新天地购物中心",
    period: "08.21 - 08.23",
    description: "距太阳剧场步行五分钟，整座商场铺满柏里挑怡的夏日信号",
    highlights: [
      { icon: "screen", label: "中庭大屏轮播", detail: "120次/天" },
      { icon: "wall", label: "互动墙", detail: "1面" },
      { icon: "flower", label: "小花墙信箱", detail: "200张明信片" },
      { icon: "flag", label: "吊旗", detail: "170面" },
      { icon: "camera", label: "合影框", detail: "5个" },
      { icon: "sign", label: "指示牌", detail: "4块" },
      { icon: "screen", label: "立屏", detail: "8块" },
      { icon: "metro", label: "地铁出口楼梯", detail: "装饰通道" },
    ],
    color: "bai",
    accent: "from-bai/20 via-bai/5 to-transparent",
    border: "hover:border-bai/50",
    glow: "shadow-[0_0_30px_oklch(0.95_0.005_260/0.12)]",
  },
  {
    id: "billboard",
    badge: "2",
    title: "大屏应援",
    subtitle: "城市中心大屏投放",
    period: "巡演期间",
    description: "把夏天最想说的话，放进每个人都会经过的路口",
    highlights: [
      { icon: "pin", label: "核心商圈大屏", detail: "投放中" },
      { icon: "camera", label: "打卡建议", detail: "城市中心定位" },
    ],
    color: "cp",
    accent: "from-cp/20 via-cp/5 to-transparent",
    border: "hover:border-cp/50",
    glow: "shadow-[0_0_30px_oklch(0.65_0.22_295/0.15)]",
  },
  {
    id: "outdoor",
    badge: "3",
    title: "场外应援",
    subtitle: "太阳剧场广场 & 市集",
    period: "08.22 演出当天",
    description: "让风穿过空地，有一面旗替我们摇晃；让花立在门口，有人愿意停下",
    highlights: [
      { icon: "wall", label: "巨幅海报", detail: "10×6m × 4幅" },
      { icon: "flower", label: "花墙", detail: "10m × 1座" },
      { icon: "clipboard", label: "KT板", detail: "10m × 2块" },
      { icon: "sign", label: "留言板", detail: "7m × 1块" },
      { icon: "flag", label: "注水旗", detail: "27面" },
      { icon: "balloon", label: "空飘", detail: "8个" },
    ],
    color: "zhu",
    accent: "from-zhu/20 via-zhu/5 to-transparent",
    border: "hover:border-zhu/50",
    glow: "shadow-[0_0_30px_oklch(0.60_0.18_250/0.12)]",
  },
] as const;

const TRANSPORT_TIPS = [
  { icon: "metro", label: "地铁", detail: "4号线/5号线 杭州西站/东新园站" },
  { icon: "car", label: "自驾", detail: "导航「新天地太阳剧场」，商场有地下停车场" },
  { icon: "bus", label: "公交", detail: "东文街站 / 杭行路站" },
  { icon: "walk", label: "步行", detail: "痛楼商场距剧场步行5分钟" },
];

function useCountdown(targetDate: string, targetTime?: string) {
  const now = useNow();
  return useMemo(() => {
    const target = new Date(`${targetDate}T${targetTime ?? "00:00:00"}`);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { expired: false, days, hours, minutes, seconds };
  }, [now, targetDate, targetTime]);
}

function CountdownBlock({ value, label, color }: { value: number; label: string; color: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        key={display}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={`font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tabular-nums ${color}`}
      >
        {display}
      </motion.div>
      <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{label}</span>
    </div>
  );
}

function HeroSection() {
  const countdown = useCountdown(VENUE.date, VENUE.time);
  const { createRipple, burstConfetti } = useFeedback();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    createRipple(e);
    if (countdown.expired) {
      burstConfetti(2500);
    }
  };

  return (
    <Reveal>
      <BentoTile className="relative overflow-hidden p-0">
        <Image
          src="/static/hero/stage-hero.jpg"
          alt="PRIVATE SIGNAL 演唱会舞台"
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
          className="object-cover opacity-15 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-surface/95 via-surface/90 to-surface/95 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-cp/15 via-surface/50 to-surface pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cp/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-bai/10 blur-3xl pointer-events-none" />

        <div className="relative p-6 md:p-10 flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1 flex flex-col gap-4 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-cp/15 border border-cp/40 text-[10px] font-mono text-cp tracking-widest">
                {"\u00B7"} LIVE TOUR 2026 {"\u00B7"}
              </span>
              <span className="px-3 py-1 rounded-full bg-zhu/15 border border-zhu/30 text-[10px] font-mono text-zhu tracking-widest">
                HANGZHOU
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
              <span className="text-gradient-cp">PRIVATE SIGNAL</span>
              <br />
              <span className="text-foreground">杭州站</span>
            </h2>

            <p className="text-muted text-sm md:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
              「柏欣妤 <span className="text-zhu">×</span> 朱怡欣」双人巡演
              <br />
              把属于她们的信号，带到这个夏天
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-2">
              <a
                href="https://weibo.com/3209726480/Re6utkTjs"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cp to-[oklch(0.55_0.22_340)] text-white text-sm font-medium btn-press shadow-[0_0_24px_oklch(0.65_0.22_295/0.35)] ripple-container"
              >
                查看全部应援
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <a
                  href="https://weibo.com/7355076643/RbPMKpzDZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-bai/25 text-sm text-bai hover:border-bai/50 transition-colors duration-200 btn-press ripple-container"
                >
                  <DogMascot className="w-4 h-4" />
                  物料汇总
                </a>
                <span className="font-mono text-[9px] text-muted/70 tracking-wider">
                  感谢老师汇总
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-bai/20 via-cp/20 to-zhu/20 rounded-2xl blur-xl opacity-60" />
              <div
                onClick={handleClick}
                className={`relative grid grid-cols-4 gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl bg-surface/80 border ${
                  countdown.expired ? "border-cp/60 pulse-glow" : "border-border"
                } backdrop-blur-sm cursor-pointer ripple-container`}
              >
                {countdown.expired ? (
                  <div className="col-span-4 text-center py-4">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="font-serif text-3xl font-semibold text-cp mb-2"
                    >
                      演出进行中
                    </motion.div>
                    <p className="text-muted text-sm">
                      杭州新天地太阳剧场 · 不见不散
                    </p>
                  </div>
                ) : (
                  <>
                    <CountdownBlock value={countdown.days} label="DAYS" color="text-foreground" />
                    <CountdownBlock value={countdown.hours} label="HOURS" color="text-cp" />
                    <CountdownBlock value={countdown.minutes} label="MINS" color="text-zhu" />
                    <CountdownBlock value={countdown.seconds} label="SECS" color="text-bai" />
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 text-center">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-muted tracking-widest uppercase">日期</span>
                <span className="font-serif text-lg font-semibold">08.22</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-muted tracking-widest uppercase">时间</span>
                <span className="font-serif text-lg font-semibold">19:00</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-muted tracking-widest uppercase">地点</span>
                <span className="font-serif text-lg font-semibold text-cp">杭州</span>
              </div>
            </div>
          </div>
        </div>
      </BentoTile>
    </Reveal>
  );
}

function QuickInfoSection() {
  const { createRipple } = useFeedback();

  return (
    <Reveal delay={0.05}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: "calendar", label: "演出日期", value: "08月22日(六)", color: "text-cp" },
          { icon: "clock", label: "开场时间", value: "19:00", color: "text-zhu" },
          { icon: "ticket", label: "检票入场", value: "17:30", color: "text-bai" },
          { icon: "pin", label: "演出地点", value: "新天地太阳剧场", color: "text-foreground" },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createRipple}
            className="bento-tile p-4 flex flex-col items-center gap-1.5 cursor-pointer ripple-container"
          >
            <MetaIcon name={item.icon} className={`w-7 h-7 ${item.color}`} />
            <span className="font-mono text-[9px] text-muted tracking-widest uppercase">{item.label}</span>
            <span className={`font-serif text-base font-semibold ${item.color}`}>{item.value}</span>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}

function VenueGuideSection() {
  return (
    <Reveal delay={0.05}>
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.35em] text-cp uppercase">
            {"\u00A7"} 攻略 {"\u00B7"} Venue
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-cp/20 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BentoTile className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase">场地信息</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MetaIcon name="stadium" className="w-6 h-6 text-cp shrink-0" />
                <div>
                  <h3 className="font-serif text-lg font-semibold">{VENUE.name}</h3>
                  <p className="text-xs text-muted mt-1">{VENUE.address}</p>
                </div>
              </div>

              <div className="h-px bg-border/60" />

              <div>
                <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2">交通指南</p>
                <div className="grid grid-cols-2 gap-2">
                  {TRANSPORT_TIPS.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-2/50 border border-border/40">
                      <MetaIcon name={tip.icon} className="w-5 h-5 text-cp shrink-0" />
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-cp tracking-wider">{tip.label}</span>
                        <p className="text-xs text-muted leading-snug mt-0.5">{tip.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border/60" />

              <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-bai/5 via-cp/5 to-zhu/5 border border-border/40">
                <Rose className="w-5 h-5 text-rose shrink-0 mt-0.5" />
                <p className="text-xs text-muted leading-relaxed">
                  应援活动时间：<span className="text-foreground font-medium">08.21 - 08.23</span>
                  <br />
                  痛楼商场距剧场步行仅 5 分钟，建议预留充足打卡时间
                </p>
              </div>
            </div>
          </BentoTile>

          <BentoTile>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase">行程安排</span>
              <Paw className="w-4 h-4 text-bai/60 ml-auto" />
            </div>

            <div className="flex flex-col gap-3">
              {[
                { time: "全天", title: "痛楼应援开放", loc: "新天地购物中心", active: true },
                { time: "17:30", title: "开始检票入场", loc: "太阳剧场", active: true },
                { time: "19:00", title: "PRIVATE SIGNAL 开演", loc: "太阳剧场", active: false },
                { time: "演出后", title: "场外应援打卡", loc: "剧场广场/市集", active: false },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <span className={`w-2 h-2 rounded-full ${item.active ? "dot-cp" : "bg-border"}`} />
                    {i < 3 && <span className="w-px h-6 bg-border/60 mt-1" />}
                  </div>
                  <div className="pb-1">
                    <span className="font-mono text-xs text-cp">{item.time}</span>
                    <p className="text-sm font-medium">{item.title}</p>
                    <span className="text-[10px] text-muted">{item.loc}</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoTile>
        </div>
      </section>
    </Reveal>
  );
}

function CheckinCard({ spot, index }: { spot: (typeof CHECKIN_SPOTS)[number]; index: number }) {
  const { createRipple, spawnParticles } = useFeedback();

  const colorMap: Record<string, { dot: string; text: string; border: string; bg: string }> = {
    bai: { dot: "dot-bai", text: "text-bai", border: "border-bai/40", bg: "from-bai/10 to-transparent" },
    zhu: { dot: "dot-zhu", text: "text-zhu", border: "border-zhu/40", bg: "from-zhu/10 to-transparent" },
    cp: { dot: "dot-cp", text: "text-cp", border: "border-cp/40", bg: "from-cp/10 to-transparent" },
  };

  const c = colorMap[spot.color];

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    createRipple(e);
    const rect = e.currentTarget.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + 20, "sparkles", 6);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <BentoTile className="h-full overflow-hidden group">
        <div className={`absolute inset-0 bg-gradient-to-br ${spot.accent} pointer-events-none opacity-60`} />

        <div className="relative flex flex-col gap-3 h-full">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-2/80 border ${c.border} text-xs font-serif font-semibold ${c.text}`}>
                {spot.badge}
              </span>
              <h3 className="font-serif text-xl font-semibold mt-2">{spot.title}</h3>
              <p className={`text-xs font-mono ${c.text} mt-0.5`}>{spot.subtitle}</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.15, rotate: 10 }}
              className="w-10 h-10 rounded-full bg-surface-2/60 border border-border flex items-center justify-center"
            >
              {spot.id === "pain-building" ? (
                <DogMascot className="w-6 h-6 text-bai" />
              ) : spot.id === "billboard" ? (
                <Heart className="w-5 h-5 text-cp" />
              ) : (
                <PigMascot className="w-6 h-6 text-zhu" />
              )}
            </motion.div>
          </div>

          <p className="text-xs text-muted leading-relaxed">{spot.description}</p>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-muted">投放时间</span>
            <span className="font-mono text-[10px] text-foreground">{spot.period}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mt-auto">
            {spot.highlights.map((h, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                onClick={handleCardClick}
                className="flex items-center gap-2 p-2 rounded-lg bg-surface-2/40 border border-border/30 cursor-pointer ripple-container"
              >
                <MetaIcon name={h.icon} className="w-4 h-4 text-cp shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium truncate">{h.label}</p>
                  <p className="text-[10px] text-muted truncate">{h.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </BentoTile>
    </motion.div>
  );
}

function SupportCollectionSection() {
  return (
    <Reveal delay={0.05}>
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.35em] text-cp uppercase">
            {"\u00A7"} 应援 {"\u00B7"} Support
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-cp/20 to-transparent" />
          <Rose className="w-4 h-4 text-rose/70" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CHECKIN_SPOTS.map((spot, i) => (
            <CheckinCard key={spot.id} spot={spot} index={i} />
          ))}
        </div>
      </section>
    </Reveal>
  );
}

function CheckinChecklist() {
  const { createRipple, spawnParticles } = useFeedback();

  const allItems = [
    { group: "痛楼应援", items: ["中庭大屏", "互动墙", "小花墙信箱", "吊旗", "合影框", "指示牌", "立屏", "地铁出口楼梯"], color: "bai" },
    { group: "大屏应援", items: ["核心商圈大屏", "品牌大屏联动"], color: "cp" },
    { group: "场外应援", items: ["巨幅海报×4", "花墙", "KT板×2", "留言板", "注水旗×27", "空飘×8"], color: "zhu" },
  ];

  const colorDot: Record<string, string> = { bai: "dot-bai", zhu: "dot-zhu", cp: "dot-cp" };
  const colorText: Record<string, string> = { bai: "text-bai", zhu: "text-zhu", cp: "text-cp" };

  return (
    <Reveal delay={0.1}>
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.35em] text-cp uppercase">
            {"\u00A7"} 打卡 {"\u00B7"} Checklist
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-cp/20 to-transparent" />
          <span className="font-mono text-[10px] text-muted">全部应援点汇总</span>
        </div>

        <BentoTile>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allItems.map((section, si) => (
              <div key={si} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${colorDot[section.color]}`} />
                  <span className={`font-serif text-sm font-semibold ${colorText[section.color]}`}>{section.group}</span>
                  <span className="font-mono text-[9px] text-muted">({section.items.length})</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {section.items.map((item, ii) => (
                    <motion.button
                      key={ii}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        createRipple(e);
                        const rect = e.currentTarget.getBoundingClientRect();
                        spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, "hearts", 4);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2/40 border border-border/40 hover:border-cp/40 text-xs text-muted hover:text-foreground transition-colors text-left ripple-container"
                    >
                      <span className="w-3 h-3 rounded border border-border flex items-center justify-center text-[8px] text-cp opacity-0 hover:opacity-100 transition-opacity">
                        ✓
                      </span>
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-3">
            <Paw className="w-4 h-4 text-bai/50" />
            <p className="text-[11px] text-muted leading-relaxed flex-1">
              <MetaIcon name="lightbulb" className="w-3.5 h-3.5 text-amber inline-block align-[-2px] mr-1" />
              小贴士：痛楼投放时间 08.21-08.23，建议先逛痛楼再前往剧场。小花墙信箱旁准备了 200 张明信片，先到先得。
            </p>
          </div>
        </BentoTile>
      </section>
    </Reveal>
  );
}

function CTAFooter() {
  const { createRipple, burstConfetti } = useFeedback();

  return (
    <Reveal delay={0.15}>
      <section className="gradient-border relative overflow-hidden rounded-2xl border border-cp/30 bg-gradient-to-br from-cp/10 via-surface to-surface px-6 py-8 md:px-10 md:py-10">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-cp/10 blur-3xl pointer-events-none" />
        <DogMascot className="absolute top-4 right-4 w-8 h-8 text-bai/30 mascot-float" />
        <PigMascot className="absolute bottom-4 left-4 w-8 h-8 text-zhu/30 mascot-float mascot-float-delayed" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <p className="font-mono text-[10px] tracking-[0.35em] text-cp uppercase mb-2">
              {"\u00A7"} Let&apos;s Go
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">
              周六见，小半们 💜
            </h2>
            <p className="text-sm text-muted mt-2 max-w-xl leading-relaxed">
              柏里挑怡双人巡演「PRIVATE SIGNAL」杭州站，
              <br />
              带上你的应援物，收好这份攻略，我们剧场见。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://weibo.com/3209726480"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                createRipple(e);
                burstConfetti(2000);
              }}
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose to-[oklch(0.58_0.22_350)] text-white text-sm font-medium btn-press shadow-[0_0_24px_oklch(0.52_0.24_15/0.35)] ripple-container"
            >
              关注应援站
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="https://s.weibo.com/weibo?q=%23%E6%9F%8F%E6%AC%A3%E5%A6%A4%E6%9C%B1%E6%80%A1%E6%AC%A3PRIVATESIGNAL%E5%B7%A1%E6%BC%94%23"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-2 border border-cp/30 text-sm text-cp hover:border-cp/60 transition-colors duration-200 btn-press ripple-container"
            >
              <span className="w-1.5 h-1.5 rounded-full dot-cp" />
              巡演话题
            </a>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

export function TourClient() {
  return (
    <div className="flex flex-col gap-8">
      <HeroSection />
      <QuickInfoSection />
      <VenueGuideSection />
      <SupportCollectionSection />
      <CheckinChecklist />
      <CTAFooter />
    </div>
  );
}
