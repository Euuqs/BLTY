"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export interface SignalMoment {
  id: string;
  date: string;
  title: string;
  summary: string;
  confidence: "confirmed" | "partial" | "unverified";
  sourceUrl?: string;
  sourceLabel?: string;
  image?: string;
  imageAlt?: string;
  quote?: string;
  detailUrl?: string;
}

export interface SignalSideTrack {
  id: "bai" | "zhu";
  name: string;
  colorLabel: string;
  summary: string;
  moments: Array<{ date: string; title: string }>;
}

const ease = [0.16, 1, 0.3, 1] as const;

function dateParts(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return { year, month, day };
}

export function SignalTimeline({ moments, sideTracks = [] }: { moments: SignalMoment[]; sideTracks?: SignalSideTrack[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="story-journal" aria-labelledby="signal-timeline-title">
      <header className="story-journal-intro">
        <div className="story-journal-edition" aria-hidden="true">
          <span>2026</span>
          <span>持续补档中</span>
        </div>
        <div>
          <p className="story-journal-kicker">她们这一年，发生了什么</p>
          <h2 id="signal-timeline-title">一起把故事<br />慢慢补完整</h2>
        </div>
        <p className="story-journal-deck">
          从组队四周年到杭州站，这里不替她们定义关系，只把公开说过的话、共同走过的舞台和可以回看的影像整理在一起。
        </p>
      </header>

      <div className="story-journal-index" aria-label="本页内容概览">
        <span>本期收录</span>
        <strong>{String(moments.length).padStart(2, "0")}</strong>
        <p>个双人故事节点</p>
        <i aria-hidden="true" />
        <p>另附两条个人故事线</p>
        <Link href="/stories" prefetch={false}>查看完整故事档案</Link>
      </div>

      <div className="story-journal-pages">
        {moments.map((moment, index) => {
          const date = dateParts(moment.date);
          const featured = Boolean(moment.image);
          return (
            <motion.article
              key={moment.id}
              className={`story-journal-entry ${featured ? "has-image" : ""} ${index % 2 ? "is-offset" : ""}`}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.68, delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.16), ease }}
            >
              <div className="story-journal-date" aria-label={`${date.year}年${date.month}月${date.day}日`}>
                <span>{date.month}.{date.day}</span>
                <small>{date.year}</small>
              </div>

              {featured && moment.image && (
                <figure className="story-journal-photo">
                  <Image src={moment.image} alt={moment.imageAlt ?? ""} fill sizes="(max-width: 767px) 100vw, 56vw" className="object-cover" />
                </figure>
              )}

              <div className="story-journal-copy">
                <span className="story-journal-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{moment.title}</h3>
                {moment.quote && <blockquote>“{moment.quote}”</blockquote>}
                <p>{moment.summary}</p>
                {moment.detailUrl && (
                  <Link className="story-journal-detail-link" href={moment.detailUrl} prefetch={false}>
                    阅读完整档案<span aria-hidden="true">→</span>
                  </Link>
                )}
                {moment.sourceUrl && (
                  <a href={moment.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {moment.sourceLabel ?? "去看原始记录"}<span aria-hidden="true">↗</span>
                  </a>
                )}
                <small className="story-journal-source-note">
                  {moment.confidence === "confirmed" ? "已用完整录像或官方内容交叉核对" : "来自公开档案，仍在补充原始来源"}
                </small>
              </div>
            </motion.article>
          );
        })}
      </div>

      {sideTracks.length > 0 && (
        <aside className="story-dossiers" aria-labelledby="story-dossiers-title">
          <div className="story-dossiers-heading">
            <p>她们也各自在发光</p>
            <h3 id="story-dossiers-title">两份个人档案</h3>
            <span>双人故事之外，也认真记录每个人的舞台。</span>
          </div>
          <div className="story-dossiers-list">
            {sideTracks.map((track) => (
              <details key={track.id} className={`story-dossier is-${track.id}`}>
                <summary>
                  <span className="story-dossier-monogram" aria-hidden="true">{track.id === "bai" ? "B" : "Z"}</span>
                  <span><strong>{track.name}</strong><small>{track.colorLabel}</small></span>
                  <em>翻开档案</em>
                </summary>
                <div className="story-dossier-content">
                  <p>{track.summary}</p>
                  <ol>
                    {track.moments.map((moment) => (
                      <li key={`${track.id}-${moment.date}-${moment.title}`}>
                        <time dateTime={moment.date}>{moment.date.slice(5).replace("-", ".")}</time>
                        <span>{moment.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </details>
            ))}
          </div>
        </aside>
      )}
    </section>
  );
}
