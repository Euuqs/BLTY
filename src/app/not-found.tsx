import Link from "next/link";
import Image from "next/image";
import { DogMascot, PigMascot } from "@/components/mascot/Mascots";

export const metadata = { title: "页面走丢了" };

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center max-w-md">
        <div className="relative w-28 h-28">
          <div className="absolute inset-0 rounded-full bg-cp/10 blur-xl scale-110" />
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-cp/30 shadow-[0_0_32px_oklch(0.65_0.22_295/0.25)]">
            <Image
              src="/static/mascots/bai-rabbit.jpg"
              alt="柏里挑怡"
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DogMascot className="w-8 h-8 opacity-60" />
          <span className="font-mono text-xl font-bold text-gradient-cp">404</span>
          <PigMascot className="w-8 h-8 opacity-60" />
        </div>

        <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">
          这页<em className="text-gradient-cp not-italic">走丢了</em>
        </h1>

        <p className="text-muted text-sm leading-relaxed max-w-sm">
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
