import { publishedSchedules as schedules } from "@/lib/velite";
import { ScheduleClient } from "@/components/schedule/ScheduleClient";
import { ScheduleHero } from "@/components/schedule/ScheduleHero";

export const metadata = {
  title: "行程日历",
  description: "柏欣妤 × 朱怡欣 综艺、直播、演出、线下活动日程安排",
};

export default function SchedulePage() {
  return (
    <div className="schedule-shell flex flex-col gap-8">
      <ScheduleHero itemCount={schedules.length} />
      <ScheduleClient schedules={schedules} />
    </div>
  );
}
