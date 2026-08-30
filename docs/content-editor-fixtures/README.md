# 内容编辑器兼容测试样本

这些文件不是网站内容，不会被 Velite 的 `content/` pattern 读取。它们用于独立编辑器的解析、验证和 round-trip 测试。

| 文件 | 覆盖场景 |
|---|---|
| `legacy-same-style.mdx` | 旧同款、无新增字段、无价格 |
| `legacy-schedule-specific.mdx` | 旧行程、有时间、无 timeMode |
| `legacy-schedule-tbd.mdx` | 旧行程、无时间、无地点、未知字段 |
| `legacy-feed-special-chars.mdx` | 引号、冒号、井号、URL 查询参数、独立 body |
| `new-same-style-draft.mdx` | 新同款草稿、无图片、固定 ID/slug |
| `new-schedule-all-day.mdx` | 新全天行程 |
| `new-feed-published.mdx` | 新动态、来源平台、标签去重输入基线 |
| `invalid-content.mdx` | 非法成员、日期、URL，用于拒绝测试 |
| `expected.json` | 每个样本的有效性与关键派生结果 |

测试时不得原地改写这些基准文件。每个测试先复制到临时目录，再执行写回断言。
