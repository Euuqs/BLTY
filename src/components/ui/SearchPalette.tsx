"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useFeedback } from "./FeedbackProvider";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { ArrowUpRight } from "@/components/mascot/Mascots";

type SearchResult = {
  type: "same-style" | "schedule" | "feed";
  title: string;
  subtitle?: string;
  href: string;
  slug: string;
  member?: string;
};

function getDot(m: string) {
  return m === "A" ? "dot-bai" : m === "B" ? "dot-zhu" : "dot-cp";
}

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchSeq = useRef(0);
  const { createRipple, spawnParticles } = useFeedback();
  useFocusTrap(panelRef, open);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const seq = ++searchSeq.current;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (!controller.signal.aborted) setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data: SearchResult[] = await res.json();
        if (searchSeq.current === seq) {
          setResults(data);
          setLoading(false);
        }
      } catch {
        if (searchSeq.current === seq) {
          setResults([]);
          setLoading(false);
        }
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const typeLabels: Record<string, string> = {
    "same-style": "同款",
    schedule: "行程",
    feed: "动态",
  };

  const typeColors: Record<string, string> = {
    "same-style": "text-bai",
    schedule: "text-zhu",
    feed: "text-cp",
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          createRipple(e);
          setActiveIndex(0);
          setOpen(true);
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/50 border border-border text-muted text-xs font-mono hover:border-cp/40 hover:text-foreground transition-all btn-press"
      >
        <span>{"\u{1F50D}"}</span>
        <span className="hidden sm:inline">搜索</span>
        <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-surface-2 text-[10px] border border-border">
          Ctrl K
        </kbd>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              ref={panelRef}
              className="w-full max-w-xl bento-tile p-0 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <span className="text-muted">{"\u{1F50D}"}</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuery(value);
                    setActiveIndex(0);
                    if (!value.trim()) setResults([]);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.max(i - 1, 0));
                    } else if (e.key === "Enter" && results[activeIndex]) {
                      e.preventDefault();
                      const target = listRef.current?.querySelector<HTMLAnchorElement>(
                        `[data-index="${activeIndex}"]`
                      );
                      target?.click();
                    }
                  }}
                  placeholder="搜索同款、行程、动态..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls="search-results-list"
                  aria-activedescendant={results[activeIndex] ? `search-result-${activeIndex}` : undefined}
                />
                <kbd className="px-1.5 py-0.5 rounded bg-surface-2 text-[10px] font-mono text-muted border border-border">
                  ESC
                </kbd>
              </div>

              <div ref={listRef} id="search-results-list" className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
                {!query && (
                  <div className="py-8 text-center text-muted text-sm">
                    <p>输入关键词搜索全站内容</p>
                    <p className="text-xs mt-1 text-muted/60">试试：Adidas、生日、广州</p>
                  </div>
                )}
                {query && loading && (
                  <div className="py-8 text-center text-muted text-sm">
                    <p>搜索中...</p>
                  </div>
                )}
                {query && !loading && results.length === 0 && (
                  <div className="py-8 text-center text-muted text-sm">
                    <p>未找到相关结果</p>
                    <p className="text-xs mt-1 text-muted/60">换个关键词试试</p>
                  </div>
                )}
                {results.map((r, i) => (
                  <Link
                    key={i}
                    href={r.href}
                    prefetch={false}
                    data-index={i}
                    id={`search-result-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      spawnParticles(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2,
                        "sparkles",
                        4
                      );
                      setOpen(false);
                      setQuery("");
                      setResults([]);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                      i === activeIndex ? "bg-surface-2/70" : "hover:bg-surface-2/50"
                    }`}
                  >
                    {r.member && (
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDot(r.member)}`} />
                    )}
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 ${typeColors[r.type]}`}>
                      {typeLabels[r.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate group-hover:text-cp transition-colors">
                        {r.title}
                      </p>
                      {r.subtitle && (
                        <p className="text-[10px] text-muted truncate">{r.subtitle}</p>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
