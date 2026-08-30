# 网站实施前基线 · 2026-08-30

## 仓库

- 路径：`D:/projects/cp-site`
- 分支：`master`
- 上游：`origin/master`
- GitHub 默认分支：`master`
- 远端：`https://github.com/Euuqs/BLTY.git`
- 基线提交：`be2c14acc10450976adb6e30f5600e7f4dca6483`
- Vercel 项目：`cp-site`
- Vercel Project ID：`prj_FqbuvG797hAwkVe6CkphGw05c3Gr`
- Vercel Production Branch：本地配置不包含该字段；按 GitHub 默认分支预期为 `master`，首次实际推送前需在 Vercel 项目设置中复核。

## 环境

- Node.js：`v24.18.1`
- npm：`11.16.0`
- Git：`2.45.1.windows.1`
- Next.js：`16.2.12`
- Velite：`0.4.0`

## 内容数量

- 同款：6
- 行程：38
- 动态：99
- 同款图片目录文件：7

## 构建结果

- `npm run build`：通过。
- Velite、TypeScript、静态页面生成全部通过。
- 首次受限运行因无法写入 `node_modules/.velite.config.compiled.mjs` 失败；允许本地构建写入后通过，不属于代码错误。

## 截图

截图使用生产构建的本地服务，等待入场动画稳定后生成。

- `home-desktop-1440.png`
- `home-mobile-390.png`
- `same-styles-desktop-1440.png`
- `same-styles-mobile-390.png`
- `schedule-desktop-1440.png`
- `schedule-mobile-390.png`
- `feed-desktop-1440.png`
- `feed-mobile-390.png`

桌面视口：`1440 × 1600`；移动视口：`390 × 1400`。

## 工作区保护边界

基线时网站工作区已有大量未提交的视觉重构修改。内容编辑器实施不得覆盖、stash、reset 或 checkout 这些修改。完整文件清单记录在 `docs/content-editor-progress.md`。
