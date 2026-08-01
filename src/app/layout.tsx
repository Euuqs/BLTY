import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource/manrope";
import "@fontsource/jetbrains-mono";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: {
    default: "柏里挑怡 · 心动穿越千里",
    template: "%s · 柏里挑怡",
  },
  description: "柏欣妤 × 朱怡欣 同款 · 行程 · 动态 应援站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col font-sans">
        <div className="cp-atmosphere" />
        <div className="cp-stars" />
        <Navigation />
        <main className="flex-1 px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <footer className="py-10 text-center">
          <p className="text-muted text-xs font-mono tracking-wider mb-1">
            心动穿越千里 · 所爱柏里挑怡
          </p>
          <p className="text-muted/50 text-[10px] font-mono">
            非官方应援站 · 周/月更
          </p>
        </footer>
      </body>
    </html>
  );
}