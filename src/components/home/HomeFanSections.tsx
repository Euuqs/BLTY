import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Heart, Rose } from "@/components/mascot/Mascots";
import { ChannelDivider } from "@/components/home/ChannelDivider";
import { Reveal } from "@/components/ui/Reveal";

const people = [
  {
    key: "bai",
    name: "柏欣妤",
    romanized: "Bai Xinyu",
    group: "SNH48",
    image: "/static/mascots/bai-profile.jpg",
    quote: "全世界朱怡欣最喜欢我！",
    note: "舞台上认真发光，镜头外保留着坦率又可爱的一面。这里会继续收录她的个人公演、生日舞台与公开近况。",
  },
  {
    key: "zhu",
    name: "朱怡欣",
    romanized: "Zhu Yixin",
    group: "GNZ48",
    image: "/static/mascots/zhu-profile.jpg",
    quote: "全世界我最喜欢柏欣妤了！",
    note: "从比赛舞台到生日定制演出，她一直在尝试新的表达。属于她的个人成绩，也值得被认真记住。",
  },
] as const;

const socialLinks = {
  bai: [
    { platform: "微博", label: "SNH48-柏欣妤", url: "https://weibo.com/u/6375479853" },
    { platform: "微博小号", label: "就一小波波", url: "https://weibo.com/u/7899620253" },
    { platform: "抖音", label: "道明五", url: "https://v.douyin.com/iqSDa19" },
  ],
  zhu: [
    { platform: "微博", label: "GNZ48-朱怡欣-", url: "https://weibo.com/u/6224125612" },
    { platform: "微博小号", label: "我这佛光普照艳阳高照那你呢", url: "https://weibo.com/u/5585636284" },
    { platform: "抖音", label: "见习反派GGB", url: "https://www.douyin.com/user/MS4wLjABAAAAS8ADpNmDEM2dyJNr8_FBAWcqtWk6mdo5eXwEwvYlCiM" },
  ],
} as const;

const archiveDoors = [
  { href: "/same-styles", title: "同款衣橱", copy: "从一件衣服、一只包，到被她们分享过的日常小物。", mark: "衣服 · 饰品 · 鞋包" },
  { href: "/schedule", title: "近期行程", copy: "公演、直播、活动与舞台，按日期整理在同一页。", mark: "演出 · 直播 · 活动" },
  { href: "/feed", title: "动态时间线", copy: "想知道最近发生了什么，从最新一条慢慢往回看。", mark: "舞台 · 日常 · 公开动态" },
] as const;

export function HomeFanSections() {
  return (
    <>
      <div id="profile" className="scroll-target home-content-section">
        <ChannelDivider label="认识她们" note="两份独立的光" tone="bai" />
        <Reveal delay={0.05}>
          <section className="fan-portraits" aria-labelledby="fan-portraits-title">
            <header className="fan-portraits-intro">
              <p>两个人，各自有完整而闪亮的故事</p>
              <h2 id="fan-portraits-title">先认识她们，<br />再读懂共同走过的路。</h2>
            </header>

            <div className="fan-portrait-list">
              {people.map((person, index) => (
                <article className={`fan-portrait fan-portrait-${person.key}`} key={person.key}>
                  <figure className="fan-portrait-photo">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      sizes="(max-width: 760px) 100vw, 52vw"
                      className="object-cover"
                    />
                  </figure>
                  <div className="fan-portrait-copy">
                    <span>{person.group}</span>
                    <h3>{person.name}</h3>
                    <p className="fan-portrait-romanized">{person.romanized}</p>
                    <blockquote>“{person.quote}”</blockquote>
                    <p>{person.note}</p>
                    <a href="#social">找到她的主页 <ArrowRight aria-hidden="true" /></a>
                  </div>
                  <span className="fan-portrait-number" aria-hidden="true">0{index + 1}</span>
                </article>
              ))}
            </div>

            <div className="fan-portrait-together">
              <Heart aria-hidden="true" />
              <p>她们不是彼此的附注。先看见两份独立的光，才会明白相遇为什么珍贵。</p>
            </div>
          </section>
        </Reveal>
      </div>

      <div id="social" className="scroll-target home-content-section">
        <ChannelDivider label="找到她们" note="以本人公开账号为准" tone="zhu" />
        <Reveal delay={0.05}>
          <section className="fan-social" aria-labelledby="fan-social-title">
            <header>
              <h2 id="fan-social-title">从本人发布的内容开始。</h2>
              <p>追近况、看照片，也记得把喜欢留在她们真正能看见的地方。</p>
            </header>
            <div className="fan-social-columns">
              {people.map((person) => (
                <div className="fan-social-person" key={person.key}>
                  <h3>{person.name}</h3>
                  <div>
                    {socialLinks[person.key].map((social) => (
                      <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer">
                        <small>{social.platform}</small>
                        <span>{social.label}</span>
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      <div id="guide" className="scroll-target home-content-section">
        <ChannelDivider label="继续补档" note="按你感兴趣的方向翻阅" />
        <Reveal delay={0.05}>
          <section className="fan-archive-directory" aria-labelledby="fan-directory-title">
            <div className="fan-directory-title">
              <p>不必一次看完</p>
              <h2 id="fan-directory-title">这里更像一只会慢慢装满的收藏盒。</h2>
            </div>
            <nav className="fan-directory-links" aria-label="补档分类">
              {archiveDoors.map((door, index) => (
                <Link href={door.href} prefetch={false} key={door.href}>
                  <span className="fan-directory-index">0{index + 1}</span>
                  <span className="fan-directory-copy">
                    <strong>{door.title}</strong>
                    <small>{door.copy}</small>
                  </span>
                  <em>{door.mark}</em>
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </section>
        </Reveal>
      </div>

      <div id="join" className="scroll-target home-content-section">
        <ChannelDivider label="写给新朋友" note="让喜欢继续发生" tone="fan" />
        <Reveal delay={0.05}>
          <section className="fan-letter" aria-labelledby="fan-letter-title">
            <figure>
              <Image
                src="/static/mascots/casual-theater.jpg"
                alt="柏欣妤与朱怡欣在剧场合影"
                fill
                sizes="(max-width: 760px) 100vw, 46vw"
                className="object-cover"
              />
            </figure>
            <div className="fan-letter-paper">
              <Rose aria-hidden="true" />
              <p className="fan-letter-salutation">你好，新朋友：</p>
              <h2 id="fan-letter-title">欢迎来到柏里挑怡。</h2>
              <p>这里不是关系定义，也不是只留下高光的橱窗。我们想保存她们公开说过的话、认真完成的舞台，以及那些值得反复回看的小事。</p>
              <p>你可以从任何一年开始，也可以只看自己感兴趣的部分。如果发现遗漏或错误，欢迎一起把档案补得更好。</p>
              <div className="fan-letter-signature">愿每一次喜欢，都有迹可循。</div>
              <div className="fan-letter-actions">
                <a href="https://weibo.com/u/3209726480" target="_blank" rel="noopener noreferrer">关注应援站 <ArrowUpRight aria-hidden="true" /></a>
                <a href="https://s.weibo.com/weibo?q=%23%E6%9F%8F%E9%87%8C%E6%8C%91%E6%80%A1%23" target="_blank" rel="noopener noreferrer">去微博看看大家</a>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
