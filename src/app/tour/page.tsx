import { DogMascot, PigMascot } from "@/components/mascot/Mascots";
import { TourClient } from "@/components/tour/TourClient";

export const metadata = {
  title: "PRIVATE SIGNAL 杭州站 · 巡演攻略",
  description: "柏欣妤 × 朱怡欣 PRIVATE SIGNAL 双人巡演杭州站应援攻略 · 时间地点 · 打卡指南",
};

export default function TourPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.35em] text-cp uppercase">
            {"\u00A7"} 05 {"\u00B7"} Tour
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-cp/30 to-transparent" />
          <DogMascot className="w-5 h-5 opacity-70" />
          <PigMascot className="w-5 h-5 opacity-70" />
        </div>
        <h1 className="max-w-[20rem] text-balance font-serif text-3xl sm:max-w-none sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          <em className="text-gradient-cp not-italic">PRIVATE SIGNAL</em> 杭州站
        </h1>
        <p className="text-muted text-sm max-w-xl">2026.08.22 周六 19:00 · 杭州新天地太阳剧场</p>
      </header>

      <TourClient />
    </div>
  );
}
