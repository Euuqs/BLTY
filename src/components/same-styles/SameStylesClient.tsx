"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "motion/react";
import { BentoTile } from "@/components/bento/BentoTile";
import { TypeIcon } from "@/components/ui/TypeIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFeedback } from "@/components/ui/FeedbackProvider";
import { Lightbox } from "@/components/ui/Lightbox";
import { DetailModal } from "@/components/ui/DetailModal";
import type { SameStyle } from "@/lib/velite";
import { formatDateTime } from "@/lib/date";

type SameStyleItem = SameStyle;

const categories = ["全部", "衣服", "饰品", "零食", "美妆", "鞋包", "其他"] as const;
const members = ["全部", "柏欣妤", "朱怡欣", "双人"] as const;
type Category = (typeof categories)[number];
type Member = (typeof members)[number];
type SortMode = "new" | "priceAsc" | "priceDesc";

const memberToKey: Record<string, "A" | "B" | "both"> = {
  "柏欣妤": "A", "朱怡欣": "B", "双人": "both",
};

const getDot = (m: string) => m === "A" ? "dot-bai" : m === "B" ? "dot-zhu" : "dot-cp";
const getLabel = (m: string) => m === "A" ? "柏欣妤" : m === "B" ? "朱怡欣" : "双人";

const parsePrice = (price?: string) => {
  if (!price) return Number.MAX_SAFE_INTEGER;
  const n = parseFloat(price.replace(/[^\d.]/g, ""));
  return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
};

function FilterButton({
  active,
  onClick,
  children,
  variant = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "bai" | "zhu" | "cp";
}) {
  const { createRipple } = useFeedback();

  const activeStyles = {
    default: "bg-cp text-background border-cp shadow-[0_0_0_1px_oklch(0.65_0.22_295/0.25)]",
    bai: "bg-surface text-bai-ink border-bai-ink",
    zhu: "bg-zhu text-background border-zhu shadow-[0_0_0_1px_oklch(0.55_0.20_250/0.25)]",
    cp: "bg-cp text-background border-cp shadow-[0_0_0_1px_oklch(0.65_0.22_295/0.25)]",
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        createRipple(e);
        onClick();
      }}
      className={
        "same-styles-filter relative overflow-hidden shrink-0 px-3 sm:px-3.5 py-2 sm:py-1.5 text-xs font-mono tracking-wide border transition-all duration-200 btn-press ripple-container " +
        (active
          ? activeStyles[variant]
          : "bg-surface/50 text-muted border-border hover:border-cp/50 hover:text-foreground")
      }
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export function SameStylesClient({ items }: { items: SameStyleItem[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.01, 1.065]);
  const heroImageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 12]);
  const heroCopyOpacity = useTransform(scrollYProgress, [0, 0.7, 1], reduceMotion ? [1, 1, 1] : [1, 0.78, 0.42]);
  const [activeCat, setActiveCat] = useState<Category>("全部");
  const [activeMember, setActiveMember] = useState<Member>("全部");
  const [sort, setSort] = useState<SortMode>("new");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<SameStyleItem | null>(null);

  const filtered = useMemo(() => items.filter((item) => {
    const catMatch = activeCat === "全部" || item.category === activeCat;
    let memberMatch = true;
    if (activeMember !== "全部") { memberMatch = item.member === memberToKey[activeMember]; }
    return catMatch && memberMatch;
  }), [items, activeCat, activeMember]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sort === "priceAsc") return parsePrice(a.price) - parsePrice(b.price);
    if (sort === "priceDesc") return parsePrice(b.price) - parsePrice(a.price);
    return a.date < b.date ? 1 : -1;
  }), [filtered, sort]);

  const coversWithImages = useMemo(
    () => sorted.filter((s) => s.cover),
    [sorted]
  );
  const heroCovers = useMemo(() => items.filter((item) => item.cover).slice(0, 3), [items]);

  const getMemberVariant = (m: Member): "bai" | "zhu" | "cp" | "default" => {
    if (m === "柏欣妤") return "bai";
    if (m === "朱怡欣") return "zhu";
    if (m === "双人") return "cp";
    return "default";
  };

  return (
    <div className="gallery-page same-styles-page flex flex-col gap-6 sm:gap-8">
      <header ref={heroRef} className="same-styles-hero">
        <motion.div className="same-styles-hero-copy" style={{ opacity: heroCopyOpacity }}>
          <motion.p initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            § 02 · SAME STYLE ARCHIVE
          </motion.p>
          <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
            同款<span>衣橱</span>
          </motion.h1>
          <p>从一件衣服、一只包，到被她们分享过的日常小物。这里保存的不只是商品，也是公开生活留下的细节。</p>
          <div><strong>{items.length}</strong><span>件公开收录</span></div>
        </motion.div>

        <div className="same-styles-hero-photos" aria-label="同款精选照片">
          {heroCovers.map((item, index) => (
            <motion.figure
              key={item.slug}
              initial={reduceMotion ? false : { clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.05, delay: 0.12 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div style={{ scale: heroImageScale, y: heroImageY }}>
                <Image src={item.cover!} alt="" fill priority={index === 0} sizes="(max-width: 680px) 33vw, 16vw" className="object-cover" />
              </motion.div>
              <figcaption>{String(index + 1).padStart(2, "0")} · {item.category}</figcaption>
            </motion.figure>
          ))}
        </div>
      </header>

      <section className="same-styles-controls flex flex-col gap-3" aria-label="筛选同款">
        <div className="same-styles-controls-heading"><span>FILTER THE ARCHIVE</span><strong>{sorted.length} 件</strong></div>
        <div role="group" aria-label="按品类与排序筛选" className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 overflow-x-auto sm:overflow-visible scrollbar-hide pb-1 sm:pb-0">
          {categories.map((cat) => (
            <FilterButton
              key={cat}
              active={activeCat === cat}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </FilterButton>
          ))}
          <span className="w-px h-5 bg-border mx-1 hidden sm:block" />
          {(["new", "priceAsc", "priceDesc"] as const).map((mode) => (
            <FilterButton
              key={mode}
              active={sort === mode}
              onClick={() => setSort(mode)}
            >
              {mode === "new" ? "最新" : mode === "priceAsc" ? "价格 ↑" : "价格 ↓"}
            </FilterButton>
          ))}
        </div>
        <div role="group" aria-label="按成员筛选" className="flex flex-nowrap sm:flex-wrap gap-1.5 overflow-x-auto sm:overflow-visible scrollbar-hide pb-1 sm:pb-0">
          {members.map((m) => {
            const isActive = activeMember === m;
            const dotClass = m === "柏欣妤" ? "dot-bai" : m === "朱怡欣" ? "dot-zhu" : m === "双人" ? "dot-cp" : "";
            return (
              <FilterButton
                key={m}
                active={isActive}
                onClick={() => setActiveMember(m)}
                variant={getMemberVariant(m)}
              >
                <span className="flex items-center gap-1.5">
                  {dotClass && <span className={"w-1.5 h-1.5 rounded-full " + dotClass} />}
                  {m}
                </span>
              </FilterButton>
            );
          })}
        </div>
      </section>

      <motion.div
        layout
        className="style-gallery grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
      >
        <AnimatePresence mode="popLayout">
          {sorted.map((item, index) => {
            const coverClass = "style-cover cover-" + item.category + " style-cover-shine mb-0 rounded-none";
            return (
              <motion.div
                key={item.slug}
                id={item.slug}
                layout
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0.15 : 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <BentoTile
                  interactive
                  noPadding
                  className="overflow-hidden group h-full"
                  onClick={() => setDetailItem(item)}
                >
                  <div
                    className={coverClass}
                    onClick={(e) => {
                      if (item.cover) {
                        e.stopPropagation();
                        const idx = coversWithImages.findIndex((s) => s.slug === item.slug);
                        if (idx >= 0) setLightboxIndex(idx);
                      }
                    }}
                  >
                    {item.cover ? (
                      <>
                        <Image
                          src={item.cover}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          loading={index === 0 ? "eager" : "lazy"}
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-[1]" />
                      </>
                    ) : (
                      <div className="style-cover-gradient flex items-center justify-center">
                        <TypeIcon
                          name={item.category}
                          className="w-12 h-12 opacity-60 group-hover:scale-125 transition-transform duration-500 relative z-10"
                        />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-background/80">
                      <span className={"w-1.5 h-1.5 rounded-full " + getDot(item.member)} />
                      <span className="text-[10px] font-mono font-medium">{getLabel(item.member)}</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{item.category}</span>
                      <span className="text-muted/30 text-[10px]">{"\u00B7"}</span>
                      <span className="text-[10px] font-mono text-muted/60">{formatDateTime(item.date)}</span>
                    </div>
                    <h3 className="font-serif text-base font-semibold leading-snug group-hover:text-cp transition-colors duration-300">
                      {item.title}
                    </h3>
                    {item.brand && (
                      <p className="text-xs text-muted font-mono">
                        {item.brand}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-1">
                      {item.price ? (
                        <p className="text-xs text-cp font-mono font-medium">
                          {"\u00A5"}{item.price}
                        </p>
                      ) : (
                        <span />
                      )}
                      <div>
                        <TypeIcon name={item.category} className="w-4 h-4 text-muted/30" />
                      </div>
                    </div>
                  </div>
                </BentoTile>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {sorted.length === 0 && (
        <EmptyState message="暂无匹配的同款" hint="换个筛选条件试试" member="both" />
      )}

      <Lightbox
        src={lightboxIndex !== null ? coversWithImages[lightboxIndex]?.cover ?? null : null}
        alt={lightboxIndex !== null ? coversWithImages[lightboxIndex]?.title ?? "" : ""}
        onClose={() => setLightboxIndex(null)}
        onPrev={
          coversWithImages.length > 1 && lightboxIndex !== null
            ? () => setLightboxIndex((i) => (i! - 1 + coversWithImages.length) % coversWithImages.length)
            : undefined
        }
        onNext={
          coversWithImages.length > 1 && lightboxIndex !== null
            ? () => setLightboxIndex((i) => (i! + 1) % coversWithImages.length)
            : undefined
        }
        hasMultiple={coversWithImages.length > 1}
      />

      <DetailModal
        item={
          detailItem
            ? {
                id: detailItem.id,
                slug: detailItem.slug,
                title: detailItem.title,
                brand: detailItem.brand,
                category: detailItem.category,
                member: detailItem.member,
                date: detailItem.date,
                price: detailItem.price,
                image: detailItem.cover,
                bodyHtml: detailItem.html,
                tags: detailItem.tags,
              }
            : null
        }
        contextType="same-style"
        onClose={() => setDetailItem(null)}
        onImageClick={(src) => {
          const idx = coversWithImages.findIndex((s) => s.cover === src);
          if (idx >= 0) setLightboxIndex(idx);
        }}
      />
    </div>
  );
}
