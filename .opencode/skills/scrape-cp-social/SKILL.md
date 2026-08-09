---
name: scrape-cp-social
description: Drive the logged-in Edge debug instance (CDP, port 9229) to scrape 柏欣妤/朱怡欣 微博 and 抖音 content. Invoke when user says '抓微博', '抓抖音', '爬取账号内容', '更新动态/同款数据', '看看最近发了什么', or wants to pull recent posts from the two members' weibo/douyin accounts.
---

# Scrape CP Social · 抓取成员微博/抖音

通过 CDP 驱动「已登录」的 Edge 调试实例，抓取柏欣妤（A）与朱怡欣（B）的微博与抖音近期内容，供 update-feed 等 skill 使用。

## 环境速览

- OS: Windows / PowerShell 5.1；Node 24（自带全局 `WebSocket`，**无需任何 npm 依赖**）
- 本机 `npm`/`npx` 不在 PATH，运行 node 前先执行：
  ```powershell
  $env:Path = "C:\Program Files\nodejs;" + $env:Path
  ```
- 调试实例端口：`9229`
- Edge 调试实例配置目录：`C:\Users\20517\AppData\Local\Temp\opencode\edge-live`（已登录微博+抖音）
- 可用脚本（本项目 skill 目录内，开箱即用）：
  - `scripts/weibo.js <uid>` — 微博 API 抓取
  - `scripts/douyin-profile.js <sec_uid>` — 抖音主页视频 ID 列表
  - `scripts/douyin-video.js <vid>` — 单条抖音视频详情（发布时间/描述/点赞/作者）

## 账号对照

| 成员 | 微博 uid | 抖音 sec_uid | 抖音昵称 |
|------|----------|--------------|----------|
| 柏欣妤 (A) | `6375479853` | `MS4wLjABAAAAIjMZpvFCE88eQWAsBILLu2MdEvsXPqopBlloi5R4_WY` | 道明五 |
| 朱怡欣 (B) | `6224125612` | `MS4wLjABAAAAS8ADpNmDEM2dyJNr8_FBAWcqtWk6mdo5eXwEwvYlCiM` | 见习反派GGB |

## 第 0 步：确认调试实例

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
node -e "http.get({host:'localhost',port:9229,path:'/json/version'},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>console.log(JSON.parse(d).Browser))}).on('error',e=>console.log('NO',e.code))"
```

- 返回浏览器版本 → 实例存活，直接抓取。
- 返回 `NO ECONNREFUSED` → 实例未启动，走「启动」流程。

### 启动调试实例（含登录）

```powershell
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (!(Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }
$args = "--remote-debugging-port=9229 --user-data-dir=C:\Users\20517\AppData\Local\Temp\opencode\edge-live --no-first-run --no-default-browser-check"
Start-Process $edge -ArgumentList $args
```

- 在**该实例**中访问微博/抖音，让用户扫码登录（cookie 存在 edge-live 配置目录里，登录一次后续复用）。
- 不要直接在新标签页手动操作，所有导航用 CDP `Page.navigate` 完成。

## 微博抓取（可靠，推荐）

用 **m.weibo.cn API**（`type=uid&containerid=107603{uid}`），在已登录调试标签页 `Page.navigate` 过去，返回完整 JSON。

```powershell
node "D:\projects\cp-site\.opencode\skills\scrape-cp-social\scripts\weibo.js" 6375479853
node "D:\projects\cp-site\.opencode\skills\scrape-cp-social\scripts\weibo.js" 6224125612
```

每条输出：`id`、`bid`、`created`（`created_at`，+0800）、`text`（纯文本前 300 字）、`hasPics`、`retweeted`（是否转发）、`link`（真实微博链接前缀）。

### 处理规则

- **跳过转发/政治帖**：`retweeted === true` 的转发帖，以及政治、广告、无关内容一律不录入。
- 置顶帖在最前；`created` 为 +0800 时间，`date` 取 `YYYY-MM-DD`。
- 真实链接 = `https://weibo.com/{uid}/{bid}`（不要用新浪镜像）。

## 抖音抓取

### 1) 主页拿视频 ID 列表

```powershell
node "D:\projects\cp-site\.opencode\skills\scrape-cp-social\scripts\douyin-profile.js" MS4wLjABAAAAIjMZpvFCE88eQWAsBILLu2MdEvsXPqopBlloi5R4_WY
```

输出 `DOM cards`：主页前 ~30 条作品的 `https://www.douyin.com/video/{vid}` 链接（脚本已滚动加载、去重）。

### 2) 单条视频详情（可靠，逐条执行）

```powershell
node "D:\projects\cp-site\.opencode\skills\scrape-cp-social\scripts\douyin-video.js" 7668283058953502180
```

输出：`vid`、`pubTime`（`发布时间：YYYY-MM-DD HH:MM`）、`desc`（描述）、`digg`（点赞数）、`author`（作者昵称）。

- 描述字段含 `#话题`、`@品牌` 等原文，录入时保留核心文案即可。
- **作者校验**：`author` 必须等于该成员抖音昵称（道明五/见习反派GGB）。主页里混入的他人合拍（author 为他人）按需决定是否收录。

## 已踩坑（务必遵守）

1. **真实 Edge 配置（`C:\Users\20517\AppData\Local\Microsoft\Edge\User Data`）无法绑定任何调试端口**，不要尝试用 `--remote-debugging-port` 打开它，也不要复制它——Edge 150 cookie 是 v20 app-bound encryption（前缀 `7632`），复制后无法解密。**只能走 edge-live 目录 + 扫码登录**。
2. 批量连续导航抖音视频页会偶发返回空（body 无「发布时间：」），**必须逐条导航**，每次 `sleep` 6–10s，失败就重跑该条。
3. 抖音视频页加载慢，抓详情别用 `scrape-douyin-batch.js` 类脚本；单条脚本 `douyin-video.js` 最稳。
4. Node 脚本必须用 `C:\Program Files\nodejs` 前缀的 PATH，否则 `node` 找不到。
5. 微博 `created_at`、抖音 `发布时间` 均为本地（+0800），直接按 `YYYY-MM-DD` 使用，不需要时区换算。
6. 单条抓取后浏览器标签停留在该页；继续抓下一条时脚本会自己 `Page.navigate`，无需手动切页。

## 产出 → 写入动态

抓到的内容按 `update-feed` skill 规范写成 `.mdx`（`D:\projects\cp-site\content\feeds\`）：

- `title` / `date`（YYYY-MM-DD）/ `member`（A/B/both）/ `type`（日常/舞台/其他…）/ `description` / `link`（微博或抖音真实链接）/ `tags`
- 商务推广（雅丽洁、有棵树等）与团体宣传（十二花语新歌）也可收录，`type` 用 `日常` 或 `其他`，`tags` 加 `商务`/`新歌`。
- 写完 `Remove-Item -Recurse -Force .next; npm run build` 验证，再重启 3000 端口服务（`Get-NetTCPConnection -LocalPort 3000` 找 PID → `Stop-Process` → `npm start`）。

## 项目路径

- Skill 脚本：`D:\projects\cp-site\.opencode\skills\scrape-cp-social\scripts\`
- 动态内容：`D:\projects\cp-site\content\feeds\`
- 动态 Skill：`D:\projects\cp-site\.opencode\skills\update-feed\SKILL.md`
- 调试实例配置：`C:\Users\20517\AppData\Local\Temp\opencode\edge-live`
