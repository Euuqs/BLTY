"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";

const shortcuts = [
  { keys: ["⌘", "K"], label: "搜索全局", desc: "打开命令面板" },
  { keys: ["G", "H"], label: "首页", desc: "快速回首页" },
  { keys: ["G", "S"], label: "同款", desc: "跳转同款页" },
  { keys: ["?"], label: "帮助", desc: "显示所有快捷键" },
  { keys: ["↑", "↓"], label: "滚动", desc: "页面上下滚动" },
  { keys: ["Escape"], label: "关闭", desc: "关闭弹窗/菜单" },
];

export function KeyboardHints() {
  const [showHelp, setShowHelp] = useState(false);
  const [justPressed, setJustPressed] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, showHelp);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        setJustPressed("⌘K");
        setTimeout(() => setJustPressed(null), 1200);
      }
      if (e.key === "?") {
        setShowHelp((v) => !v);
      }
      if (e.key === "Escape") {
        setShowHelp(false);
      }
      if (e.key === "g" || e.key === "G") {
        setJustPressed("G");
        setTimeout(() => setJustPressed(null), 1200);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-40 group flex min-h-11 min-w-11 items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface/60 backdrop-blur border border-border/40 hover:border-cp/30 hover:bg-surface/80 transition-all text-[10px] font-mono text-muted hover:text-foreground"
        aria-label="键盘快捷键帮助"
      >
        <span className="opacity-60 group-hover:opacity-100 transition-opacity">⌨</span>
        <kbd className="px-1 py-0.5 rounded bg-surface-2 text-[9px] font-mono border border-border/60 text-muted">
          ?
        </kbd>
      </motion.button>

      <AnimatePresence>
        {justPressed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-xl bg-surface/90 backdrop-blur border border-cp/40 text-cp font-mono text-sm shadow-[0_0_20px_oklch(0.65_0.22_295/0.3)]"
          >
            {justPressed}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="键盘快捷键"
              className="w-full max-w-sm bento-tile p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-xs tracking-[0.2em] text-foreground uppercase">
                  ⌨ 键盘快捷键
                </h3>
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
                  aria-label="关闭快捷键帮助"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                {shortcuts.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 py-1.5"
                  >
                    <div className="flex items-center gap-1">
                      {s.keys.map((k, ki) => (
                        <kbd
                          key={ki}
                          className="px-1.5 py-0.5 rounded bg-surface-2 text-[10px] font-mono text-foreground border border-border min-w-[20px] text-center"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-foreground">{s.label}</span>
                      <span className="ml-2 text-[10px] text-muted">{s.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-4 text-[10px] text-muted/60 font-mono">
                按 ESC 或点击外部关闭
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
