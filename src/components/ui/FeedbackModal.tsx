"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFeedback } from "./FeedbackProvider";
import { useFocusTrap } from "@/lib/useFocusTrap";

const MAX_CONTENT = 500;
const COOLDOWN_MS = 60_000;

type Status = "idle" | "submitting" | "success" | "error";

export function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { spawnParticles, burstConfetti, createRipple } = useFeedback();
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!cooldownUntil) return;
    const update = () =>
      setCooldownLeft(Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [cooldownUntil]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-feedback", handler);
    return () => window.removeEventListener("open-feedback", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const remainingCooldown = cooldownLeft;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    const text = content.trim();
    if (!text) {
      setError("请填写意见内容");
      setStatus("error");
      return;
    }
    if (text.length > MAX_CONTENT) {
      setError(`内容不能超过 ${MAX_CONTENT} 字`);
      setStatus("error");
      return;
    }
    const cooldown = cooldownUntil
      ? Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))
      : 0;
    if (cooldown > 0) {
      setError(`提交太频繁了，请 ${cooldown} 秒后再试`);
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          nickname: nickname.trim(),
          contact: contact.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string })?.error || "提交失败，请稍后再试");
        setStatus("error");
        return;
      }
      setStatus("success");
      setCooldownUntil(Date.now() + COOLDOWN_MS);
      burstConfetti(2000);
      setTimeout(() => {
        spawnParticles(window.innerWidth / 2, window.innerHeight / 2, "hearts", 10);
      }, 300);
    } catch {
      setError("网络异常，请稍后再试");
      setStatus("error");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      if (status === "success") {
        setContent("");
        setNickname("");
        setContact("");
      }
      setStatus("idle");
      setError("");
    }, 300);
  };

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    createRipple(e);
    setOpen(true);
  };

  return (
    <>
      {/* 悬浮入口 */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={handleOpen}
        className="fixed bottom-24 right-4 md:bottom-24 md:right-8 z-50 group ripple-container overflow-hidden"
        aria-label="提意见"
      >
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-br from-cp/80 to-zhu/80 backdrop-blur text-sm text-white shadow-glow border border-white/10 btn-press">
          <span>{"\u{1F4A1}"}</span>
          <span className="font-mono text-[10px] tracking-wider">提意见</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              aria-label="意见箱"
              className="w-full sm:max-w-lg bento-tile p-0 overflow-hidden max-h-[92vh] sm:max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{"\u{1F4E8}"}</span>
                    <h2 className="font-serif text-xl font-semibold">意见箱</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    aria-label="关闭"
                    className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-foreground transition-colors"
                  >
                    {"\u2715"}
                  </motion.button>
                </div>

                {status === "success" ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16 }}
                      className="text-5xl mb-4"
                    >
                      {"\u{1F389}"}
                    </motion.span>
                    <p className="font-serif text-lg font-semibold mb-1">感谢你的意见！</p>
                    <p className="text-sm text-muted mb-6">我们已收到，会认真阅读每一份反馈。</p>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setStatus("idle");
                          setError("");
                          setContent("");
                        }}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-bai to-zhu text-white text-sm font-bold btn-press"
                      >
                        再提一条
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg bg-surface-2 text-muted text-sm font-mono btn-press"
                      >
                        关闭
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="feedback-name" className="text-[10px] font-mono text-muted tracking-wider">
                        昵称（选填）
                      </label>
                      <input
                        id="feedback-name"
                        type="text"
                        value={nickname}
                        maxLength={50}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="怎么称呼你？"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-cp/60 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="feedback-content" className="text-[10px] font-mono text-muted tracking-wider">
                        意见内容{" "}
                        <span className="text-cp">*</span>
                      </label>
                      <textarea
                        id="feedback-content"
                        value={content}
                        maxLength={MAX_CONTENT}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="想对本站提的建议、想法，或看到的不足…"
                        rows={5}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-cp/60 transition-colors resize-none"
                      />
                      <p className="text-right text-[10px] font-mono text-muted/50">
                        {content.length}/{MAX_CONTENT}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="feedback-contact" className="text-[10px] font-mono text-muted tracking-wider">
                        联系方式（选填）
                      </label>
                      <input
                        id="feedback-contact"
                        type="text"
                        value={contact}
                        maxLength={100}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="微博 / 邮箱等，方便回复你"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-cp/60 transition-colors"
                      />
                    </div>

                    {status === "error" && error && (
                      <p className="text-xs text-rose border border-rose/30 bg-rose/10 rounded-lg px-3 py-2">
                        {error}
                      </p>
                    )}

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={status === "submitting" || remainingCooldown > 0}
                        className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-bai to-zhu text-white text-sm font-bold btn-press disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {status === "submitting"
                          ? "提交中…"
                          : remainingCooldown > 0
                            ? `${remainingCooldown} 秒后可再次提交`
                            : `提交意见 {"\u2764"}`}
                      </motion.button>
                      <p className="text-center text-[10px] text-muted/50 mt-2 font-mono">
                        匿名提交 {"\u00B7"} 仅用于本站改进
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}