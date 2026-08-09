import type { Metadata, Viewport } from "next";
import { MotionConfig } from "motion/react";
import "@fontsource-variable/fraunces";
import "@fontsource/manrope";
import "@fontsource/jetbrains-mono";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { DogMascot, PigMascot, Paw, Rose } from "@/components/mascot/Mascots";

export const viewport: Viewport = {
  themeColor: "#120d20",
};

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
        <MotionConfig reducedMotion="user">
          <div className="cp-atmosphere" />
          <div className="cp-stars" />
          <ScrollProgress />
          <Navigation />
          <main className="flex-1 px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <footer className="py-10 text-center flex flex-col items-center gap-3">
            <div className="relative flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-4">
                <DogMascot className="mascot-float w-9 h-9 opacity-80" />
                <span className="text-cp/50 text-base tracking-widest">{"\u2665"}</span>
                <PigMascot className="mascot-float mascot-float-delayed w-9 h-9 opacity-80" />
              </div>
              <Paw className="absolute -bottom-2 -left-8 w-4 h-4 text-muted/20 rotate-[-16deg]" />
              <Paw className="absolute -bottom-2 -right-8 w-3.5 h-3.5 text-muted/15 rotate-[12deg]" />
              <Rose className="mascot-float absolute -top-3 right-10 w-4 h-4 text-rose/40 rotate-[18deg]" />
            </div>
            <p className="text-muted text-xs font-mono tracking-wider">
              心动穿越千里 · 所爱柏里挑怡
            </p>
            <p className="text-muted/50 text-[10px] font-mono">
              非官方应援站 · 周/月更
            </p>
          </footer>
          <BackToTop />
        </MotionConfig>
      </body>
    </html>
  );
}