import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { sameStyles, schedules, feeds } from "@/lib/velite";

interface SearchResult {
  type: "same-style" | "schedule" | "feed";
  title: string;
  subtitle?: string;
  href: string;
  slug: string;
  member?: string;
}

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("q") ?? "";
  const q = raw.trim().toLowerCase();
  if (!q) return NextResponse.json([] as SearchResult[]);

  const results: SearchResult[] = [];

  sameStyles.forEach((s) => {
    if (
      s.title.toLowerCase().includes(q) ||
      s.brand?.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    ) {
      results.push({
        type: "same-style",
        title: s.title,
        subtitle: s.brand || s.category,
        href: `/same-styles#${encodeURIComponent(s.slug)}`,
        slug: s.slug,
        member: s.member,
      });
    }
  });

  schedules.forEach((s) => {
    if (s.title.toLowerCase().includes(q) || s.location?.toLowerCase().includes(q)) {
      results.push({
        type: "schedule",
        title: s.title,
        subtitle: s.date + (s.time ? " " + s.time : ""),
        href: `/schedule#${encodeURIComponent(s.slug)}`,
        slug: s.slug,
        member: s.member,
      });
    }
  });

  feeds.forEach((f) => {
    if (
      f.title.toLowerCase().includes(q) ||
      f.description?.toLowerCase().includes(q) ||
      f.tags?.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        type: "feed",
        title: f.title,
        subtitle: f.description?.slice(0, 40),
        href: `/feed#${encodeURIComponent(f.slug)}`,
        slug: f.slug,
        member: f.member,
      });
    }
  });

  return NextResponse.json(results.slice(0, 12));
}