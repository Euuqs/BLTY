# 内容编辑器字段契约与兼容规则

> 版本：v1.0 · 2026-08-30
>
> 本文是独立编辑器与网站仓库之间的数据契约。编辑器实现、网站 Velite Schema 和兼容测试都必须以此为准。

## 一、现有数据盘点

| 集合 | 数量 | 当前必有字段 | 当前可缺字段 |
|---|---:|---|---|
| 同款 | 6 | `title/date/category/member/cover/tags/body` | `brand` 1 条缺失，`price` 全部缺失 |
| 行程 | 38 | `title/date/member/type/description/body` | `time` 10 条缺失，`location` 2 条缺失 |
| 动态 | 99 | `title/date/member/type/description/link/tags/body` | 无 |

现有数据还具有以下特征：

- 成员实际值只有 `A`、`B`、`both`。
- 同款实际分类为衣服、饰品、鞋包；Schema 还允许零食、美妆、其他。
- 行程实际类型为综艺、演出、活动、其他；Schema 还允许直播。
- 动态实际类型为路透、日常、舞台、采访、其他。
- 所有日期均为 `YYYY-MM-DD`，28 条具体时间均为 `HH:mm`。
- 所有同款图片引用均能在 `public/static/same-styles/` 找到。
- 所有动态链接均为可解析的绝对 HTTP(S) URL。
- 所有 143 个 MDX 文件使用 LF 换行且正文非空。
- 当前不存在集合内重复 slug；行程与动态之间存在一个同名同日 slug，允许跨集合重复。

## 二、TypeScript 契约

```ts
export type ContentCollection = "same-styles" | "schedules" | "feeds";
export type Member = "A" | "B" | "both";
export type ContentStatus = "draft" | "published";
export type ScheduleTimeMode = "specific" | "all-day" | "tbd";

export type SameStyleCategory =
  | "衣服"
  | "饰品"
  | "零食"
  | "美妆"
  | "鞋包"
  | "其他";

export type ScheduleType = "综艺" | "直播" | "演出" | "活动" | "其他";
export type FeedType = "路透" | "日常" | "舞台" | "采访" | "其他";

export interface ContentIdentity {
  id?: string;
  slug?: string;
  status?: ContentStatus;
  updatedAt?: string;
  publishedAt?: string;
}

export interface SameStyleFrontmatter extends ContentIdentity {
  title: string;
  date: string;
  category: SameStyleCategory;
  member: Member;
  brand?: string;
  price?: string;
  cover?: string;
  tags?: string[];
}

export interface ScheduleFrontmatter extends ContentIdentity {
  title: string;
  date: string;
  timeMode?: ScheduleTimeMode;
  time?: string;
  member: Member;
  type?: ScheduleType;
  location?: string;
  description?: string;
}

export interface FeedFrontmatter extends ContentIdentity {
  title: string;
  date: string;
  member: Member;
  type?: FeedType;
  description?: string;
  link?: string;
  sourcePlatform?: string;
  tags?: string[];
}

export interface ContentDocument<TFrontmatter> {
  collection: ContentCollection;
  relativePath: string;
  frontmatter: TFrontmatter;
  body: string;
  raw: string;
  effectiveId: string;
  effectiveSlug: string;
  effectiveStatus: ContentStatus;
}
```

`raw` 只在服务端保存，用于安全写回；不得发送到不需要原文的客户端列表接口。

## 三、共享字段规则

### 3.1 ID

- 新内容使用 `crypto.randomUUID()` 生成 UUID v4。
- 新文件名为 `<id>.mdx`。
- 历史内容没有 `id` 时，读取层生成 `legacy:<collection>:<relativePath>` 作为 `effectiveId`。
- 历史内容第一次成功保存时补写 UUID，但不强制重命名原文件。
- ID 创建后不可修改，不显示在普通表单中。

### 3.2 slug

- 新内容创建时写入固定 `slug`，之后标题或日期修改不自动改变它。
- 默认 slug 仍使用 `<date>-<normalized-title>`，集合内冲突时追加 UUID 前 8 位。
- 历史内容没有 `slug` 时沿用当前 Velite 的标题日期计算方式。
- slug 只要求集合内唯一；不同集合可以相同。
- 网站 Velite transform 应优先使用 frontmatter `slug`，缺失时再计算。

### 3.3 状态

- 状态仅允许 `draft` 和 `published`。
- 历史内容缺少 `status` 时，`effectiveStatus` 为 `published`。
- 新建内容默认 `draft`。
- 草稿仍必须满足 Velite 构建所需的基本字段，不能生成不可编译 MDX。
- 前台只能消费统一过滤后的 published 集合。

### 3.4 日期与时间戳

- 内容日期严格使用 `YYYY-MM-DD`，解释为 `Asia/Shanghai` 本地日期。
- `updatedAt`、`publishedAt` 使用带 `+08:00` 的 ISO 8601，例如 `2026-08-30T18:30:00+08:00`。
- 不把内容日期先转成 UTC 再写回，避免日期前移或后移。
- 每次保存更新 `updatedAt`；首次发布写入 `publishedAt`，以后重新发布不覆盖首次发布时间。

### 3.5 文本与 YAML

- 标题最大 99 字符，与当前 Velite Schema 一致。
- `description` 最大 500 字符；品牌和地点最大 100 字符。
- URL 最大 2048 字符；标签最多 20 个，每个最多 30 字符。
- 用户输入的字符串写入 YAML 时统一正确转义引号、反斜杠、冒号、井号和换行。
- 文件继续使用 UTF-8、LF 换行，并保留文件末尾换行。
- 不识别的 frontmatter 字段必须原样保留；编辑器不得借一次普通编辑删除扩展字段。

## 四、同款规则

### 草稿最低要求

- `title`、`date`、`category`、`member`。
- body 可以暂为空，但文件仍保留 frontmatter 后的正文区域。

### 发布要求

- 草稿最低字段全部有效。
- `cover` 必填，且必须位于 `/static/same-styles/`。
- 对应文件必须存在于 `public/static/same-styles/`。
- body 必填，用作详情弹窗正文。

### 价格

- frontmatter 继续保存字符串，以兼容现有前台类型。
- 新增或编辑后的价格只保存十进制数字字符串，例如 `599`、`599.50`。
- 不保存货币符号、逗号或中文单位。
- 读取旧值时允许宽松展示；只有用户修改价格后才执行规范化。

## 五、行程规则

### 时间模式

| `timeMode` | `time` | 含义 |
|---|---|---|
| `specific` | 必须为 `HH:mm` | 有明确开始时间 |
| `all-day` | 必须删除 | 全天活动 |
| `tbd` | 必须删除 | 时间待定 |

历史内容缺少 `timeMode` 时：有 `time` 推导为 `specific`，没有 `time` 推导为 `tbd`。不自动把任何旧内容推断为全天。

### 草稿最低要求

- `title`、`date`、`member`。

### 发布要求

- `title`、`date`、`member`、`type`、`timeMode`、`description`。
- `timeMode=specific` 时必须有合法 `time`。
- `location` 允许为空，以兼容当前 2 条无地点行程。

### MDX body

- 编辑器主要编辑 `description`，不向普通用户展示 MDX body 编辑器。
- 对历史文件始终保留原 body。
- 创建新文件时，以 `description` 初始化纯文本 body，保证当前 `s.mdx()` 可编译。
- 后续编辑时，如果 body 与保存前的 `description` 完全相同，可同步更新；否则视为独立历史正文并保持不变。

## 六、动态规则

### 草稿最低要求

- `title`、`date`、`member`。

### 发布要求

- `title`、`date`、`member`、`type`、`description`。
- `link` 允许为空，但显示发布警告；填写时必须是 HTTP(S) 绝对 URL。
- `tags` 允许为空。

### 正文

- 时间线实际展示 `description`，因此表单中的“正文”保存到该字段。
- 对历史文件始终保留原 MDX body。
- 创建新文件时，以 `description` 初始化纯文本 body。
- body 同步规则与行程一致，避免覆盖已有的详细正文。

### 来源平台

根据 URL hostname 自动建议，用户可以覆盖：

| hostname | 建议值 |
|---|---|
| `weibo.com`、`www.weibo.com` | 微博 |
| `douyin.com`、`www.douyin.com` | 抖音 |
| `bilibili.com`、`www.bilibili.com`、`b23.tv` | B站 |
| `xiaohongshu.com`、`www.xiaohongshu.com`、`xhslink.com` | 小红书 |
| `sina.cn`、`www.sina.cn` | 新浪 |
| `shop.48.cn` | SNH48票务 |

无法识别时保持为空或填写“其他”。识别必须比较规范化 hostname，不能使用 URL 字符串包含判断。

## 七、标签规则

- 同款和动态共享标签候选池。
- 保存前去除首尾空格、空标签和完全重复项。
- 首版区分大小写，不自动合并 `Vlog` 与 `VLOG` 等可能具有语义的标签。
- 保持用户输入顺序，不按字母或拼音自动重排。
- 首版不批量改名、合并或删除标签。

## 八、写回不变量

### 8.1 解析器约束

- 编辑器应使用支持 YAML 1.2 Document API 的解析器，推荐独立项目使用 `yaml` 包。
- 解析时必须让 `2026-08-30` 保持字符串，不能自动转换成 JavaScript `Date`。
- 不使用 `js-yaml` 默认 timestamp schema；如测试临时使用 `js-yaml`，必须指定 `JSON_SCHEMA`。
- 写回实现必须能修改已知节点，同时保留未知字段；选择依赖时优先考虑字段顺序与注释保留能力。

一次读取后不修改任何表单字段并直接写回，必须满足：

1. 所有已知字段值相同。
2. 所有未知 frontmatter 字段仍存在且值相同。
3. MDX body 内容相同。
4. 文件继续为 UTF-8、LF，并保留末尾换行。
5. 原文件路径不变。

允许 YAML 引号或空格发生规范化，但不得改变数据语义。若实现所选解析器能够保留注释和字段顺序，应优先保留。

## 九、兼容测试清单

| 编号 | 场景 | 预期结果 |
|---|---|---|
| C01 | 读取缺少所有新增字段的旧同款 | 默认 published，生成 legacy ID 和计算 slug |
| C02 | 读取无 `time` 的旧行程 | 推导 `timeMode=tbd` |
| C03 | 读取有 `time` 的旧行程 | 推导 `timeMode=specific` |
| C04 | 读取带引号、冒号、井号的动态 | 字符串无丢失、无截断 |
| C05 | 写回含未知 frontmatter 的文件 | 未知字段和 body 保留 |
| C06 | 修改旧内容标题和日期 | effective ID 不变，旧路径不变 |
| C07 | 新建全天行程 | 写入 `timeMode=all-day` 且无 `time` |
| C08 | 新建待定行程 | 写入 `timeMode=tbd` 且无 `time` |
| C09 | 新建具体时间行程 | `time` 必须为 `HH:mm` |
| C10 | 新建同款草稿但没有图片 | 允许保存草稿，不允许发布 |
| C11 | 同款图片路径指向不存在文件 | 阻止发布 |
| C12 | 动态使用未知域名 | 允许保存，来源平台为空或手动填写 |
| C13 | 动态填写非法 URL | 草稿提示，发布阻止 |
| C14 | 新 slug 在集合内冲突 | 自动追加短 ID |
| C15 | slug 只在另一集合重复 | 允许保存 |
| C16 | 标签包含空格和重复项 | trim、去空、去完全重复，保持顺序 |
| C17 | 时间戳跨 UTC 日期边界 | 写回仍为 `+08:00` 本地时间 |
| C18 | 无改动 round-trip | 满足全部写回不变量 |

测试样本位于 `docs/content-editor-fixtures/`。独立编辑器项目建立后，应把这些样本复制到测试目录或直接作为只读 fixtures 使用。
