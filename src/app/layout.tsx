import type { Metadata, Viewport } from "next";
import { MotionConfig } from "motion/react";
import "@fontsource-variable/fraunces";
import "@fontsource/manrope";
import "@fontsource/jetbrains-mono";
import "@fontsource/great-vibes";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { FeedbackProvider } from "@/components/ui/FeedbackProvider";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { FooterMascots } from "@/components/layout/FooterMascots";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { SoundProvider } from "@/components/ui/SoundProvider";
import { MouseGlow } from "@/components/ui/MouseGlow";
import { EasterEggs } from "@/components/ui/EasterEggs";
import { PageTransition } from "@/components/ui/PageTransition";

export const viewport: Viewport = {
  themeColor: "#120d20",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bailitiaoyi.app"),
  title: {
    default: "柏里挑怡 · 心动穿越千里",
    template: "%s · 柏里挑怡",
  },
  description: "柏欣妤 × 朱怡欣 同款 · 行程 · 动态 应援站",
  keywords: ["柏欣妤", "朱怡欣", "柏里挑怡", "SNH48", "GNZ48", "同款", "行程", "应援"],
  authors: [{ name: "柏里挑怡应援站" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://bailitiaoyi.app",
    siteName: "柏里挑怡",
    title: "柏里挑怡 · 心动穿越千里",
    description: "柏欣妤 × 朱怡欣 同款 · 行程 · 动态 应援站",
    images: [
      {
        url: "/hero-wedding-og.jpg",
        width: 1200,
        height: 630,
        alt: "柏里挑怡",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "柏里挑怡 · 心动穿越千里",
    description: "柏欣妤 × 朱怡欣 同款 · 行程 · 动态 应援站",
    images: ["/hero-wedding-og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("cp-theme");document.documentElement.classList.toggle("light-theme",t==="light");var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==="light"?"#f6f4fb":"#120d20"}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <SoundProvider>
            <MotionConfig reducedMotion="user">
              <FeedbackProvider>
                <div className="cp-atmosphere" />
                <div className="cp-stars" />
                <MouseGlow />
                <ScrollProgress />
                <Navigation />
                <main className="flex-1 px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full">
                  <PageTransition>{children}</PageTransition>
                </main>
                <footer className="py-10 text-center flex flex-col items-center gap-3">
                  <FooterMascots />
                  <p className="text-muted text-xs font-mono tracking-wider">
                    心动穿越千里 · 所爱柏里挑怡
                  </p>
                  <p className="text-muted/50 text-[10px] font-mono">
                    非官方应援站 · 周/月更
                  </p>
                </footer>
                <BackToTop />
                <FeedbackModal />
                <EasterEggs />
              </FeedbackProvider>
            </MotionConfig>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
