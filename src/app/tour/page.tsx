import type { Metadata } from "next";
import { TourClient } from "@/components/tour/TourClient";

export const metadata: Metadata = {
  title: "双人巡演档案",
  description: "柏欣妤 × 朱怡欣 2025《心跳花火》武汉、厦门站与2026《PRIVATE SIGNAL》杭州站舞台档案。",
};

export default function TourPage() {
  return <TourClient />;
}
