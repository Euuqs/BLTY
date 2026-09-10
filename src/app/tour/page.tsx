import type { Metadata } from "next";
import { TourClient } from "@/components/tour/TourClient";

export const metadata: Metadata = {
  title: "PRIVATE SIGNAL · 演出后舞台档案",
  description: "柏欣妤 × 朱怡欣 PRIVATE SIGNAL 双人巡演杭州站舞台影像与演出记忆。",
};

export default function TourPage() {
  return <TourClient />;
}
