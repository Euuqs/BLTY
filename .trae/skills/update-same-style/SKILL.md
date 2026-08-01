---
name: "update-same-style"
description: "Add or update 同款 (same-style/fashion) entries for 柏里挑怡 CP site. Invoke when user says '添加同款', '更新同款', '新增衣服/饰品/零食/美妆', or wants to add a new same-style item."
---

# 更新同款 · Same Style

为「柏里挑怡」应援站添加或更新同款条目（衣服、饰品、零食、美妆、鞋包等）。

## 触发场景

当用户提到以下内容时使用此 Skill：
- "添加同款"、"新增同款"、"更新同款"
- 具体品类："加个衣服"、"新饰品"、"同款零食"、"新包"等
- 提及品牌/价格/谁穿了什么同款
- 附带图片的同款更新

## 项目路径

- 内容目录：`D:\projects\cp-site\content\same-styles\`
- 本地图片目录：`D:\projects\cp-site\public\static\same-styles\`（放本地图片）
- Schema 定义：`D:\projects\cp-site\velite.config.ts` 中的 `sameStyles` collection
- 展示页面：`D:\projects\cp-site\src\app\same-styles\page.tsx`

## 图片上传方式（3种）

同款卡片顶部为 4:3 比例封面区。有以下三种方式添加图片：

### 方式一：本地图片（推荐，最稳定）

1. 用户提供图片文件（拖拽到聊天、或告知图片路径）
2. 将图片保存到 `D:\projects\cp-site\public\static\same-styles\` 目录下
3. 图片命名建议用拼音+序号（如 `bai-xingxianglian.jpg`），支持 jpg/png/webp/gif
4. 在 MDX frontmatter 的 `cover` 字段填写路径：`cover: "/static/same-styles/bai-xingxianglian.jpg"`
5. 构建后图片会自动显示在卡片上，hover 有放大效果

### 方式二：远程图片URL（方便快捷）

1. 如果图片已在微博/小红书/B站等平台上，可以直接使用图片URL
2. 在 MDX frontmatter 的 `cover` 字段填写完整URL，如：
   `cover: "https://wx1.sinaimg.cn/large/xxx.jpg"`
3. 已配置白名单的远程图片源：微博(sinaimg.cn)、小红书(xhscdn.com)、B站(hdslb.com)、抖音(douyinpic.com)、微信(qpic.cn)、Imgur、阿里云OSS、腾讯云COS
4. 如果遇到不在白名单的图片域名，需要将图片下载保存到本地 public/static/same-styles/ 目录（方式一）

### 方式三：无图片（渐变占位封面）

如果暂时没有图片，可以不填 `cover` 字段，页面会自动显示：
- 按品类区分颜色的渐变背景（衣服=紫色、饰品=粉紫、零食=暖橙、美妆=玫红、鞋包=蓝紫、其他=深紫）
- 品类对应 emoji 图标（👗💍🍪💄👜✨）
- 后续有图片时只需在 frontmatter 中补上 `cover` 字段即可

## MDX Frontmatter 字段规范

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | string (max 99) | ✅ | 同款名称，简洁描述 | "珍珠耳坠"、"白色宽松卫衣" |
| `date` | ISO date (YYYY-MM-DD) | ✅ | 发现/穿着日期 | "2026-08-01" |
| `category` | enum | ✅ | 品类分类 | 必须是以下之一：`衣服`、`饰品`、`零食`、`美妆`、`鞋包`、`其他` |
| `member` | enum | ✅ | 归属成员 | `A`=柏欣妤，`B`=朱怡欣，`both`=双人同款 |
| `brand` | string | ❌ | 品牌名 | "Brandy Melville"、"Swarovski" |
| `price` | string | ❌ | 价格（纯数字，不带¥） | "320"、"890" |
| `cover` | string | ❌ | 封面图片路径 | 本地：`/static/same-styles/xxx.jpg`；远程：`https://...` |
| `tags` | string[] | ❌ | 标签数组 | ["项链", "私服"] |

## Body 内容

frontmatter 下方的 Markdown 正文写同款的详细描述（穿着场景、细节、来源链接等）。支持 GFM 语法。

## 操作步骤

1. **确认信息**：如果用户提供的信息不完整（缺日期/品类/归属人），先询问缺失字段
2. **处理图片**（如果有）：
   - 本地图片：保存到 `public/static/same-styles/`，记录相对路径
   - 远程URL：直接使用，确认域名在白名单内
   - 无图片：跳过，不填 cover 字段
3. **创建 MDX 文件**：在 `content/same-styles/` 下新建 `.mdx` 文件，文件名用简短拼音/英文 kebab-case（如 `zhenzhu-erzhui.mdx`）
4. **填写 frontmatter**：严格按照上述字段规范，日期格式 YYYY-MM-DD
5. **写入正文**：在 `---` 分隔线后写 Markdown 描述
6. **验证构建**：删除 `.next` 缓存目录（`Remove-Item -Recurse -Force D:\projects\cp-site\.next`），运行构建确认无报错
7. **启动预览**（可选）：`npm.cmd run dev`（需先设置 PATH），打开 http://localhost:3000/same-styles 查看效果

## 批量上传（一次添加多条同款）

当用户一次性提供多条同款（含多张图片）时，可批量创建：

1. **解析条目**：从聊天中拆分为多条，每条包含 `title`/`date`/`category`/`member`（/`brand`/`price`/`cover`/`tags`）；缺失字段集中询问一次
2. **批量处理图片**：
   - 本地图片：全部保存到 `public/static/same-styles/`，命名加序号避免冲突（如 `zhenzhu-01.jpg`、`zhenzhu-02.jpg`）
   - 远程URL：逐条核对域名是否在白名单
   - 无图片：不填 `cover`，使用渐变占位封面
3. **逐条创建文件**：在 `content/same-styles/` 下为每条新建 `.mdx` 文件
4. **封面路径对应**：确保每条 `cover` 指向第 2 步保存的对应图片，勿串图
5. **检查去重**：核对已有文件（如 `blue-dress.mdx`），避免重复添加
6. **统一验证**：全部写完并核对图片后，删除 `.next` 缓存，运行 `npm.cmd run build` 一次即可
7. **预览**：`npm.cmd run dev` 查看 http://localhost:3000/same-styles

### 推荐输入格式（结构化字段块 + 图片）

每条一个字段块，条目间用空行分隔；图片与条目严格一一对应，推荐在每条内写 `封面`：

```text
标题：星星项链
日期：2026-08-01
品类：饰品
成员：A
品牌：APM Monaco
价格：890
封面：C:\Users\xxx\Desktop\necklace.jpg
标签：项链, 配饰

标题：白色宽松卫衣
日期：2026-08-01
品类：衣服
成员：B
封面：https://wx1.sinaimg.cn/large/xxx.jpg
```

- 每条必须：`标题`/`日期`/`品类`/`成员`
- `封面` 可给**本地图片路径**（自动复制到 `public/static/same-styles/` 并改写为 `/static/same-styles/...`）或**完整URL**（需在白名单内）；不填则用渐变占位封面
- 若用户拖入多张图但未写封面，默认**按顺序匹配**：第 1 张图 = 第 1 条，第 2 张 = 第 2 条（用户需事先说明顺序）
- 可选：`品牌`/`价格`/`标签`（多个标签用逗号分隔）
- 用户若直接粘贴自然语言，也可按相同字段解析补全

批量注意：每条仍是独立 `.mdx` 文件（一物一文件）；多张图片都要先落盘再被 frontmatter 引用，避免漏图或路径错误。

## 图片优化建议

- 推荐尺寸：宽度 800-1200px，比例 4:3 最佳（也会自动裁剪）
- 格式优先：webp > jpg > png（文件更小，加载更快）
- 单张图片建议 < 500KB
- 如果图片过大，可以先压缩再放入 public 目录

## 成员速查

| 值 | 成员 | 应援色 | 页面显示名 | 色点 class |
|----|------|--------|-----------|-----------|
| `A` | 柏欣妤 | 白/星光 | 柏欣妤 | dot-bai |
| `B` | 朱怡欣 | 蓝/心动 | 朱怡欣 | dot-zhu |
| `both` | 双人 | 紫/交融 | 双人 | dot-cp |

## 文件示例（带图片）

```mdx
---
title: "星星项链"
date: 2026-07-25
category: 饰品
member: A
brand: "APM Monaco"
price: "890"
cover: "/static/same-styles/bai-star-necklace.jpg"
tags: ["项链", "配饰"]
---

柏欣妤机场路透佩戴的星星锁骨链，银色小吊坠，非常百搭。
```

## 文件示例（远程图片URL）

```mdx
---
title: "蓝色水晶耳环"
date: 2026-07-20
category: 饰品
member: B
brand: "Swarovski"
price: "680"
cover: "https://wx1.sinaimg.cn/large/abc123.jpg"
tags: ["耳环", "舞台"]
---

朱怡欣打歌舞台佩戴的蓝色水晶垂坠耳环，与她的应援色呼应。
```

## 注意事项

- `member` 字段必须是 `A`/`B`/`both`，不要写中文名
- `category` 必须严格匹配枚举值，不能自创分类（如"包包"应写"鞋包"）
- `price` 写纯数字字符串，页面会自动加 ¥ 符号
- `cover` 路径本地图片以 `/static/` 开头，远程图片以 `https://` 开头
- 文件名使用简单的拼音/英文，避免中文文件名导致跨平台问题
- 写完文件后务必运行构建验证
