# 柏里挑怡 · 应援站

柏欣妤 × 朱怡欣（SNH48/GNZ48）的粉丝应援站，收录「同款 · 行程 · 动态」三大类内容。非官方站点。

## 技术栈

- **Next.js 16**（App Router，React 19）
- **Velite** — Markdown/MDX 内容集合，构建期生成 `.velite` 数据与静态资源
- **Tailwind CSS 4** + `motion`（动效）
- 部署于 **Vercel**

## 常用命令

```bash
npm install        # 安装依赖
npm run dev        # 本地开发（http://localhost:3000）
npm run lint       # ESLint 校验
npx tsc --noEmit   # TypeScript 类型检查
npm run build      # 生产构建（会先跑 velite）
```

## 目录结构

```
content/
  same-styles/    # 同款（衣服/饰品/零食/美妆/鞋包/其他）
  schedules/      # 行程（综艺/直播/演出/活动/其他）
  feeds/          # 动态（路透/日常/舞台/采访/其他）
src/
  app/            # 路由页面 + /api/search 搜索接口
  components/     # UI 组件（同款/行程/动态/首页/bento/通用）
  lib/            # velite 数据入口、日期/日期工具、MDX 编译、焦点陷阱
velite.config.ts  # 内容集合 schema 与 slug 规则
docs/             # 设计/功能计划文档
```

## 内容更新

内容为 Markdown（MDX）文件，运行 `npm run dev` 或 `npm run build` 时由 Velite 自动收集。

- 同款：`content/same-styles/<slug>.mdx`，frontmatter 含 `title/date/category/member/brand/price/cover/tags`
- 行程：`content/schedules/<slug>.mdx`，含 `title/date/time/member/type/location`
- 动态：`content/feeds/<slug>.mdx`，含 `title/date/member/type/description/link/tags`

日常维护可使用仓库内置的 opencode 技能（`update-feed` / `update-schedule` / `update-same-style`）以及社交平台抓取脚本（`scrape-cp-social`）。

## 工程约定

- 新动画尊重 `prefers-reduced-motion`（已统一处理于 `globals.css`）
- 装饰动效走 CSS + `motion`，不新增重型依赖
- 内容密集型数据（搜索）通过服务端 `/api/search` 提供，避免打进客户端 bundle
- MDX 正文在构建期编译为 HTML（`src/lib/mdx.ts`），客户端不执行运行时编译

## 部署

推送到 GitHub 后由 Vercel 自动部署；`/api/search` 依赖 `nodejs` runtime。

### 意见箱环境变量

意见箱（`/api/feedback`）把访客意见写入 GitHub Issues，需在 Vercel 配置：

| 变量 | 说明 |
|---|---|
| `GITHUB_FEEDBACK_TOKEN` | 必填。GitHub Personal Access Token，权限勾选 **Issues: write**，仅服务端使用，不会进入客户端 |
| `GITHUB_REPO` | 选填。意见写入的仓库，默认 `Euuqs/BLTY` |

## 待办 / 未来方向

- 为每条动态/行程生成独立 `[slug]` 详情页（当前使用 hash 锚点），提升可分享性与 SEO
- PWA manifest 与 apple-touch-icon
- 统一抽取重复的筛选/颜色映射工具函数
- 意见箱提交时自动附带的页面路径（方便定位是哪个页面提出的问题）
