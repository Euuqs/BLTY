"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CompanionRecommendationCard } from "@/lib/companion/catalog";
import type { CompanionRecommendation } from "@/lib/companion/types";
import { ArrowIcon } from "./icons";

const labels = { story: "故事", "same-style": "同款", schedule: "行程", feed: "动态" } as const;

export function RecommendationCard({ recommendation }: { recommendation: CompanionRecommendation }) {
  const [card, setCard] = useState<CompanionRecommendationCard>();

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ type: recommendation.type, id: recommendation.id });
    fetch(`/api/companion/recommendation?${query}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : undefined)
      .then((value) => setCard(value as CompanionRecommendationCard | undefined))
      .catch(() => undefined);
    return () => controller.abort();
  }, [recommendation.id, recommendation.type]);

  if (!card) return null;
  const content = (
    <>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cp">{labels[card.type]}</span>
      <strong className="mt-1 block font-serif text-sm text-foreground">{card.title}</strong>
      {card.subtitle && <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted">{card.subtitle}</span>}
      {card.href && <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cp">去看看 <ArrowIcon className="h-3.5 w-3.5" /></span>}
    </>
  );

  return card.href ? (
    <Link href={card.href} className="block rounded-xl border border-cp/20 bg-cp/10 p-3 transition-colors hover:border-cp/45 hover:bg-cp/15">
      {content}
    </Link>
  ) : (
    <div className="rounded-xl border border-cp/20 bg-cp/10 p-3">{content}</div>
  );
}

