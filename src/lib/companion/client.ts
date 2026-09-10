import type { CompanionChatRequest, CompanionStreamEvent } from "./types";

export async function readCompanionEventStream(
  response: Response,
  onEvent: (event: CompanionStreamEvent) => void,
): Promise<void> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "陪伴者暂时无法连接，请稍后再试。");
  }
  if (!response.body) throw new Error("浏览器没有收到回复内容。");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    let boundary = buffer.indexOf("\n\n");

    while (boundary >= 0) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const data = block
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n");
      if (data) onEvent(JSON.parse(data) as CompanionStreamEvent);
      boundary = buffer.indexOf("\n\n");
    }

    if (done) break;
  }
}

export async function streamCompanionChat(
  input: CompanionChatRequest,
  onEvent: (event: CompanionStreamEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch("/api/companion/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });
  await readCompanionEventStream(response, onEvent);
}

