"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          margin: 0,
          background: "#120d20",
          color: "#f5f0ff",
          fontFamily:
            '"LXGW WenKai", "Noto Serif SC", Georgia, "Times New Roman", serif',
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420, padding: "0 24px" }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              letterSpacing: "0.35em",
              color: "oklch(0.65 0.22 295 / 0.6)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            500 {"\u00B7"} Fatal
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: "0 0 16px" }}>
            页面遇到了严重问题
          </h1>
          <p style={{ color: "oklch(0.7 0.02 300)", fontSize: 14, lineHeight: 1.7, margin: "0 0 28px" }}>
            小狗和小猪正在努力修复，请稍后再试。
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(to right, oklch(0.92 0.01 260), oklch(0.55 0.20 250))",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              再试一次
            </button>
            <Link
              href="/"
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                background: "oklch(0.25 0.02 300)",
                color: "oklch(0.7 0.02 300)",
                fontSize: 14,
                fontFamily: "monospace",
                textDecoration: "none",
              }}
            >
              回到首页
            </Link>
          </div>
          {error.digest && (
            <p
              style={{
                marginTop: 24,
                fontSize: 10,
                fontFamily: "monospace",
                color: "oklch(0.5 0.02 300 / 0.4)",
              }}
            >
              {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
