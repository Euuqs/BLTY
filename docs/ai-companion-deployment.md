# AI 故事陪伴者部署配置

本文只记录可公开的配置方式。真实 API Key 只应保存在本地 `.env.local` 或部署平台的加密环境变量中，不能提交到 Git。

## 本地模式

复制 `.env.example` 为 `.env.local` 后按需调整：

- `COMPANION_PROVIDER=mock`：默认、无外部请求、无费用，适合本地 UI 与接口联调。
- `COMPANION_PROVIDER=deepseek`：调用 DeepSeek OpenAI 兼容接口，需要有效的 `DEEPSEEK_API_KEY`。
- `DEEPSEEK_BASE_URL`：可选，默认 `https://api.deepseek.com`。
- `DEEPSEEK_MODEL`：可选，默认 `deepseek-v4-flash`；部署前需确认账号可用的实际模型名。

`.env.local` 被 `.gitignore` 忽略；`.env.example` 仅包含安全默认值和空占位，可以提交。

## Vercel 或其他 Next.js 平台

部署平台必须支持：

- Next.js App Router；
- Node.js Runtime（两个 Companion API 均显式声明 `runtime = "nodejs"`）；
- `ReadableStream` SSE 响应和至少 30 秒的函数执行窗口；
- 服务端向所配置 DeepSeek API 地址发起 HTTPS 请求。

在平台项目的 Production、Preview 等目标环境中分别配置：

| 变量 | 是否必需 | 用途 |
|---|---|---|
| `COMPANION_PROVIDER` | 建议 | `mock` 或 `deepseek`；未设置时安全回退到 `mock` |
| `DEEPSEEK_API_KEY` | DeepSeek 模式必需 | 服务端鉴权，不会进入浏览器 bundle |
| `DEEPSEEK_BASE_URL` | 否 | DeepSeek 兼容 API 根地址 |
| `DEEPSEEK_MODEL` | 否 | 模型名称 |
| `COMPANION_CHAT_RATE_LIMIT` | 否 | 单实例、单客户端、每窗口聊天请求上限，默认 10 |
| `COMPANION_RECOMMENDATION_RATE_LIMIT` | 否 | 单实例、单客户端、每窗口推荐解析请求上限，默认 60 |
| `COMPANION_RATE_LIMIT_WINDOW_MS` | 否 | 限流窗口毫秒数，默认 60000 |

环境变量修改后需要重新部署才会生效。首次发布前还应在 Vercel 项目设置中确认 Production Branch；本地资料预期为 `master`，但平台实际设置必须人工核对。

## 当前保护边界

- Chat 请求体最多 64 KiB；单条消息最多 2000 字，最多携带 12 条历史，每条历史最多 4000 字。
- 服务端请求超时为 30 秒，客户端可以取消流式请求。
- Provider 错误对用户返回通用消息；服务端日志只记录 request ID、Provider、模型和错误状态，不记录聊天正文或 Key。
- Chat 与 recommendation 均返回标准 `429` 和 `Retry-After`。

当前限流使用进程内存 Map，适合本地、预览和基础防误用，但在 Serverless 多实例、冷启动或横向扩容下不是跨实例强一致，也不等同于预算控制。正式公开并承受真实流量前，应接入平台托管 KV/Redis 或网关限流，并增加每日预算、单会话额度、告警及紧急关闭开关；本项目当前没有自动连接任何外部存储。

## 内容构建

`npm run build` 会先运行 Velite。必须提交 `velite.config.ts`、`src/lib/velite.ts`、Companion 源码以及需要部署的 `content/companion/` 内容。`.velite/` 是生成目录，不提交。

当前开发故事均为 `draft`，不会进入公开故事集合。助手仍可检索已发布的同款、行程和动态。正式发布故事前需要完成内容与来源校对，再把相应内容状态改为 `published`。

## 已知状态

本地真实 DeepSeek 请求曾返回 HTTP 402，表示当前上游账号缺少可用余额或额度。代码与部署配置不能绕过该限制；额度恢复并完成真实回复验收前，不应把 DeepSeek 模式视为已上线可用。
