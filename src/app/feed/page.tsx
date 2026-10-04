import { publishedFeeds as feeds } from "@/lib/velite";
import { FeedClient } from "@/components/feed/FeedClient";
import { FeedHero } from "@/components/feed/FeedHero";

export const metadata = {
  title: "动态时间线",
  description: "柏欣妤 × 朱怡欣 路透、日常、舞台记录，持续更新中",
};

export default function FeedPage() {
  return (
    <div className="feed-shell flex flex-col gap-8">
      <FeedHero itemCount={feeds.length} />
      <FeedClient feeds={feeds} />
    </div>
  );
}
