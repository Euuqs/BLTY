---
name: "update-schedule"
description: "Add or update 行程 (schedule) entries for 柏里挑怡 CP site. Invoke when user says '添加行程', '更新行程', '新增日程', '活动安排', '公演排期', '核实行程', or mentions upcoming events, shows, lives."
---

# 更新行程 · Schedule

为「柏里挑怡」应援站添加或更新行程条目（综艺、直播、演出、活动等）。**核心原则：只收录官方/权威来源核实过的行程，虚构样例一律不加入。**

## 触发场景

当用户提到以下内容时使用此 Skill：
- "添加行程"、"新增行程"、"更新日程"
- "有个直播"、"综艺录制"、"生日会"、"签售会"、"演出安排"
- "读取公演行程"、"核实行程"、"搜索行程"
- 询问近期行程安排

## 项目路径

- 内容目录：`D:\projects\cp-site\content\schedules\`
- Schema 定义：`D:\projects\cp-site\velite.config.ts` 中的 `schedules` collection
- 展示页面：`D:\projects\cp-site\src\app\schedule\page.tsx`（按月份自动分组、按日期排序）

## MDX Frontmatter 字段规范

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | string (max 99) | ✅ | 行程名称 | "TEAM NII《肆时墟》公演"、"柏欣妤生日会" |
| `date` | ISO date (YYYY-MM-DD) | ✅ | 行程日期 | "2026-07-28" |
| `time` | string | ❌ | 具体时间 | "19:30"、"20:00" |
| `member` | enum | ✅ | 参与成员 | `A`=柏欣妤，`B`=朱怡欣，`both`=双人 |
| `type` | enum | ❌ | 行程类型 | `综艺`、`直播`、`演出`、`活动`、`其他` |
| `location` | string | ❌ | 地点/城市 | "上海"、"广州"、"苏州" |
| `description` | string | ❌ | 简短描述 | "柏欣妤所在TEAM NII全新原创公演《肆时墟》，19:30开演" |

## Body 内容

frontmatter 下方可写更详细的备注信息（观看渠道、实名场次提醒等），支持 GFM。

## 成员速查

| 值 | 成员 | 团体/队伍 | 色点 class |
|----|------|----------|-----------|
| `A` | 柏欣妤 | SNH48 TEAM NII | dot-bai（白色） |
| `B` | 朱怡欣 | GNZ48 TEAM Z | dot-zhu（蓝色） |
| `both` | 双人 | — | dot-cp（紫色） |

> 记住成员所属队伍：柏欣妤=SNH48 Team NII（新公演《肆时墟》），朱怡欣=GNZ48 Team Z（新公演《Zenith·穹顶之上》）。搜公演时直接搜对应队伍排期。

## 行程类型枚举

- `综艺` — 综艺录制、综艺播出
- `直播` — 线上直播、带货直播
- `演出` — 公演、演唱会、舞台、定制演出
- `活动` — 生日会、签售会、见面会、线下活动、发布会、逆应援
- `其他` — 不属于以上类型

---

## 标准流程（本次实战验证成功）

### 第一步：联网核实信息（最重要）

在创建任何文件前，必须用 `websearch` / `webfetch` 核实行程真实性，**禁止凭空编造日期/地点/场次**。

1. **确认成员与队伍**：搜索 `柏欣妤 所属队伍`、`朱怡欣 所属队伍`，确定公演归属（A=Team NII，B=Team Z）
2. **搜官方排期**：优先搜索并抓取以下官方渠道
   - SNH48 官方票务/排期：`shop.48.cn`、`www.snh48.com/ticket.html`、`m.48.cn`
   - GNZ48 官方票务：`m.gnz48.com`、`gnz48.com`
   - 官方微博发布（SNH48、GNZ48星梦剧院、成员本人）、新浪新闻官宣稿
3. **核对关键字段**：日期、时间、地点、实名场次、开票时间，全部以官方公告为准
4. **无官方来源不加入**：搜索不到的"综艺录制""签售会""solo舞台"等，一律视为未核实，**不创建文件**

### 第二步：去重检查

创建前用 `glob` 查看 `content/schedules/**/*.mdx`，避免与已有文件重复。

### 第三步：创建 MDX 文件

在 `content/schedules/` 下新建 `.mdx` 文件：
- 文件名用简短拼音/英文 + 日期后缀（如 `nii-gongyan-0728.mdx`、`z-gongyan-0723.mdx`）
- 同日多条时文件名加序号或时间后缀
- 严格按字段规范填写 frontmatter

### 第四步：批量添加

一次提供多条时：
1. 逐条核实 → 逐条创建独立文件（一行程一文件）
2. 全部写完后再统一构建一次
3. 页面自动按月份分组、按日期排序，无需手动归类

### 第五步：构建验证（Windows 环境注意）

**本机 node/npm 不在 PATH**，必须用绝对路径调用：

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .next
& "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run build
```

- 先删 `.next` 再构建，否则 velite 缓存会导致旧数据残留
- 构建成功标志：`✓ Compiled successfully` + `Generating static pages` 完成，无 TypeScript 报错

### 第六步：重启预览服务

构建后**必须重启** localhost:3000 的服务（旧进程会因 `.next` 被删而 500）：

```powershell
$conn = Get-NetTCPConnection -State Listen -LocalPort 3000 -ErrorAction SilentlyContinue
if ($conn) { Stop-Process -Id ($conn.OwningProcess | Select-Object -Unique) -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 1 }
$env:Path = "C:\Program Files\nodejs;" + $env:Path
Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList "node_modules/next/dist/bin/next","start" -WorkingDirectory "D:\projects\cp-site" -WindowStyle Hidden
Start-Sleep -Seconds 5
Invoke-WebRequest -Uri "http://localhost:3000/schedule" -UseBasicParsing -TimeoutSec 15  # 期望 200
```

### 第七步：清理虚构样例（如需）

用户提到"删除测试样例/虚构行程"时，只删无官方来源的条目，**保留已核实条目**：
- 先 `glob` 列出全部行程文件
- 逐个 `read` 判断是否有官方来源佐证
- 无来源的删除：`Remove-Item -LiteralPath "content\schedules\xxx.mdx" -Force`
- 删除后重新构建 + 重启（同第五、六步）

---

## 批量输入解析

用户一次性给多条行程时，按结构化字段块解析：

```text
标题：TEAM NII《肆时墟》公演
日期：2026-07-28
时间：19:30
成员：A
类型：演出
地点：上海
描述：柏欣妤所在TEAM NII全新原创公演

标题：双人巡演「PRIVATE SIGNAL」杭州站
日期：2026-08-22
时间：19:00
成员：both
类型：演出
地点：杭州
```

- 每条必须：`标题`/`日期`/`成员`
- 可选：`时间`/`类型`/`地点`/`描述`
- 用户若直接粘贴自然语言，也按相同字段解析，**但创建前仍需联网核实**

## 文件示例

```mdx
---
title: "TEAM NII《肆时墟》公演"
date: 2026-07-28
time: "19:30"
member: A
type: 演出
location: "上海"
description: "柏欣妤所在TEAM NII全新原创公演《肆时墟》，非实名场次"
---

SNH48星梦剧院N队公演，7月28日 19:30 开演，支持网络直播。
```

## 注意事项

- **必须联网核实，禁止编造行程**——无官方来源的信息不要入库
- `date` 是行程日期（不是添加日期），务必准确，避免 8/12 生日会写成 7/25 这类错误
- `member` 必须是 `A`/`B`/`both`
- `type` 严格使用枚举值
- 双人行程（巡演、青春盛典）用 `member: both`
- 每次改完 `content/` 后：删除 `.next` → 构建 → 重启服务
- 构建/重启命令在 Windows 本机必须用绝对路径调用 node/npm
