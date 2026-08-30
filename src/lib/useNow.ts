"use client";

import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from "react";

const NowContext = createContext<Date | null>(null);

export function NowProvider({
  children,
  initialTimestamp,
}: {
  children: ReactNode;
  initialTimestamp: number;
}) {
  const [now, setNow] = useState(() => new Date(initialTimestamp));

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timeoutId = setTimeout(refresh, 0);
    const id = setInterval(refresh, 60_000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(id);
    };
  }, []);

  return createElement(NowContext.Provider, { value: now }, children);
}

export function useNow() {
  const now = useContext(NowContext);
  if (!now) throw new Error("useNow must be used within NowProvider");
  return now;
}
