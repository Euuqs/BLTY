"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { BentoTile } from "@/components/bento/BentoTile";
import { DogMascot, PigMascot, Paw, Sparkle, Rose, Heart, ArrowUpRight } from "@/components/mascot/Mascots";
import { CategoryBar } from "@/components/ui/CategoryBar";
import { useCountUp } from "@/components/ui/useCountUp";
import { formatMonthDay } from "@/lib/date";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

interface HomeHeroProps {
  styleCount: number;
  scheduleCount: number;
  feedCount: number;
  categories: { label: string; count: number }[];
  categoryTotal: number;
  latestDate: string;
}

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const { count, ref } = useCountUp(value, 1800);
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ scale: 0.6, opacity: 0, filter: "blur(8px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 14 }}
    >
      <motion.span
        className="inline-block"
        animate={{
          textShadow: [
            "0 0 0px transparent",
            "0 0 18px var(--glow-color, var(--cp-glow))",
            "0 0 0px transparent",
          ],
        }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        {count}
      </motion.span>
    </motion.span>
  );
}

export function HomeHero({ styleCount, scheduleCount, feedCount, categories, categoryTotal, latestDate }: HomeHeroProps) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-12 gap-3 sm:gap-4 auto-rows-[minmax(140px,auto)] sm:auto-rows-[minmax(160px,auto)]"
    >
      {/* ===== 主 Hero ===== */}
      <motion.div
        variants={item}
        className="order-2 md:order-2 md:col-start-5 col-span-12 md:col-span-8 min-h-[360px] sm:min-h-[460px] bento-tile flex flex-col justify-between relative overflow-hidden group"
      >
        <Image
          src="/hero-wedding.jpg"
          alt="柏里挑怡 婚纱合影"
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover object-[52%_42%] sm:object-[52%_44%] transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="hero-halo" />
        <div className="home-hero-overlay absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-background/10 z-[1]" />
        <div
          className="absolute inset-0 z-[2] pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
            mixBlendMode: "overlay",
          }}
        />

        {/* 水印字样 + 花体英文点缀 */}
        <div
          className="absolute bottom-16 sm:bottom-20 -right-2 sm:-right-4 md:right-6 text-right leading-none select-none z-[1] pointer-events-none hidden sm:block"
          aria-hidden="true"
        >
          <span className="block font-serif text-[3.5rem] sm:text-[5rem] md:text-[8rem] text-white/[0.04] tracking-tight">
            柏里挑怡
          </span>
          <span className="block font-script text-2xl sm:text-3xl md:text-4xl text-white/[0.10] -mt-1 sm:-mt-2 mr-1 sm:mr-3">
            Baili Tiaoyi
          </span>
        </div>

        {/* 星尘与爪印点缀 */}
        <Sparkle className="twinkle absolute top-6 right-8 w-6 h-6 text-white/70 z-[2] hidden sm:block" />
        <Sparkle className="twinkle twinkle-1 absolute top-24 right-24 w-4 h-4 text-zhu/70 z-[2] hidden sm:block" />
        <Sparkle className="twinkle twinkle-2 absolute bottom-40 left-6 w-4 h-4 text-white/50 z-[2] hidden md:block" />
        <Paw className="absolute top-10 left-1/3 w-5 h-5 text-white/25 rotate-[-18deg] z-[2] hidden lg:block" />
        <Paw className="absolute top-24 left-1/2 w-4 h-4 text-white/15 rotate-[8deg] z-[2] hidden lg:block" />
        {/* 红玫瑰点缀 */}
        <Rose className="twinkle twinkle-1 absolute bottom-24 right-8 w-6 h-6 text-rose/70 z-[2] hidden md:block" />

        {/* 萌宠入场 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          className="mascot-float absolute -bottom-4 -right-2 lg:right-4 w-36 md:w-40 lg:w-48 z-[2] hidden sm:block"
        >
          <div className="absolute inset-8 rounded-full bg-white/10 blur-2xl" />
          <DogMascot className="relative w-full h-full text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          className="mascot-float mascot-float-delayed absolute top-2 right-4 md:right-10 w-16 md:w-24 z-[2] hidden sm:block"
        >
          <div className="absolute inset-3 rounded-full bg-zhu/20 blur-xl" />
          <PigMascot className="relative w-full h-full text-white" />
        </motion.div>

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
        <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3 mt-8">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-mono border border-white/30 backdrop-blur-sm cursor-default"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            持续更新
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-mono border border-white/20 backdrop-blur-sm cursor-default"
          >
            <Sparkle className="w-3.5 h-3.5" /> 柏欣妤 {"\u00B7"} 白
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zhu/30 text-white text-xs font-mono border border-zhu/40 backdrop-blur-sm cursor-default"
          >
            <Heart className="w-3.5 h-3.5" /> 朱怡欣 {"\u00B7"} 蓝
          </motion.span>
        </div>
      </motion.div>

      <div className="order-1 md:order-1 md:col-start-1 md:row-start-1 col-span-12 md:col-span-4 contents md:flex md:flex-col md:gap-4">
        <motion.div variants={item} className="order-1 md:order-none col-span-12 md:col-span-4 flex-1 flex">
          <BentoTile className="flex-1 flex flex-col justify-center group surface-2">
            <p className="font-mono text-[10px] tracking-widest text-muted mb-3 uppercase">Motto</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground text-balance">
              柏里挑怡
            </h1>
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-gradient-cp font-bold tracking-tight">
              心动穿越千里，
              <br />
              所爱柏里挑怡。
            </p>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/60">
              <motion.div whileHover={{ scale: 1.2, rotate: -10 }}>
                <DogMascot className="w-9 h-9 shrink-0 opacity-90" />
              </motion.div>
              <div className="h-px flex-1 bg-gradient-to-r from-bai/40 via-cp/40 to-zhu/40 relative">
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-cp text-[10px] absolute left-1/2 -top-2 -translate-x-1/2"
                >
                  <Heart className="w-3.5 h-3.5 text-cp" />
                </motion.span>
              </div>
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                <PigMascot className="w-9 h-9 shrink-0 opacity-90" />
              </motion.div>
            </div>
            <Link
              href="/tour"
              prefetch={false}
              className="group/cta mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-cp px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-cp/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cp focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
            >
              查看巡演攻略
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
            </Link>
          </BentoTile>
        </motion.div>

        <motion.div variants={item} className="order-3 md:order-none col-span-12 md:col-span-4 flex-1 flex">
          <BentoTile className="flex-1">
            <p className="font-mono text-[10px] tracking-widest text-muted mb-3 uppercase">Count</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="group cursor-default" style={{ ['--glow-color' as string]: 'var(--bai-glow)' }}>
                <AnimatedNumber value={styleCount} className="block font-serif text-2xl font-semibold text-bai group-hover:scale-110 transition-transform duration-300" />
                <p className="text-[10px] text-muted font-mono mt-1">同款</p>
              </div>
              <div className="group cursor-default" style={{ ['--glow-color' as string]: 'var(--zhu-glow)' }}>
                <AnimatedNumber value={scheduleCount} className="block font-serif text-2xl font-semibold text-zhu group-hover:scale-110 transition-transform duration-300" />
                <p className="text-[10px] text-muted font-mono mt-1">行程</p>
              </div>
              <div className="group cursor-default" style={{ ['--glow-color' as string]: 'var(--cp-glow)' }}>
                <AnimatedNumber value={feedCount} className="block font-serif text-2xl font-semibold text-cp group-hover:scale-110 transition-transform duration-300" />
                <p className="text-[10px] text-muted font-mono mt-1">动态</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose animate-pulse" />
              <span className="font-mono text-[10px] text-muted tracking-wider" title={latestDate || undefined}>
                最近更新 · {latestDate ? formatMonthDay(latestDate) : "暂无"}
              </span>
            </div>
            <CategoryBar items={categories} total={categoryTotal} />
          </BentoTile>
        </motion.div>
      </div>
    </motion.section>
  );
}
