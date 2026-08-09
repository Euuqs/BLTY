# 柏里挑怡 · 界面美化丰富方案

> 目标：在现有「深空紫 + 玻璃拟态 + 萌宠」设计语言基础上，提升首屏冲击力、增强交互反馈、丰富内容页信息密度，同时保持统一的设计系统。
>
> 状态：`v2 已确认 · 实施中`

---

## 已确认决定（2026-08-09）

| 项 | 决定 |
|----|------|
| 倒计时 | 三个日子：柏欣妤生日 **1/25** · 朱怡欣生日 **4/22** · 粉丝生日 **2/27** |
| 品牌筛选 | ❌ 不做，改为**价格排序**（最新/价格升/价格降） |
| 类型图标 | ✅ 全部用**自绘 SVG**（不用 emoji） |
| 月历视图 | ✅ 需要（列表 ⇄ 月历 切换） |
| 收藏功能 | ❌ 不开启 |
| 红玫瑰元素 | ✅ 适当添加（配色新增「玫瑰红」） |

---

## 设计原则（确认约束）

1. **延续三色体系**：柏欣妤=白、朱怡欣=蓝、CP=紫，不引入新色相，只强化使用场景。
2. **动效克制**：所有动画尊重 `prefers-reduced-motion`（现有 globals.css 已处理，新动画需同样处理）。
3. **性能优先**：装饰动画全部走 CSS + 现有 `motion` 库，不新增依赖、不引入重型 canvas/particles。
4. **Server/Client 边界**：尽量保持服务端渲染；需要交互（hover、滚动、倒计时）的才标记 `"use client"`。

---

## 一、视觉氛围升级（低成本 · 高回报）

| # | 改动 | 位置 | 说明 |
|---|------|------|------|
| 1.1 | **Hero 入场动画** | `src/app/page.tsx` | 用 `motion` 做 staged 入场：标题渐显 → 徽章依次弹入 → 萌宠滚动浮现。首屏 1.2s 内完成，不遮挡内容。 |
| 1.2 | **纪念日倒计时** | `src/app/page.tsx` + 新组件 `components/ui/Countdown.tsx` | Hero 或 Motto 卡内加「已相恋 N 天」实时计数。从固定纪念日算起，用 `useEffect` 计算、客户端渲染。 |
| 1.3 | **Hero 水印字样** | `src/app/page.tsx` | Hero 叠加半透明大号「柏里挑怡」衬线字作背景装饰，提升层次感。 |
| 1.4 | **Hover 光晕扫过** | `globals.css` + 同款卡片 | 图片卡 hover 时加一道 135° 的白色流光（`::after` + 位移动画），常见于电商卡片，廉价但有质感。 |
| 1.5 | **Scroll 揭示动画** | `src/app/page.tsx` 各 section | `motion` `whileInView`：section 淡入 + 轻微上移（`opacity 0→1, y 24→0`），错峰 0.08s 级联。 |
| 1.6 | **导航下划线动画** | `src/components/layout/Navigation.tsx` | 当前项与 hover 项加渐变下划线（`bg-gradient` 白→紫→蓝），`width 0→100%` 过渡。 |
| 1.7 | **顶部进度条** | `layout.tsx` 新增 `ScrollProgress` | 页面滚动时顶部显示 白→紫→蓝 渐变进度条（固定在 nav 上方），提升「浏览旅程感」。 |

---

## 二、内容页功能丰富（信息密度 · 实用性）

### 2.1 同款衣橱 `src/app/same-styles/page.tsx`

| 改动 | 说明 |
|------|------|
| 价格排序 | 「最新 / 价格升序 / 价格降序」切换（价格是字符串需解析）。 |
| SVG 图标 | 无图卡片的封面 fallback 用 `TypeIcon`（衣服/饰品/零食/美妆/鞋包/其他）。 |
| 空状态 | 用 `EmptyState` 萌宠插画替换纯文本。 |

### 2.2 行程日历 `src/components/schedule/ScheduleClient.tsx`

| 改动 | 说明 |
|------|------|
| 状态角标 | 按当前日期算「进行中 / 即将 / 已结束」，卡片右上角加彩色状态 pill。 |
| 倒计时 | 即将到来的行程显示「还有 N 天 / 明天 / 今天」。 |
| 视图切换 | 列表视图 ⇄ 月历 mini-grid（自绘，周一开头，事件日显示成员色圆点）。 |
| 类型 icon | `type` 字段映射自绘 SVG `TypeIcon`（综艺/直播/演出/活动/其他）。 |
| 空状态 | 用 `EmptyState` 萌宠插画替换纯文本。 |

### 2.3 动态时间线 `src/components/feed/FeedClient.tsx`

| 改动 | 说明 |
|------|------|
| 节点图标 | 时间线节点从圆点升级为带 `type` SVG 图标的彩色节点（保留成员色）。 |
| 统计行 | 顶部一行小统计：「共 N 条 · 柏 X · 朱 Y · 双人 Z」。 |
| 空状态 | 用 `EmptyState` 萌宠插画替换纯文本。 |

---

## 三、整体设计丰富

| # | 改动 | 说明 |
|---|------|------|
| 3.1 | **数据可视化** | 首页 Count 卡下加同款分类占比 mini 条状图（纯 CSS 宽度百分比，无库）。 |
| 3.2 | **PWA / 主题色** | `layout.tsx` 加 `<meta name="theme-color">`（深空紫），可选加 manifest + 图标。 |
| 3.3 | **定制 favicon** | 用萌宠双点（白+蓝圆点）或现有配色生成 SVG favicon，替换默认 favicon。 |
| 3.6 | **红玫瑰元素** | 主题新增 `--rose` 玫瑰红（粉丝专属色）；Hero 右下、Profile 分区标题、页脚点缀玫瑰 SVG。 |
| 3.4 | **空状态插画** | 各页「暂无数据」加萌宠 + 文案（如「小猪也在等新行程啦」），替换纯文本。 |
| 3.5 | **页脚增强** | 加「回顶部」浮动按钮；页脚加动态更新时间。 |

---

## 四、参考风格锚点

| 参照 | 借鉴点 |
|------|--------|
| **Linear / Framer** | 深色 Bento、hover 微交互、克制而精致的动效节奏 |
| **Space Tourism (NASA)** | 字距排版、氛围背景层次、大字衬线标题 |
| **小红书 / Pinterest** | 卡片网格、图片优先的信息布局、分类筛选体验 |
| **notion.so / vercel.com** | 玻璃拟态、渐变细节、section 分隔线的克制使用 |

---

## 五、实施节奏（分批交付）

- **Phase A · 视觉氛围**（1.1–1.7）：改动集中、风险低，最先落地，肉眼可见变化。
- **Phase B · 功能页**（2.1–2.3）：涉及新交互状态，需要 `"use client"`，逐个页面交付。
- **Phase C · 整体**（3.1–3.5）：收尾打磨，含 PWA/favicon/空状态。

> 每阶段完成后跑 `npm run lint` 校验。

---

## 六、新增文件清单（实施中）

```
src/components/home/HomeHero.tsx       # 首页 Hero（入场动画 + 水印 + 玫瑰 + 分类图）
src/components/ui/TypeIcon.tsx         # 自绘 SVG 类型图标（同款/行程/动态共用）
src/components/ui/BirthdayCountdown.tsx# 三人生日倒计时（1/25 · 4/22 · 2/27）
src/components/ui/ScrollProgress.tsx   # 顶部滚动进度条
src/components/ui/BackToTop.tsx        # 回到顶部按钮
src/components/ui/EmptyState.tsx       # 空状态萌宠插画
src/components/ui/CategoryBar.tsx      # 分类占比条状图
src/components/ui/Reveal.tsx           # 滚动揭示动画容器
docs/ui-enhancement-plan.md            # 本文档
```

> 均为纯 UI 组件，无新增依赖；改动不涉及 velite 数据结构。
