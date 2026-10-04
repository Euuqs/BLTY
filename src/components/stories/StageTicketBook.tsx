"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "@/components/mascot/Mascots";

type StageStory = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

type SavedTicket = StageStory & { savedAt: string };

const STORAGE_KEY = "cp-site:stage-tickets:v1";
const CHANGE_EVENT = "cp-site:stage-tickets-change";

function readTickets(): SavedTicket[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((ticket): ticket is SavedTicket =>
      typeof ticket?.slug === "string" &&
      typeof ticket?.title === "string" &&
      typeof ticket?.date === "string" &&
      typeof ticket?.summary === "string" &&
      typeof ticket?.savedAt === "string",
    );
  } catch {
    return [];
  }
}

function writeTickets(tickets: SavedTicket[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function useSavedTickets() {
  const [tickets, setTickets] = useState<SavedTicket[] | null>(null);

  useEffect(() => {
    const update = () => setTickets(readTickets());
    update();
    window.addEventListener(CHANGE_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CHANGE_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return tickets;
}

export function StageTicketStamp({ story }: { story: StageStory }) {
  const tickets = useSavedTickets();
  const isSaved = tickets?.some((ticket) => ticket.slug === story.slug) ?? false;

  function toggleTicket() {
    const current = readTickets();
    if (current.some((ticket) => ticket.slug === story.slug)) {
      writeTickets(current.filter((ticket) => ticket.slug !== story.slug));
      return;
    }
    writeTickets([...current, { ...story, savedAt: new Date().toISOString() }]);
  }

  return (
    <section className={`stage-ticket-stamp${isSaved ? " is-saved" : ""}`} aria-labelledby="stage-ticket-stamp-title">
      <div>
        <p>这一场，想留下来吗？</p>
        <h2 id="stage-ticket-stamp-title">收下一张纪念票根</h2>
        <small>只保存在你的浏览器里，不会上传。</small>
      </div>
      <button type="button" onClick={toggleTicket} disabled={tickets === null} aria-pressed={isSaved}>
        <span>{tickets === null ? "正在展开票夹…" : isSaved ? "已经收好" : "盖进票根册"}</span>
        <em aria-hidden="true">{isSaved ? "已盖章" : "ADMIT ONE"}</em>
      </button>
    </section>
  );
}

export function StageTicketAlbum({ performances }: { performances: StageStory[] }) {
  const savedTickets = useSavedTickets();
  const tickets = savedTickets ?? [];

  return (
    <section className="stage-ticket-album" aria-labelledby="stage-ticket-album-title">
      <header>
        <p>只属于这台浏览器的纪念册</p>
        <h2 id="stage-ticket-album-title">我的舞台票根</h2>
        <span aria-live="polite">{savedTickets === null ? "正在展开…" : `已经收好 ${tickets.length} 张`}</span>
      </header>

      {savedTickets !== null && tickets.length === 0 ? (
        <div className="stage-ticket-empty">
          <strong>票根册还是空的。</strong>
          <p>读到一场想记住的舞台时，在详情页盖下票根。可以先从这些公开记录开始：</p>
          <nav aria-label="可以收藏的舞台">
            {performances.map((story) => (
              <Link href={`/stories/${story.slug}`} prefetch={false} key={story.slug}>
                <time dateTime={story.date}>{story.date.slice(0, 10).replaceAll("-", ".")}</time>
                <span>{story.title}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
      ) : (
        <div className="stage-ticket-stack" aria-label="已收藏舞台票根">
          {tickets.map((ticket, index) => (
            <Link href={`/stories/${ticket.slug}`} prefetch={false} className="stage-ticket" key={ticket.slug}>
              <span className="stage-ticket-number">No. {String(index + 1).padStart(2, "0")}</span>
              <time dateTime={ticket.date}>{ticket.date.slice(0, 10).replaceAll("-", ".")}</time>
              <strong>{ticket.title}</strong>
              <small>凭此票根，再回到这一场</small>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
