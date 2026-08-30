import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "柏里挑怡 · 心动穿越千里",
    short_name: "柏里挑怡",
    description: "柏欣妤 × 朱怡欣 同款、行程与动态应援站",
    start_url: "/",
    display: "standalone",
    background_color: "#120d20",
    theme_color: "#120d20",
    lang: "zh-CN",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
