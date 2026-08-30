# 内容编辑器实施备忘录

> 用途：跨对话保存实施状态。每次完成一个可验证步骤后更新本文。

## 当前状态

- 当前阶段：首版实施完成
- 已完成步骤：1 · 实施前基线；2 · 内容契约与兼容测试；3 · 创建独立编辑器应用；4 · 本地仓库读取层；5 · 写回与 Git 安全层；6 · 网站侧 Schema 与草稿过滤；7 · 同款完整闭环；8 · 行程完整闭环；9 · 动态完整闭环；10 · 基础标签管理；11 · 联调、回归和验收
- 当前步骤：首版验收完成；一键启动与本地预览完成
- 状态：完成
- 最后更新：2026-08-30

## 已确认决定

- 编辑器是完全独立的本机 Next.js 应用。
- 编辑器直接读取 `CONTENT_REPO_PATH` 指向的网站本地仓库。
- 编辑器默认只绑定 `127.0.0.1`，不部署到 Vercel。
- 发布方式是本地写入 → Velite/build 校验 → Git commit → Git push → Vercel 部署。
- 同款、行程、动态三类内容都属于首版必需能力。
- 动态和行程使用 `description` 作为前台展示正文；同款保留 MDX body。
- 成员值保持 `A/B/both`，不迁移为 `bai/zhu`。
- 历史内容兼容处理，新内容使用稳定 ID 和固定 slug。
- 首版只做草稿和立即发布，定时发布后置。
- 首版标签只做候选读取、去重、新增和基础列表。
- MDX frontmatter 使用 YAML 1.2 解析，日期必须保持字符串；独立编辑器推荐使用 `yaml` 包的 Document API。

## 当前项目基线

- 网站目录：`D:/projects/cp-site`
- 内容目录：`content/same-styles/`、`content/schedules/`、`content/feeds/`
- 同款图片目录：`public/static/same-styles/`
- Velite 配置：`velite.config.ts`
- 前台 Velite 出口：`src/lib/velite.ts`
- Git 分支：`master`，上游为 `origin/master`
- 基线提交：`be2c14acc10450976adb6e30f5600e7f4dca6483`
- GitHub 远端：`https://github.com/Euuqs/BLTY.git`
- Vercel 项目：`cp-site`；GitHub 默认分支为 `master`。Vercel Production Branch 无法从本地项目文件确认，首次实际推送前需在 Vercel 项目设置中复核
- 当前内容数量：同款 6、行程 38、动态 99、同款图片目录文件 7
- `npm run build` 已通过；Velite、TypeScript 和静态生成正常
- 响应式截图保存在 `docs/baselines/2026-08-30/`
- 独立编辑器项目已创建在 `D:/projects/cp-site-editor`

### 基线时已有修改（必须保护）

已修改文件：

```text
docs/ui-enhancement-plan.md
eslint.config.mjs
src/app/feed/page.tsx
src/app/globals.css
src/app/layout.tsx
src/app/not-found.tsx
src/app/page.tsx
src/app/schedule/page.tsx
src/app/tour/page.tsx
src/components/bento/StatsCharts.tsx
src/components/bento/TagCloud.tsx
src/components/feed/FeedClient.tsx
src/components/home/HomeHero.tsx
src/components/layout/FooterMascots.tsx
src/components/layout/Navigation.tsx
src/components/same-styles/SameStylesClient.tsx
src/components/schedule/ScheduleClient.tsx
src/components/tour/TourClient.tsx
src/components/tour/TourNotice.tsx
src/components/ui/BackToTop.tsx
src/components/ui/BirthdayCountdown.tsx
src/components/ui/CategoryBar.tsx
src/components/ui/EasterEggs.tsx
src/components/ui/EmptyState.tsx
src/components/ui/MonthFilter.tsx
src/components/ui/PageTransition.tsx
src/components/ui/Reveal.tsx
src/components/ui/SearchPalette.tsx
src/components/ui/SoundToggle.tsx
src/components/ui/ThemeToggle.tsx
src/lib/useNow.ts
```

已有未跟踪范围：

```text
.agents/
public/favicon.svg
public/static/hero/
public/static/mascots/
src/app/manifest.ts
src/components/ui/KeyboardHints.tsx
src/components/ui/MetaIcon.tsx
src/components/ui/ReadingIndicator.tsx
src/components/ui/SectionIndicator.tsx
docs/content-editor-plan.md
docs/content-editor-implementation.md
docs/content-editor-progress.md
docs/baselines/2026-08-30/
```

## 已完成

- [x] 初始内容编辑器产品计划。
- [x] 根据现有 Velite Schema 调整字段和兼容策略。
- [x] 确认独立应用、本地仓库读取和三类内容首版范围。
- [x] 创建详细实施计划。
- [x] 创建本备忘录。

## 待完成

- [x] 记录网站当前构建、截图和 Git 工作区基线。
- [x] 确定独立编辑器项目目录和启动方式。
- [x] 定义内容契约与兼容测试样本。
- [x] 创建独立编辑器应用空壳。
- [x] 实现本地仓库只读层、三类列表和详情读取。
- [x] 实现本地仓库读取、写回和 Git 安全层。
- [x] 完成网站 Schema 与草稿过滤。
- [x] 完成同款完整闭环。
- [x] 完成行程完整闭环。
- [x] 完成动态完整闭环。
- [x] 完成基础标签管理。
- [x] 完成联调、回归和验收。

## 阻塞与风险

- 独立编辑器若要从手机或其他电脑访问，就不能继续读取本地仓库，需要另行设计远程模式。
- Vercel Production Branch 未记录在本地配置中；当前预期为 `master`，首次实际推送前需要复核。
- 历史内容仍可能没有 `status`、`id` 和时间戳；兼容 Schema 会默认发布，并在首次编辑保存时补齐稳定字段。
- 当前有一个 slug 在行程和动态间重复；契约允许跨集合重复，但禁止集合内重复。
- 工作区当前存在未提交修改，不能使用 reset、checkout 或覆盖式迁移。
- 本轮只推送到本地模拟远端，没有向真实 GitHub 写入测试内容，也没有触发真实 Vercel 部署。
- 首次正式发布前仍需在 Vercel 项目设置中确认 Production Branch 为 `master`。
- `D:/projects/cp-site-editor` 当前不是独立 Git 仓库，建议在后续正式维护前建立单独版本管理。
- 桌面快捷方式记录了 `D:/projects/cp-site-editor` 的绝对路径；如果移动编辑器目录，需要重新创建快捷方式。

## 每次对话结束时更新

```text
当前阶段：
本次完成：
涉及文件：
验证结果：
未完成/阻塞：
关键决定：
下一步：
```

## 最近变更记录

### 2026-08-27

- 完成独立编辑器产品计划和详细实施计划。
- 确定同款、行程、动态全部纳入首版。
- 确定编辑器读取本地仓库，不读取线上 Velite 产物。

### 2026-08-30

- 完成实施前基线：确认 `master`、`origin/master`、GitHub 远端和 Vercel 项目。
- 记录工作区已有修改和保护边界。
- `npm run build` 通过，当前网站可作为后续回归基线。
- 保存首页、同款、行程和动态的桌面/移动截图，共 8 张。
- 确定独立编辑器目录为 `D:/projects/cp-site-editor`，默认本机运行。
- 下一步：定义三类内容契约、兼容字段和 MDX 读写测试样本。

### 2026-08-30 · 内容契约

- 完成 143 个现有 MDX 的字段盘点和契约验证：同款 6、行程 38、动态 99 全部通过。
- 确认 10 条旧行程无 `time`，读取时推导为 `tbd`；28 条具体时间均符合 `HH:mm`。
- 确认 2 条旧行程无地点，`location` 必须继续可选。
- 确认同款目前全部无价格字段，价格继续使用兼容字符串并在编辑后规范化。
- 确认所有同款图片引用存在，99 条动态链接均为合法绝对 URL。
- 新增 `docs/content-editor-contracts.md`，固定 TypeScript 契约、验证规则、body 同步和写回不变量。
- 新增 `docs/content-editor-fixtures/`，包含 8 个 MDX 样本及预期结果。
- YAML 语法和业务契约样本校验通过；非法样本能被业务规则拒绝。
- 下一步：在 `D:/projects/cp-site-editor` 创建独立 Next.js 应用空壳和仓库连接检查页。

### 2026-08-30 · 独立编辑器应用

- 在 `D:/projects/cp-site-editor` 创建独立 Next.js 16 + React 19 + TypeScript 应用，与网站前台目录完全分离。
- 默认只绑定 `127.0.0.1:3001`，通过 `.env.local` 将 `CONTENT_REPO_PATH` 指向 `D:/projects/cp-site`。
- 完成深色本机工作台布局、键盘焦点、低动效和响应式导航。
- 建立 `/`、`/same-styles`、`/schedule`、`/feed`、`/tags` 五个入口；功能页当前为后续阶段占位页。
- 仓库连接页可读取网站路径、当前/预期分支、工作区变化、必需目录和三类 MDX 数量。
- 实测连接正常：分支 `master`；同款 6、行程 38、动态 99；五个必需目录全部存在。
- `npm run lint`、`npx tsc --noEmit`、`npm run build` 全部通过；构建包含 6 条有效路由。
- 完成 1440px 桌面与 390px 手机布局复核；修复卡片头在窄屏下引起的横向溢出，最终 `scrollWidth` 与视口宽度均为 390px。
- 下一步：实现第 4 步本地仓库读取层，解析现有 MDX 并建立三类统一列表与详情读取接口。

### 2026-08-30 · 本地仓库读取层

- 新增服务端 MDX 读取模块，直接扫描 `content/same-styles/`、`content/schedules/`、`content/feeds/`，不读取 `.velite`。
- 使用 `yaml` 的 YAML 1.2 Document API 解析 frontmatter，日期保持字符串；每个文件独立解析，单个坏文件不会阻断整个集合。
- 读取时保留完整原始文本、原始正文和未知 frontmatter，列表结果不包含原始文件文本。
- 历史内容生成 `legacy:<collection>:<relativePath>` 兼容 ID；缺少固定 slug 时沿用网站当前标题日期算法；缺少状态时视为已发布。
- 旧行程有 `time` 时推导为具体时间，无 `time` 时推导为待定；动态来源平台按规范化 hostname 建议。
- 同款、行程、动态页面已替换为真实数据列表，支持关键词、人物、分类/类型、状态、标签筛选，支持日期/标题排序和每页 20 条分页。
- 详情通过 URL 查询参数深链接，显示已知字段、兼容 slug、文件路径、标签和正文；手机端点击列表后直接定位到详情。
- 实测读取同款 6、行程 38、动态 99，解析错误 0；搜索“生日会”返回 7 条动态，人物 A + 日常返回 35 条动态。
- `npm run lint`、`npx tsc --noEmit`、`npm run build` 通过；同款、行程、动态均为动态服务端路由。
- 完成 1440px 和 390px 列表/详情检查；390px 下 `scrollWidth` 等于视口宽度，筛选控件字号为 16px。
- 下一步：实现第 5 步安全写回与 Git 层，先完成无改动 round-trip、未知字段保留、工作区保护和构建校验，再接入表单。

### 2026-08-30 · 写回与 Git 安全层

- 新增 YAML Document 保真写回模块，只允许修改各集合的托管字段，保留未知 frontmatter、字段顺序/注释能力和独立 MDX body。
- 历史内容首次保存时补写 UUID、固定 slug、状态和上海时区时间戳，不强制重命名旧文件；新内容使用 UUID 文件名并处理集合内 slug 冲突。
- 标签写入执行 trim、去空和完全重复项去重；行程全天/待定模式自动删除 `time`；动态草稿非法 URL 给出警告，发布时拒绝。
- 覆盖和删除已有文件必须携带读取时 SHA-256，文件变化后拒绝静默覆盖；写入路径仅允许三类 MDX 与同款图片目录，拒绝绝对路径和 `..` 越界。
- 图片与 MDX 使用同一文件事务；事务备份和清单位于 `.git/cp-site-editor/transactions/`，校验失败自动恢复所有文件，崩溃恢复不会回滚已有 operation commit。
- 发布前要求目标分支正确、无冲突、工作区完全干净；当前网站仓库实测被 `DirtyWorktreeError` 正确阻断，未发生写入。
- 写入后先执行网站构建校验，再精确暂存目标路径并创建至多一个 commit；commit footer 记录 operation ID，重复点击返回已有 commit。
- push 固定使用普通 `git push`，不提供 force 参数；推送前 fetch 并在远端领先时停止；推送失败保留本地 commit 供人工处理。
- 新增 `npm run test:write`，在系统临时目录创建隔离 Git 仓库；10 项测试全部通过，覆盖 no-op round-trip、未知字段/正文保留、图片校验、失败回滚、图片+MDX 单 commit、重复操作、崩溃恢复和脏工作区保护。
- 当前内容界面仍保持只读，安全写回管线将在同款、行程、动态表单阶段接入，避免在 Schema 与草稿过滤完成前产生前台不兼容内容。
- 下一步：实施第 6 步网站兼容 Schema 与统一草稿过滤，确保新增 `id/status/slug/updatedAt/publishedAt/timeMode` 后历史前台结果不变、草稿不泄漏。

### 2026-08-30 · 网站侧 Schema 与草稿过滤

- `velite.config.ts` 的三类内容均兼容 `id`、固定 `slug`、`status`、`updatedAt` 和 `publishedAt`；行程额外兼容 `timeMode`。
- 历史内容缺少 `status` 时在 Schema transform 中补为 `published`；缺少固定 `slug` 时继续沿用原有标题日期算法。
- 历史行程缺少 `timeMode` 时按现有 `time` 推导：有具体时间为 `specific`，没有时间为 `tbd`，不自动推导为全天。
- 时间戳字段接受带时区偏移的 ISO 8601；`status` 只接受 `draft/published`，`timeMode` 只接受 `specific/all-day/tbd`。
- `src/lib/velite.ts` 新增原始全集 `allSameStyles/allSchedules/allFeeds` 和统一发布集合 `publishedSameStyles/publishedSchedules/publishedFeeds`。
- 发布过滤采用“明确为 `draft` 才排除”，确保尚未刷新 Velite 缓存或历史产物缺少 `status` 时仍按已发布处理；旧集合名继续指向发布集合，提供额外防漏保护。
- 首页、同款、行程、动态、搜索接口、统计图、标签云和 sitemap 已全部显式改用发布集合。
- TypeScript 检查和相关文件 ESLint 全部通过；兼容 transform、固定 slug、历史状态和行程时间模式共 5 项隔离检查通过。
- 在隔离副本加入 1 条唯一草稿后，Velite 原始数量为同款 6、行程 38、动态 100，发布数量保持 6、38、99；草稿未进入发布集合。
- 隔离 Next.js 生产构建通过；首页、三个列表页、搜索接口和 sitemap 均确认不包含临时草稿。临时验证目录与草稿在验收后删除，真实内容目录未加入测试文件。
- 网站仓库已有大量用户修改，因此未在真实目录直接运行会清理 `.velite/public/static` 的 Velite 构建；最终验证在完整隔离副本完成，避免覆盖现有产物。
- 下一步：实施第 7 步同款完整闭环，完成列表操作、新建编辑删除、图片处理和安全发布流程接入。

### 2026-08-30 · 同款完整闭环

- 同款列表新增明确的“新建同款”和逐条“编辑”入口，支持日期、标题与价格升降序排序；未填写价格的内容始终排在有价格内容之后。
- 新增 `/same-styles/new` 与 `/same-styles/[id]`，历史兼容 ID 使用 Base64 URL 安全编码，避免旧文件路径中的斜杠破坏动态路由。
- 新建和编辑表单覆盖标题、日期、人物、分类、品牌、价格、标签、图片与 MDX 正文；已有标签可以一键加入，服务端仍执行最终字段校验。
- 同款图片支持 JPG、PNG、WebP，限制 8 MB 和 6000 × 6000；服务端同时校验 MIME 与真实文件签名，拒绝扩展名伪装或损坏文件。
- 新图片统一使用内容 UUID 命名并写入 `public/static/same-styles/`；编辑旧内容时不上传新图会保留原 `/static/same-styles/` 路径，替换图片也不会自动删除旧文件。
- 新增只读图片代理 `/api/content-image`，经过允许路径、真实路径边界和内容类型检查后为独立编辑器提供旧图片预览。
- 保存草稿、立即发布和删除都接入同一安全写回管线：准备文件 → 网站构建校验 → 单个 Git commit → 普通 push；重复操作继续使用 operation ID 防重。
- 删除必须经过浏览器确认，只删除内容 MDX，不自动删除旧图片；发布和删除失败时表单显示停止阶段、原因和恢复提示。
- 表单提供关联标签、字段内错误、失败摘要焦点、禁用状态、四阶段进度区和手机端 16px 输入；按钮触控高度至少 44px。
- 同款草稿也要求基础正文，因为 Velite 的 MDX Schema 不接受空内容；草稿仍可不上传图片，发布时必须有有效图片。
- TypeScript 与 ESLint 通过；写回回归测试由 10 项增至 13 项，全部通过，新增图片格式/尺寸、草稿正文和已有正文修改覆盖。
- 独立 Webpack 生产构建通过，包含同款新建、编辑和图片接口路由；Turbopack 隔离构建仅因验证副本使用跨目录依赖链接而拒绝，真实开发页面热更新正常。
- 浏览器实测同款列表、新建表单、历史内容编辑、旧图片 690 × 1227 预览和 390px 手机布局；手机无横向溢出，控制台无错误。
- 未在真实网站仓库提交测试内容：仓库仍有用户未提交修改，实际写入会被安全层主动阻断；本阶段通过隔离 Git 测试验证 commit、回滚和防重行为。
- 下一步：实施第 8 步行程完整闭环，增加日期范围、三种时间模式、编辑删除和草稿/发布流程。

### 2026-08-30 · 行程完整闭环

- 行程列表新增“新建行程”和逐条编辑入口；筛选覆盖关键词、人物、类型、草稿/发布状态、开始日期和结束日期，行程页不再显示无意义的标签筛选。
- 日期范围筛选保留在分页和详情链接中；浏览器实测 `2026-08-20` 至 `2026-08-22` 精确返回 2 条内容。
- 新增读取时日期状态：按上海当前日期计算“今天 / 即将到来 / 已结束”，仅加入编辑器列表数据，不写入 MDX frontmatter；修改日期后重新读取会自动更新。
- 新增 `/schedule/new` 与 `/schedule/[id]`，历史兼容 ID 继续使用 Base64 URL 安全编码；编辑页可读取旧文件并从历史 `time` 自动推导具体时间模式。
- 行程表单覆盖标题、日期、人物、类型、地点、前台活动说明和三种时间模式；选择具体时间时显示 24 小时制输入，选择全天或待定时隐藏并删除旧 `time`。
- `description` 作为前台活动说明；新内容自动生成简单 MDX body，历史正文与旧 description 相同的简单内容会随说明同步，复杂历史正文继续保留。
- 保存草稿、立即发布和删除确认均接入准备写入、网站构建校验、单次 commit 和普通 push 四阶段流程；脏工作区、冲突或远端领先时继续安全停止。
- 网站行程组件新增统一时间标签：具体时间显示 `HH:mm`，全天显示“全天”，待定显示“待定”；历史内容由 Velite 的兼容 `timeMode` 推导继续正常显示。
- 写回回归测试由 13 项增至 16 项，全部通过；新增三种时间模式序列化、上海日期状态和 description/body 简单同步覆盖。
- 独立编辑器与网站 TypeScript 检查通过，独立编辑器完整 ESLint、网站行程组件 ESLint 和隔离 Webpack 生产构建通过；构建包含行程列表、新建和编辑动态路由。
- 浏览器完成桌面列表、日期范围、历史编辑、新建表单和 390px 手机布局检查；390px 下 `scrollWidth` 等于页面可视宽度，全天模式不保留具体时间输入，控制台无警告或错误。
- 未向真实内容目录提交测试行程：网站仓库仍有用户未提交修改，实际写入会被安全层主动阻断；网站前台本轮使用类型检查和组件逻辑验证，未启动会重建 Velite 产物的真实开发服务。
- 下一步：实施第 9 步动态完整闭环，补齐来源平台筛选与识别、新建编辑删除、标签候选和草稿/发布流程。

### 2026-08-30 · 动态完整闭环

- 动态列表新增“新建动态”和逐条编辑入口；筛选覆盖关键词、人物、类型、标签、来源平台和草稿/发布状态，筛选条件会保留在分页和详情链接中。
- 来源平台按规范化 hostname 自动识别微博、抖音、B站、小红书、新浪和 SNH48 票务；未知域名、短链接或非法 URL 返回“未知平台”，不会抛出解析错误。
- 当前 99 条动态自动识别为微博 51 条、抖音 36 条、新浪 8 条、B站 3 条和 SNH48 票务 1 条；浏览器实测抖音筛选精确返回 36 条。
- 新增 `/feed/new` 与 `/feed/[id]`，历史兼容 ID 继续使用 Base64 URL 安全编码；编辑页会读取现有标题、日期、人物、类型、说明、链接和标签。
- 动态表单覆盖时间线正文、来源链接、平台覆盖和标签；链接输入时即时显示自动识别结果，手工填写平台名称后优先使用覆盖值，清空覆盖后恢复自动识别。
- `description` 继续作为前台时间线正文，限制 500 个字符；写回层统一删除零宽字符、Bidi 控制符和不可见控制字符，新内容自动生成简单 MDX body，简单历史正文会随说明同步。
- 草稿允许暂存非法或未完成链接，发布时服务端要求 HTTP(S) 绝对 URL；未知合法域名可以发布并显示为未知平台，也可以手动指定平台名称。
- 标签候选合并同款与动态并去重，当前同款 14 个、动态 48 个、合并后 62 个；浏览器实测可在动态表单加入仅存在于同款的“包包”标签。
- 保存草稿、立即发布和删除确认均接入准备写入、网站构建校验、单次 commit 和普通 push 四阶段流程；脏工作区、冲突或远端领先时继续安全停止。
- 写回回归测试由 16 项增至 18 项，全部通过；新增精确 hostname 平台识别、未知/非法 URL 容错、不可见字符清理和手动平台写入覆盖。
- 独立编辑器 TypeScript、完整 ESLint 和隔离 Webpack 生产构建通过；构建包含动态列表、新建和编辑动态路由。
- 浏览器完成桌面列表、平台筛选、新建表单、历史编辑、自动/手动平台切换、跨集合标签候选和 390px 手机布局检查；手机无横向溢出，控制台无警告或错误。
- 未向真实内容目录提交测试动态：网站仓库仍有用户未提交修改，实际写入会被安全层主动阻断；网站现有时间线继续读取 `description`，无需额外前台字段迁移。
- 下一步：实施第 10 步基础标签管理，完成合并去重、使用次数、使用位置查看和表单候选一致性。

### 2026-08-30 · 基础标签管理

- 标签页已从占位页升级为真实管理页，直接聚合同款和动态列表数据；当前同款标签 14 个、动态标签 48 个、合并去重 62 个，两边暂无同名标签。
- 使用次数按“每条内容最多计一次”统计，同一内容里的重复标签会先 trim、去空和去重；统计同时保留同款次数、动态次数及所有使用位置。
- 页面支持标签名称搜索、全部/同款/动态范围筛选，以及使用次数和名称排序；筛选结果和选中标签均保留在 URL 中，可直接深链接。
- 标签详情列出内容类型、日期、标题和文件路径，并提供“编辑内容”入口，分别跳转到对应同款或动态编辑页。
- 标签页继续保持只读安全边界，不提供批量改名、合并或删除；同款和动态表单继续共用 `readSharedTagSuggestions()`。
- 新增 4 项标签聚合测试，覆盖跨集合合并、单条内容去重、分类计数、搜索/范围/排序；完整回归测试由 18 项增至 22 项并全部通过。
- 独立编辑器 TypeScript、完整 ESLint 和隔离 Webpack 生产构建通过；构建包含动态服务端标签路由。
- 浏览器实测 62 个标签统计、“包”+同款筛选、名称排序、“包包”两处使用位置和编辑跳转；390px 下输入字号 16px、控件高度 44px且无横向溢出。
- 临时构建副本已在验证后删除；未向网站真实内容目录写入任何测试内容。
- 下一步：实施第 11 步联调、回归和最终验收，覆盖三类内容与标签页的完整导航、写入安全提示、响应式和备忘录交付。

### 2026-08-30 · 联调、回归和最终验收

- 在完全隔离的网站副本、编辑器副本和本地裸 Git 远端中完成三类内容闭环，不触碰真实网站工作区。
- 同款、行程、动态均完成新建草稿、发布、编辑和删除；每次操作只生成一个内容 commit，并成功普通推送到本地模拟远端。
- 草稿未进入首页、对应内容页、搜索接口和 sitemap；发布后三类内容均出现在对应前台页面，搜索接口可以找到。
- 同款图片上传返回有效 `image/jpeg`，详情弹窗正常打开；删除内容后 MDX 消失，旧图片按设计继续保留。
- 构建失败场景真实触发了失败阶段提示和文件回滚，没有遗留 commit 或脏文件。
- 联调发现开发模式编辑器会把 `NODE_ENV=development` 传给网站生产构建；发布器已改为对子进程显式设置 `NODE_ENV=production`。
- 编辑器在 375px、390px、768px、1440px 和 844×390 横屏下完成主要列表与三类表单回归，无横向溢出，浏览器控制台无警告或错误。
- 修正三类表单“返回列表”链接触控高度，由 36px 提升到 44px；手机端复测通过。
- `npx tsc --noEmit --incremental false`、`npm run lint`、22 项 `npm run test:write` 和隔离 Webpack 生产构建全部通过。
- README 已从旧的“只读模式”说明更新为当前新建、编辑、删除、图片、标签和安全发布能力。
- 三个隔离验收目录、模拟远端和临时服务均已清理；真实网站 Git 状态与验收前一致，没有新增测试内容。
- 首版实施完成。首次正式使用前只需确认真实 GitHub 凭据可用，并在 Vercel 中复核 Production Branch 为 `master`。

### 2026-08-30 · 一键启动与本地预览

- 新增 `D:/projects/cp-site-editor/启动内容编辑器.cmd` 和 `scripts/launch-editor.ps1`：双击后检测 `127.0.0.1:3001`，未运行时隐藏启动编辑器，等待就绪后自动打开浏览器。
- 在桌面创建“柏里挑怡内容编辑器”快捷方式，直接调用同一启动器；重复打开会复用现有编辑器服务，不会再启动一份。
- 编辑器顶部新增“预览本地网站”按钮和状态提示，所有编辑页面都可以随时使用。
- 新增 `/api/site-preview`：固定使用 `127.0.0.1` 和 `LOCAL_SITE_PORT`，校验网站仓库、`dev` 命令、Next.js 依赖、端口占用和页面身份。
- 预览接口只接受回环主机，并拒绝其他网页的跨站 Origin；实测本机请求成功、外部 Origin 返回 HTTP 403。
- 本地网站未运行时，按钮会从 `CONTENT_REPO_PATH` 后台启动 `npm run dev`；网站已经运行时直接复用并打开新窗口。
- 桌面启动器会检查页面包含编辑器身份标记，避免把占用 `3001` 的其他服务误认为编辑器。
- 浏览器真实验证首次点击自动启动 `http://127.0.0.1:3000`，页面标题为“柏里挑怡 · 心动穿越千里”；第二次点击复用现有服务。
- 按钮具备启动中禁用状态、成功提示和可恢复错误提示，触控高度保持 44px，浏览器控制台无警告或错误。
- `npx tsc --noEmit --incremental false`、`npm run lint`、22 项写回回归和 Webpack 生产构建全部通过；构建包含新的 `/api/site-preview` 动态路由。
