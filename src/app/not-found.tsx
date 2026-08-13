import Link from "next/link";
import { DogMascot, PigMascot } from "@/components/mascot/Mascots";

export const metadata = { title: "页面走丢了" };

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="flex items-center gap-3">
          <DogMascot className="w-12 h-12 opacity-60" />
          <span className="font-mono text-2xl font-bold text-gradient-cp">404</span>
          <PigMascot className="w-12 h-12 opacity-60" />
        </div>

        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          这页<em className="text-gradient-cp not-italic">走丢了</em>
        </h1>

        <p className="text-muted text-sm leading-relaxed">
          小狗和小猪找了一圈也没找到这个地址，可能链接已经失效了。
        </p>

        <Link
          href="/"
          className="relative overflow-hidden px-5 py-2.5 rounded-lg bg-gradient-to-r from-bai to-zhu text-white text-sm font-bold btn-press transition-transform active:scale-95"
        >
          回到首页
        </Link>
      </div>
    </div>
  );
}
