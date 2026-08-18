import { defineConfig, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { createElement } from "react";
import { jsx } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

function slugify(title: string, date?: string) {
  const base = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u4e00-\u9fff-]/g, "");
  return date ? `${date.slice(0, 10)}-${base}` : base;
}

function mdxToHtml(code: string): string {
  try {
    const fn = new Function(code);
    const Content = fn({ jsx }).default;
    return renderToStaticMarkup(createElement(Content));
  } catch {
    return "";
  }
}

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
        .transform((data) => {
          const { body, ...rest } = data;
          return {
            ...rest,
            slug: slugify(data.title, data.date),
            html: mdxToHtml(body),
          };
        }),
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
        .transform((data) => ({
          ...data,
          slug: slugify(data.title, data.date),
        })),
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
          link: s.string().optional(),
          tags: s.array(s.string()).optional(),
          body: s.mdx(),
        })
        .transform((data) => ({ ...data, slug: slugify(data.title, data.date) })),
    },
  },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
});