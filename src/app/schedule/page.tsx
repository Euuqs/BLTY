import { schedules } from "@/lib/velite";
import { ScheduleClient } from "@/components/schedule/ScheduleClient";
import { DogMascot, PigMascot } from "@/components/mascot/Mascots";

export const metadata = { title: "行程" };

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.35em] text-cp uppercase">
            {"\u00A7"} 02 {"\u00B7"} Schedule
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-cp/30 to-transparent" />
          <DogMascot className="w-5 h-5 opacity-70" />
          <PigMascot className="w-5 h-5 opacity-70" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          <em className="text-gradient-cp not-italic">行程</em>日历
        </h1>
        <p className="text-muted text-sm max-w-xl">周/月更 {"\u00B7"} 综艺 {"\u00B7"} 直播 {"\u00B7"} 演出 {"\u00B7"} 线下活动</p>
      </header>

      <ScheduleClient schedules={schedules} />
    </div>
  );
}
