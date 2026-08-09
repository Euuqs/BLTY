/* ============================================
   柏里挑怡 · 类型图标（自绘 SVG）
   同款品类 / 行程类型 / 动态类型 共用
   ============================================ */

import type { ReactNode } from "react";

type IconName =
  | "衣服" | "饰品" | "零食" | "美妆" | "鞋包" | "其他"
  | "综艺" | "直播" | "演出" | "活动"
  | "路透" | "日常" | "舞台" | "采访";

const paths: Record<IconName, ReactNode> = {
  /* ---- 同款品类 ---- */
  "衣服": (
    <>
      <path d="M8.5 4.5 4 6.5 2.5 10l3.5 2.5V20h12v-7.5L21 10 19.5 6.5 15 4.5" />
      <path d="M8.5 4.5c.5 1.6 1.6 2.6 3.5 2.6s3-1 3.5-2.6" />
    </>
  ),
  "饰品": (
    <>
      <path d="M7.5 8.5h9l3.5 4.5-8 8-8-8 3.5-4.5z" />
      <path d="M7.5 8.5l2.5-3.5h4l2.5 3.5" />
    </>
  ),
  "零食": (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z" />
      <circle cx="9" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="14" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  "美妆": (
    <>
      <path d="M7 11.5h10v5.5a3.5 3.5 0 0 1-3.5 3.5h-3A3.5 3.5 0 0 1 7 17v-5.5z" />
      <path d="M9.5 11.5c.2-2.4-1-4.6 1.5-5.6.5-1.5 2.5-1.5 3 0 2.5 1 1.3 3.2 1.5 5.6" />
    </>
  ),
  "鞋包": (
    <>
      <path d="M4.5 9h15a1 1 0 0 1 1 1v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V10a1 1 0 0 1 1-1z" />
      <path d="M9.5 9V7a2.5 2.5 0 0 1 5 0v2" />
      <path d="M4.5 13.5h15" />
    </>
  ),

  /* ---- 行程类型 ---- */
  "综艺": (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10.5h18" />
      <path d="M8 6l1.5-2.5M14 6l1.5-2.5M20 6l1.5-2.5" />
    </>
  ),
  "直播": (
    <>
      <circle cx="12" cy="13" r="2.5" />
      <path d="M8.5 9.5a5 5 0 0 0 0 7M15.5 9.5a5 5 0 0 1 0 7M5.8 6.8a9 9 0 0 0 0 12.4M18.2 6.8a9 9 0 0 1 0 12.4" />
    </>
  ),
  "演出": (
    <>
      <path d="M12 3.5l2.2 5.8 6.3.6-4.7 4.2 1.3 6.2-5.1-3.3-5.1 3.3 1.3-6.2L3.5 9.9l6.3-.6 2.2-5.8z" />
    </>
  ),
  "活动": (
    <>
      <path d="M3 9.5V7.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2.5 2.5 0 0 0 0 5v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2.5 2.5 0 0 0 0-5z" />
      <path d="M13.5 5.5v13" />
    </>
  ),

  /* ---- 动态类型 ---- */
  "路透": (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M8 7l1.5-2.5h5L16 7" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  "日常": (
    <>
      <path d="M12 20.5C6.5 16.5 3.5 13 3.5 9.6 3.5 7.2 5.2 5.5 7.6 5.5c1.6 0 3.2.8 4.4 2.4 1.2-1.6 2.8-2.4 4.4-2.4 2.4 0 4.1 1.7 4.1 4.1 0 3.4-3 6.9-8.5 10.9z" />
    </>
  ),
  "舞台": (
    <>
      <path d="M9.5 18.5V5.5L20 3.5v13" />
      <circle cx="7" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="16.5" r="2.5" />
    </>
  ),
  "采访": (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11.5a7 7 0 0 0 14 0" />
      <path d="M12 18.5V21" />
    </>
  ),

  /* ---- 兜底 ---- */
  "其他": (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
      <path d="M18.5 14.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" />
    </>
  ),
};

export function TypeIcon({ name, className = "" }: { name: string; className?: string }) {
  const node = paths[name as IconName] ?? paths["其他"];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {node}
    </svg>
  );
}
