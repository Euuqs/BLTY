import { defineConfig, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: {
    sameStyles: {
      name: "SameStyle",
      pattern: "same-styles/**/*.mdx",
      schema: s
        .object({
          title: s.string().max(99),
          date: s.isodate(),
          category: s.enum(["衣服", "饰品", "零食", "美妆", "鞋包", "其他"]),
          member: s.enum(["A", "B", "both"]),
          brand: s.string().optional(),
          price: s.string().optional(),
          cover: s.string().optional(),
          tags: s.array(s.string()).optional(),
          body: s.mdx(),
        })
        .transform((data) => ({ ...data, slug: data.title.toLowerCase().replace(/\s+/g, "-") })),
    },
    schedules: {
      name: "Schedule",
      pattern: "schedules/**/*.mdx",
      schema: s
        .object({
          title: s.string().max(99),
          date: s.isodate(),
          time: s.string().optional(),
          member: s.enum(["A", "B", "both"]),
          type: s.enum(["综艺", "直播", "演出", "活动", "其他"]).optional(),
          location: s.string().optional(),
          description: s.string().optional(),
          body: s.mdx(),
        })
        .transform((data) => ({ ...data, slug: data.title.toLowerCase().replace(/\s+/g, "-") })),
    },
    feeds: {
      name: "Feed",
      pattern: "feeds/**/*.mdx",
      schema: s
        .object({
          title: s.string().max(99),
          date: s.isodate(),
          member: s.enum(["A", "B", "both"]),
          type: s.enum(["路透", "日常", "舞台", "采访", "其他"]).optional(),
          description: s.string().optional(),
          tags: s.array(s.string()).optional(),
          body: s.mdx(),
        })
        .transform((data) => ({ ...data, slug: data.title.toLowerCase().replace(/\s+/g, "-") })),
    },
  },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
});