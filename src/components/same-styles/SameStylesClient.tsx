"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { BentoTile } from "@/components/bento/BentoTile";
import { DogMascot, PigMascot } from "@/components/mascot/Mascots";
import { TypeIcon } from "@/components/ui/TypeIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFeedback } from "@/components/ui/FeedbackProvider";
import { Lightbox } from "@/components/ui/Lightbox";
import { DetailModal } from "@/components/ui/DetailModal";
import { sameStyles } from "@/lib/velite";
import { formatDateTime } from "@/lib/date";

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
    default: "bg-cp text-background border-cp shadow-[0_0_12px_oklch(0.65_0.22_295/0.4)]",
    bai: "bg-bai text-background border-bai shadow-[0_0_12px_oklch(0.92_0.01_260/0.4)]",
    zhu: "bg-zhu text-background border-zhu shadow-[0_0_12px_oklch(0.55_0.20_250/0.4)]",
    cp: "bg-cp text-background border-cp shadow-[0_0_12px_oklch(0.65_0.22_295/0.4)]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        createRipple(e);
        onClick();
      }}
      className={
        "relative overflow-hidden px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all duration-200 btn-press ripple-container " +
        (active
          ? activeStyles[variant]
          : "bg-surface/50 text-muted border-border hover:border-cp/50 hover:text-foreground")
      }
    >
      {children}
    </motion.button>
  );
}

export function SameStylesClient() {
  const [activeCat, setActiveCat] = useState<Category>("全部");
  const [activeMember, setActiveMember] = useState<Member>("全部");
  const [sort, setSort] = useState<SortMode>("new");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<(typeof sameStyles)[number] | null>(null);

  const filtered = useMemo(() => sameStyles.filter((item) => {
    const catMatch = activeCat === "全部" || item.category === activeCat;
    let memberMatch = true;
    if (activeMember !== "全部") { memberMatch = item.member === memberToKey[activeMember]; }
    return catMatch && memberMatch;
  }), [activeCat, activeMember]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sort === "priceAsc") return parsePrice(a.price) - parsePrice(b.price);
    if (sort === "priceDesc") return parsePrice(b.price) - parsePrice(a.price);
    return a.date < b.date ? 1 : -1;
  }), [filtered, sort]);

  const coversWithImages = useMemo(
    () => sorted.filter((s) => s.cover),
    [sorted]
  );

  const getMemberVariant = (m: Member): "bai" | "zhu" | "cp" | "default" => {
    if (m === "柏欣妤") return "bai";
    if (m === "朱怡欣") return "zhu";
    if (m === "双人") return "cp";
    return "default";
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.35em] text-cp uppercase">
            {"\u00A7"} 01 {"\u00B7"} Same Style
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-cp/30 to-transparent" />
          <motion.div whileHover={{ scale: 1.1, rotate: -10 }} className="cursor-pointer">
            <DogMascot className="w-5 h-5 opacity-70" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="cursor-pointer">
            <PigMascot className="w-5 h-5 opacity-70" />
          </motion.div>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          <em className="text-gradient-cp not-italic">同款</em>衣橱
        </h1>
        <p className="text-muted text-sm max-w-xl">
          柏欣妤 {"&"} 朱怡欣 的衣品、配饰、零食与生活同款，持续更新。
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
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
        <div className="flex flex-wrap gap-1.5">
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
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
      >
        <AnimatePresence mode="popLayout">
          {sorted.map((item) => {
            const coverClass = "style-cover cover-" + item.category + " style-cover-shine mb-0 rounded-none";
            return (
              <motion.div
                key={item.slug}
                id={item.slug}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-sm"
                    >
                      <span className={"w-1.5 h-1.5 rounded-full " + getDot(item.member)} />
                      <span className="text-[10px] font-mono font-medium">{getLabel(item.member)}</span>
                    </motion.div>
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
                      <motion.p
                        whileHover={{ x: 2 }}
                        className="text-xs text-muted font-mono"
                      >
                        {item.brand}
                      </motion.p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-1">
                      {item.price ? (
                        <motion.p
                          whileHover={{ scale: 1.05 }}
                          className="text-xs text-cp font-mono font-medium"
                        >
                          {"\u00A5"}{item.price}
                        </motion.p>
                      ) : (
                        <span />
                      )}
                      <motion.div whileHover={{ rotate: 15, scale: 1.2 }}>
                        <TypeIcon name={item.category} className="w-4 h-4 text-muted/30" />
                      </motion.div>
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
                title: detailItem.title,
                brand: detailItem.brand,
                category: detailItem.category,
                member: detailItem.member,
                date: detailItem.date,
                price: detailItem.price,
                image: detailItem.cover,
                bodyCode: detailItem.body,
                tags: detailItem.tags,
              }
            : null
        }
        onClose={() => setDetailItem(null)}
        onImageClick={(src) => {
          const idx = coversWithImages.findIndex((s) => s.cover === src);
          if (idx >= 0) setLightboxIndex(idx);
        }}
      />
    </div>
  );
}
