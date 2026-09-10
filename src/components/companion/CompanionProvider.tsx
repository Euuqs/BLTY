"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { streamCompanionChat } from "@/lib/companion/client";
import type { CompanionMessage, CompanionPageContext, CompanionRecommendation } from "@/lib/companion/types";
import { CompanionDrawer } from "./CompanionDrawer";
import { CompanionTrigger } from "./CompanionTrigger";

export interface CompanionUiMessage extends CompanionMessage {
  recommendations?: CompanionRecommendation[];
  error?: boolean;
}

interface CompanionContextValue {
  isOpen: boolean;
  messages: CompanionUiMessage[];
  isStreaming: boolean;
  pageContext: CompanionPageContext;
  open: () => void;
  close: () => void;
  send: (message: string) => Promise<void>;
  stop: () => void;
  clear: () => void;
  setPageContext: (context?: CompanionPageContext) => void;
}

const CompanionContext = createContext<CompanionContextValue | null>(null);

function contextFromPath(pathname: string): CompanionPageContext {
  if (pathname.startsWith("/same-styles")) return { pageType: "same-style" };
  if (pathname.startsWith("/schedule")) return { pageType: "schedule" };
  if (pathname.startsWith("/feed")) return { pageType: "feed" };
  if (pathname.startsWith("/tour")) return { pageType: "tour" };
  if (pathname === "/") return { pageType: "home" };
  return { pageType: "unknown" };
}

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const baseContext = useMemo(() => contextFromPath(pathname), [pathname]);
  const [detailContext, setDetailContext] = useState<CompanionPageContext>();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CompanionUiMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const pageContext = detailContext ?? baseContext;

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const send = useCallback(async (rawMessage: string) => {
    const content = rawMessage.trim();
    if (!content || isStreaming) return;

    const userMessage: CompanionUiMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    const assistantId = crypto.randomUUID();
    const history = messages.slice(-12).map(({ id, role, content: text, createdAt }) => ({
      id,
      role,
      content: text,
      createdAt,
    }));

    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamCompanionChat(
        { message: content, conversation: history, pageContext },
        (event) => {
          setMessages((current) => current.map((item) => {
            if (item.id !== assistantId) return item;
            if (event.type === "text-delta") return { ...item, content: item.content + event.delta };
            if (event.type === "recommendations") return { ...item, recommendations: event.items };
            if (event.type === "error") return { ...item, error: true, content: event.message };
            return item;
          }));
        },
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        setMessages((current) => current.map((item) =>
          item.id === assistantId
            ? { ...item, error: true, content: error instanceof Error ? error.message : "陪伴者暂时无法连接，请稍后再试。" }
            : item,
        ));
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setIsStreaming(false);
    }
  }, [isStreaming, messages, pageContext]);

  const value = useMemo<CompanionContextValue>(() => ({
    isOpen,
    messages,
    isStreaming,
    pageContext,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    send,
    stop,
    clear: () => {
      stop();
      setMessages([]);
    },
    setPageContext: setDetailContext,
  }), [isOpen, messages, isStreaming, pageContext, send, stop]);

  return (
    <CompanionContext.Provider value={value}>
      {children}
      <CompanionTrigger />
      <CompanionDrawer />
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const value = useContext(CompanionContext);
  if (!value) throw new Error("useCompanion must be used inside CompanionProvider");
  return value;
}

