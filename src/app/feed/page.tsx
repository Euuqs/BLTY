import { feeds } from "@/lib/velite";
import { FeedClient } from "@/components/feed/FeedClient";

export const metadata = { title: "动态" };

export default function FeedPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.35em] text-cp uppercase">
            {"\u00A7"} 03 {"\u00B7"} Feed
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
          <em className="text-gradient-cp not-italic">动态</em>时间线
        </h1>
        <p className="text-muted text-sm max-w-xl">周/月更 {"\u00B7"} 路透 {"\u00B7"} 日常 {"\u00B7"} 舞台记录</p>
      </header>

      <FeedClient feeds={feeds} />
    </div>
  );
}
