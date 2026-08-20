"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useFeedback } from "./FeedbackProvider";
import { MdxRenderer } from "./MdxRenderer";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { ArrowUpRight } from "@/components/mascot/Mascots";

interface DetailItem {
  title: string;
  brand?: string;
  category?: string;
  member: string;
  date?: string;
  price?: string;
  link?: string;
  image?: string;
  description?: string;
  bodyHtml?: string;
  tags?: string[];
}

interface DetailModalProps {
  item: DetailItem | null;
  onClose: () => void;
  onImageClick?: (src: string) => void;
}

export function DetailModal({ item, onClose, onImageClick }: DetailModalProps) {
  const { spawnParticles, createRipple } = useFeedback();
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, !!item);

  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
      const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      document.addEventListener("keydown", handler);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handler);
      };
    }
  }, [item, onClose]);

  const memberLabel = item?.member === "A" ? "柏欣妤" : item?.member === "B" ? "朱怡欣" : "双人";
  const memberColor = item?.member === "A" ? "text-bai" : item?.member === "B" ? "text-zhu" : "text-cp";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="presentation"
        >
          <motion.div
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            className="w-full sm:max-w-lg bento-tile p-0 overflow-hidden max-h-[92vh] sm:max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
          >
            {item.image && (
              <div
                className="relative aspect-video overflow-hidden cursor-zoom-in"
                onClick={(e) => {
                  createRipple(e);
                  onImageClick?.(item.image!);
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-2 py-1 rounded-lg bg-black/50 backdrop-blur text-[10px] font-mono ${memberColor}`}>
                    {memberLabel}
                  </span>
                  {item.category && (
                    <span className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur text-[10px] font-mono text-foreground">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                {item.brand && (
                  <p className="text-xs text-cp font-mono mb-1">{item.brand}</p>
                )}
                <h2 className="text-lg sm:text-xl font-bold text-foreground">{item.title}</h2>
              </div>

              {item.description && (
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              )}

              {item.bodyHtml && (
                <MdxRenderer
                  html={item.bodyHtml}
                  className="text-sm text-muted/90 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>a]:text-cp [&>a]:underline [&>ul]:list-disc [&>ul]:pl-4 [&>strong]:text-foreground"
                />
              )}

              <div className="flex flex-wrap gap-3 text-xs font-mono">
                {item.date && (
                  <div className="flex items-center gap-1.5 text-muted">
                    <span>{"\u{1F4C5}"}</span>
                    <span>{item.date}</span>
                  </div>
                )}
                {item.price && (
                  <div className="flex items-center gap-1.5 text-cp">
                    <span>{"\u{1F4B3}"}</span>
                    <span>{item.price}</span>
                  </div>
                )}
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      className="px-2 py-0.5 rounded-md bg-surface-2 text-[10px] text-muted font-mono cursor-default"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-3 -mb-1 sticky bottom-0 bg-surface/95 backdrop-blur-sm pb-1">
                {item.link && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      createRipple(e);
                      const rect = e.currentTarget.getBoundingClientRect();
                      spawnParticles(
                        rect.left + rect.width / 2,
                        rect.top,
                        "sparkles",
                        5
                      );
                    }}
                    className="flex-1 px-4 py-3 sm:py-2.5 rounded-lg bg-gradient-to-r from-bai to-zhu text-white text-sm font-bold text-center btn-press"
                  >
                    查看来源 <ArrowUpRight className="w-4 h-4 inline" />
                  </motion.a>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-3 sm:py-2.5 rounded-lg bg-surface-2 text-muted text-sm font-mono btn-press"
                >
                  关闭
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
