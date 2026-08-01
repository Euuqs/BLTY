import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 微博图片
      { protocol: "https", hostname: "wx*.sinaimg.cn" },
      { protocol: "https", hostname: "tva*.sinaimg.cn" },
      { protocol: "https", hostname: "*.sinaimg.cn" },
      // 小红书
      { protocol: "https", hostname: "sns-avatar-xhscdn.xiaohongshu.com" },
      { protocol: "https", hostname: "*.xhscdn.com" },
      { protocol: "https", hostname: "*.xiaohongshu.com" },
      // B站
      { protocol: "https", hostname: "*.hdslb.com" },
      { protocol: "https", hostname: "*.bilibili.com" },
      // 抖音
      { protocol: "https", hostname: "*.douyinpic.com" },
      { protocol: "https", hostname: "*.byteimg.com" },
      // 微信
      { protocol: "https", hostname: "mmbiz.qpic.cn" },
      { protocol: "https", hostname: "*.qpic.cn" },
      // 通用图床
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
      { protocol: "https", hostname: "*.oss-cn-*.aliyuncs.com" },
      { protocol: "https", hostname: "*.cos.*.myqcloud.com" },
    ],
  },
};

export default nextConfig;
