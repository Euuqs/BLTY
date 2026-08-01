"use client";

import { useState } from "react";
import Image from "next/image";
import { BentoTile } from "@/components/bento/BentoTile";
import { sameStyles } from "@/lib/velite";

const categories = ["全部", "衣服", "饰品", "零食", "美妆", "鞋包", "其他"] as const;
const members = ["全部", "柏欣妤", "朱怡欣", "双人"] as const;
type Category = (typeof categories)[number];
type Member = (typeof members)[number];

const memberToKey: Record<string, "A" | "B" | "both"> = {
  "柏欣妤": "A", "朱怡欣": "B", "双人": "both",
};

const coverEmoji: Record<string, string> = {
  "衣服": "\u{1F457}", "饰品": "\u{1F48D}", "零食": "\u{1F36A}", "美妆": "\u{1F484}", "鞋包": "\u{1F45C}", "其他": "\u2728",
};

const getDot = (m: string) => m === "A" ? "dot-bai" : m === "B" ? "dot-zhu" : "dot-cp";
const getLabel = (m: string) => m === "A" ? "柏欣妤" : m === "B" ? "朱怡欣" : "双人";

export default function SameStylesPage() {
  const [activeCat, setActiveCat] = useState<Category>("全部");
  const [activeMember, setActiveMember] = useState<Member>("全部");

  const filtered = sameStyles.filter((item) => {
    const catMatch = activeCat === "全部" || item.category === activeCat;
    let memberMatch = true;
    if (activeMember !== "全部") { memberMatch = item.member === memberToKey[activeMember]; }
    return catMatch && memberMatch;
  });

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.35em] text-cp uppercase">
            {"\u00A7"} 01 {"\u00B7"} Same Style
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          <em className="text-gradient-cp not-italic">同款</em>衣橱
        </h1>
        <p className="text-muted text-sm max-w-xl">
          柏欣妤 {"&"} 朱怡欣 的衣品、配饰、零食与生活同款，持续更新。
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={"px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all duration-200 " +
                (activeCat === cat
                  ? "bg-cp text-background border-cp shadow-[0_0_12px_oklch(0.65_0.22_295/0.4)]"
                  : "bg-surface/50 text-muted border-border hover:border-cp/50 hover:text-foreground")}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {members.map((m) => {
            const isActive = activeMember === m;
            const dotClass = m === "柏欣妤" ? "dot-bai" : m === "朱怡欣" ? "dot-zhu" : m === "双人" ? "dot-cp" : "";
            let activeStyle = "bg-surface-2 text-foreground border-border";
            if (m === "柏欣妤") activeStyle = "bg-bai text-background border-bai";
            else if (m === "朱怡欣") activeStyle = "bg-zhu text-background border-zhu";
            else if (m === "双人") activeStyle = "bg-cp text-background border-cp";
            return (
              <button
                key={m}
                onClick={() => setActiveMember(m)}
                className={"flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all duration-200 " +
                  (isActive ? activeStyle : "bg-surface/50 text-muted border-border hover:border-cp/50 hover:text-foreground")}
              >
                {dotClass && <span className={"w-1.5 h-1.5 rounded-full " + dotClass} />}
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const coverClass = "style-cover cover-" + item.category + " mb-0 rounded-none";
          return (
            <BentoTile key={item.slug} interactive noPadding className="overflow-hidden group">
              <div className={coverClass}>
                {item.cover ? (
                  <>
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-[1]" />
                  </>
                ) : (
                  <div className="style-cover-gradient flex items-center justify-center">
                    <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-500 relative z-10">
                      {coverEmoji[item.category] || "\u2728"}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-sm">
                  <span className={"w-1.5 h-1.5 rounded-full " + getDot(item.member)} />
                  <span className="text-[10px] font-mono font-medium">{getLabel(item.member)}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{item.category}</span>
                  <span className="text-muted/30 text-[10px]">{"\u00B7"}</span>
                  <span className="text-[10px] font-mono text-muted/60">{item.date}</span>
                </div>
                <h3 className="font-serif text-base font-semibold leading-snug group-hover:text-cp transition-colors duration-300">
                  {item.title}
                </h3>
                {item.brand && <p className="text-xs text-muted font-mono">{item.brand}</p>}
                {item.price && <p className="text-xs text-cp font-mono mt-auto">{"\u00A5"}{item.price}</p>}
              </div>
            </BentoTile>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted font-mono text-sm">暂无匹配的同款</div>
      )}
    </div>
  );
}
