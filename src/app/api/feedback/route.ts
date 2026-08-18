import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CONTENT = 500;
const MAX_NAME = 50;
const MAX_CONTACT = 100;
const COOLDOWN_MS = 60_000;
const REPO = process.env.GITHUB_REPO ?? "Euuqs/BLTY";

const recent = new Map<string, number>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  if (recent.size > 5000) {
    for (const [k, t] of recent) {
      if (now - t > COOLDOWN_MS) recent.delete(k);
    }
  }
  const last = recent.get(key);
  if (last && now - last < COOLDOWN_MS) return false;
  recent.set(key, now);
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "提交太频繁了，请稍后再试" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { content, nickname, contact } = (body ?? {}) as Record<string, unknown>;
  const text = typeof content === "string" ? content.trim() : "";
  const name = typeof nickname === "string" ? nickname.trim() : "";
  const contactStr = typeof contact === "string" ? contact.trim() : "";

  if (!text) return NextResponse.json({ error: "意见内容不能为空" }, { status: 400 });
  if (text.length > MAX_CONTENT) {
    return NextResponse.json({ error: `内容不能超过 ${MAX_CONTENT} 字` }, { status: 400 });
  }
  if (name.length > MAX_NAME) {
    return NextResponse.json({ error: `昵称不能超过 ${MAX_NAME} 字` }, { status: 400 });
  }
  if (contactStr.length > MAX_CONTACT) {
    return NextResponse.json({ error: `联系方式不能超过 ${MAX_CONTACT} 字` }, { status: 400 });
  }

  const token = process.env.GITHUB_FEEDBACK_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "意见箱尚未配置，请稍后再试" }, { status: 500 });
  }

  const title = `[意见] ${text.slice(0, 30)}${text.length > 30 ? "…" : ""}`;
  const issueBody = [
    "### 意见内容",
    "",
    text,
    "",
    "---",
    name ? `- **昵称**：${name}` : "- **昵称**：（匿名）",
    contactStr ? `- **联系方式**：${contactStr}` : "- **联系方式**：（未填写）",
    "",
    `> 提交时间：${new Date().toLocaleString("zh-CN")}`,
  ].join("\n");

  const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "cp-site-feedback",
    },
    body: JSON.stringify({ title, body: issueBody }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "提交失败，请稍后再试" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}