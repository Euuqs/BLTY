"use client";

import { useEffect } from "react";
import Link from "next/link";
import { DogMascot, PigMascot } from "@/components/mascot/Mascots";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[柏里挑怡] 页面出错了:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="flex items-center gap-3">
          <DogMascot className="w-12 h-12 opacity-60 animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.35em] text-cp/60 uppercase">
            500 {"\u00B7"} Error
          </span>
          <PigMascot className="w-12 h-12 opacity-60 animate-pulse" />
        </div>

        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          哎呀，页面<em className="text-gradient-cp not-italic">出了点小状况</em>
        </h1>

        <p className="text-muted text-sm leading-relaxed">
          没关系，小狗和小猪会一直陪着你。试试刷新页面，或者回到首页重新出发吧。
        </p>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="relative overflow-hidden px-5 py-2.5 rounded-lg bg-gradient-to-r from-bai to-zhu text-white text-sm font-bold btn-press transition-transform active:scale-95"
          >
            再试一次
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-surface-2 text-muted text-sm font-mono hover:text-foreground transition-colors"
          >
            回到首页
          </Link>
        </div>

        {error.digest && (
          <p className="text-[10px] font-mono text-muted/40">
            错误编号: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
