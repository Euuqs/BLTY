---
name: "update-schedule"
description: "Add or update 行程 (schedule) entries for 柏里挑怡 CP site. Invoke when user says '添加行程', '更新行程', '新增日程', '活动安排', or mentions upcoming events, shows, lives."
---

# 更新行程 · Schedule

为「柏里挑怡」应援站添加或更新行程条目（综艺、直播、演出、活动等）。

## 触发场景

当用户提到以下内容时使用此 Skill：
- "添加行程"、"新增行程"、"更新日程"
- "有个直播"、"综艺录制"、"生日会"、"签售会"、"演出安排"
- 询问近期行程安排

## 项目路径

- 内容目录：`D:\projects\cp-site\content\schedules\`
- Schema 定义：`D:\projects\cp-site\velite.config.ts` 中的 `schedules` collection
- 展示页面：`D:\projects\cp-site\src\app\schedule\page.tsx`（按月份自动分组）

## MDX Frontmatter 字段规范

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | string (max 99) | ✅ | 行程名称 | "柏里挑怡合体直播"、"柏欣妤生日会" |
| `date` | ISO date (YYYY-MM-DD) | ✅ | 行程日期 | "2026-08-12" |
| `time` | string | ❌ | 具体时间 | "20:00"、"19:30" |
| `member` | enum | ✅ | 参与成员 | `A`=柏欣妤，`B`=朱怡欣，`both`=双人 |
| `type` | enum | ❌ | 行程类型 | `综艺`、`直播`、`演出`、`活动`、`其他` |
| `location` | string | ❌ | 地点/城市 | "长沙"、"上海"、"北京" |
| `description` | string | ❌ | 简短描述 | "两人合体直播，互动糖点满满" |

## Body 内容

frontmatter 下方可写更详细的备注信息（注意事项、观看渠道等），支持 GFM。

## 操作步骤

1. **确认信息**：如缺日期/成员/类型，先询问
2. **创建 MDX 文件**：在 `content/schedules/` 下新建 `.mdx` 文件，文件名用简短拼音/英文（如 `bairi-shenghui.mdx`）
3. **填写 frontmatter**：严格按字段规范
4. **验证构建**：删除 `.next` 缓存，运行 `npm.cmd run build`
5. **启动预览**（可选）：`npm.cmd run dev`，查看 http://localhost:3000/schedule

## 批量上传（一次添加多条行程）

当用户一次性提供多条行程时，可批量创建：

1. **解析条目**：从聊天中拆分为多条，每条包含 `title`/`date`/`member`（/`time`/`type`/`location`/`description`）；缺失字段集中询问一次
2. **逐条创建文件**：在 `content/schedules/` 下为每条新建 `.mdx` 文件
3. **命名防冲突**：同日多条时，文件名加序号或时间后缀（如 `live-0812-01.mdx`、`live-0812-02.mdx`）
4. **检查去重**：核对已有文件（如 `aug-fansign.mdx`），避免重复添加
5. **统一验证**：全部写完后，删除 `.next` 缓存，运行 `npm.cmd run build` 一次即可
6. **预览**：`npm.cmd run dev` 查看 http://localhost:3000/schedule

### 推荐输入格式（结构化字段块）

每条一个字段块，条目间用空行分隔，最稳且解析无歧义：

```text
标题：柏里挑怡合体直播
日期：2026-08-12
时间：20:00
成员：both
类型：直播
地点：线上
描述：两人合体直播，互动糖点满满

标题：柏欣妤生日会
日期：2026-08-12
成员：A
类型：活动
地点：上海
```

- 每条必须：`标题`/`日期`/`成员`
- 可选：`时间`/`类型`/`地点`/`描述`
- 用户若直接粘贴自然语言，也可按相同字段解析补全

批量注意：每条仍是独立 `.mdx` 文件（一行程一文件），页面自动按月份分组、按日期排序，无需手动归类。

## 行程类型枚举

- `综艺` — 综艺录制、综艺播出
- `直播` — 线上直播、带货直播
- `演出` — 公演、演唱会、舞台
- `活动` — 签售会、生日会、线下活动、发布会
- `其他` — 不属于以上类型

## 成员速查

| 值 | 成员 | 色点 class |
|----|------|-----------|
| `A` | 柏欣妤 | dot-bai（白色） |
| `B` | 朱怡欣 | dot-zhu（蓝色） |
| `both` | 双人 | dot-cp（紫色） |

## 文件示例

```mdx
---
title: "柏欣妤生日会"
date: 2026-08-12
time: "19:30"
member: A
type: 活动
location: "上海"
description: "柏欣妤生日粉丝见面会"
---

柏欣妤生日会，期待朱怡欣到场应援。
```

## 注意事项

- `date` 是行程日期（不是添加日期），务必准确
- `member` 必须是 `A`/`B`/`both`
- `type` 严格使用枚举值
- 页面会自动按月份分组、按日期排序，新行程会自动归入对应月份
- 写完务必构建验证