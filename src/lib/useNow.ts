"use client";

import { useSyncExternalStore } from "react";

let cachedNow = new Date();

function subscribe(callback: () => void) {
  const id = setInterval(() => {
    cachedNow = new Date();
    callback();
  }, 60_000);
  return () => clearInterval(id);
}

function getSnapshot() {
  return cachedNow;
}

/** 订阅当前时间，每分钟刷新一次（避免 hydration 不一致） */
export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
