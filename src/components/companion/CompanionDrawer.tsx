"use client";

import { AnimatePresence, motion } from "motion/react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { useCompanion } from "./CompanionProvider";
import { RecommendationCard } from "./RecommendationCard";
import { ChatIcon, CloseIcon, SendIcon, StopIcon, TrashIcon } from "./icons";

const pageLabels = {
  home: "首页",
  "same-style": "同款",
  schedule: "行程",
  feed: "动态",
  tour: "巡演",
  story: "故事",
  unknown: "当前页面",
} as const;

export function CompanionDrawer() {
  const { isOpen, close, messages, isStreaming, send, stop, clear, pageContext } = useCompanion();
  const [draft, setDraft] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  useFocusTrap(dialogRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, isOpen]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isStreaming && messages.length > 0) composerRef.current?.focus();
  }, [isOpen, isStreaming, messages.length]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const content = draft.trim();
    if (!content || isStreaming) return;
    setDraft("");
    await send(content);
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  const retryMessage = [...messages].reverse().find((message) => message.role === "user")?.content;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[90]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="关闭故事陪伴者" onClick={close} className="absolute inset-0 h-full w-full cursor-default bg-black/65 backdrop-blur-[2px]" />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="companion-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute inset-x-0 bottom-0 flex h-[min(92dvh,760px)] min-h-0 flex-col overflow-hidden rounded-t-3xl border border-border bg-surface/98 shadow-2xl sm:inset-y-0 sm:left-auto sm:h-full sm:w-[min(440px,100vw)] sm:rounded-none sm:rounded-l-3xl"
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-border/70 px-4 py-3 sm:px-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-bai/15 via-cp/20 to-zhu/20 text-cp">
                <ChatIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="companion-title" className="font-serif text-base font-semibold text-foreground">故事陪伴者</h2>
                <p className="truncate text-[11px] text-muted">
                  独立陪伴角色 · 当前：{pageContext.title ?? pageLabels[pageContext.pageType]}
                </p>
              </div>
              {messages.length > 0 && (
                <button type="button" onClick={clear} aria-label="清空本次聊天" title="清空本次聊天" className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-3 hover:text-foreground">
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
              <button type="button" onClick={close} aria-label="关闭故事陪伴者" className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-3 hover:text-foreground">
                <CloseIcon className="h-5 w-5" />
              </button>
            </header>

            <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5" aria-live="polite">
              {messages.length === 0 ? (
                <div className="flex min-h-full flex-col items-center justify-center px-4 text-center">
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cp/25 bg-cp/10 text-cp">
                    <ChatIcon className="h-7 w-7" />
                  </span>
                  <h3 className="font-serif text-xl font-semibold">想从哪里聊起？</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-muted">可以说说现在的心情，也可以问一段以前的故事。没有资料的事情，我不会替她们编。</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {["今天有点想她们", "给我找一个开心的故事"].map((prompt) => (
                      <button key={prompt} type="button" onClick={() => setDraft(prompt)} className="min-h-11 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-muted transition-colors hover:border-cp/40 hover:text-foreground">
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                      <div className="max-w-[88%] min-w-0">
                        <div className={"whitespace-pre-wrap [overflow-wrap:anywhere] rounded-2xl px-4 py-3 text-sm leading-6 " + (message.role === "user" ? "rounded-br-md bg-cp text-white" : message.error ? "rounded-bl-md border border-rose/35 bg-rose/10 text-foreground" : "rounded-bl-md border border-border bg-surface-2 text-foreground")}>
                          {message.content || (
                            <span className="inline-flex items-center gap-1.5 text-muted" aria-label="正在回复">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cp" />
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cp [animation-delay:150ms]" />
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cp [animation-delay:300ms]" />
                            </span>
                          )}
                        </div>
                        {message.recommendations && message.recommendations.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.recommendations.map((item) => <RecommendationCard key={`${item.type}:${item.id}`} recommendation={item} />)}
                          </div>
                        )}
                        {message.error && retryMessage && !isStreaming && (
                          <button type="button" onClick={() => void send(retryMessage)} className="mt-2 min-h-11 rounded-lg px-3 text-xs font-medium text-cp hover:bg-cp/10">重新发送</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={submit} className="shrink-0 border-t border-border/70 bg-surface px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-4">
              <label htmlFor="companion-message" className="sr-only">给故事陪伴者发送消息</label>
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface-2 p-2 focus-within:border-cp/55 focus-within:ring-2 focus-within:ring-cp/15">
                <textarea
                  ref={composerRef}
                  id="companion-message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value.slice(0, 2000))}
                  onKeyDown={onComposerKeyDown}
                  rows={1}
                  disabled={isStreaming}
                  placeholder="聊聊现在，或者问一段以前的故事…"
                  className="max-h-32 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-base leading-6 text-foreground outline-none placeholder:text-muted/70 disabled:opacity-60"
                />
                {isStreaming ? (
                  <button type="button" onClick={stop} aria-label="停止生成" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cp/30 bg-cp/10 text-cp transition-colors hover:bg-cp/20">
                    <StopIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <button type="submit" disabled={!draft.trim()} aria-label="发送消息" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cp text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40">
                    <SendIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-center text-[10px] leading-4 text-muted/75">AI 可能出错；事实问题以站内资料为准。</p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
