"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface LightboxProps {
  src: string | null;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasMultiple?: boolean;
}

export function Lightbox({ src, alt, onClose, onPrev, onNext, hasMultiple }: LightboxProps) {
  const [scale, setScale] = useState(1);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (src) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setScale(1);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [src, handleKeyDown]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && dt < 500) {
      if (dx > 0 && onPrev) onPrev();
      else if (dx < 0 && onNext) onNext();
    } else if (dy > 80 && Math.abs(dy) > Math.abs(dx) && dt < 500) {
      onClose();
    }
    touchStart.current = null;
  };

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors z-10"
            aria-label="关闭"
          >
            {"\u2715"}
          </motion.button>

          {hasMultiple && onPrev && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white text-xl transition-colors z-10"
              aria-label="上一张"
            >
              {"\u2039"}
            </motion.button>
          )}

          {hasMultiple && onNext && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white text-xl transition-colors z-10"
              aria-label="下一张"
            >
              {"\u203A"}
            </motion.button>
          )}

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-full"
            onWheel={(e) => {
              e.stopPropagation();
              setScale((s) => Math.min(3, Math.max(0.5, s - e.deltaY * 0.001)));
            }}
          >
            <div className="relative" style={{ transform: `scale(${scale})`, transition: "transform 0.2s" }}>
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={900}
                className="max-w-[85vw] max-h-[80vh] object-contain rounded-lg"
                unoptimized
              />
            </div>
            <div className="flex items-center justify-center gap-3 mt-3">
              <p className="text-center text-white/70 text-sm font-mono">
                {alt}
                {scale !== 1 && (
                  <span className="ml-2 text-cp">{Math.round(scale * 100)}%</span>
                )}
              </p>
              {hasMultiple && (
                <p className="text-white/40 text-[10px] font-mono sm:hidden">
                  左右滑动切换
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
