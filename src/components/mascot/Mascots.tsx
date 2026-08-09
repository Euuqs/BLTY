/* ============================================
   柏里挑怡 · 萌宠图标（Emoji 扁平风格）
   小白狗 = 柏欣妤  |  小猪猪 = 朱怡欣
   ============================================ */

export function DogMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      {/* 垂耳 */}
      <path
        d="M46 40 C24 34 16 54 26 72 C14 56 24 44 46 46 Z"
        fill="#E2A063"
        stroke="#C98A52"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M74 40 C96 34 104 54 94 72 C82 56 96 44 74 46 Z"
        fill="#E2A063"
        stroke="#C98A52"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M38 48 C32 40 34 50 36 58 C28 50 34 46 40 50 Z"
        fill="#D08B4E"
      />
      {/* 脸 */}
      <ellipse cx="60" cy="56" rx="44" ry="42" fill="#FBEFD8" stroke="#EFDCC0" strokeWidth="2.5" />
      {/* 额头柔光 */}
      <ellipse cx="50" cy="40" rx="20" ry="14" fill="#FFFFFF" opacity="0.5" />
      {/* 眼睛 */}
      <circle cx="44" cy="56" r="6" fill="#3B3637" />
      <circle cx="76" cy="56" r="6" fill="#3B3637" />
      <circle cx="42.5" cy="54" r="2" fill="#FFFFFF" />
      <circle cx="74.5" cy="54" r="2" fill="#FFFFFF" />
      {/* 腮红 */}
      <ellipse cx="30" cy="72" rx="8" ry="5" fill="#F5B9C6" opacity="0.75" />
      <ellipse cx="90" cy="72" rx="8" ry="5" fill="#F5B9C6" opacity="0.75" />
      {/* 鼻 */}
      <ellipse cx="60" cy="76" rx="8" ry="6" fill="#3B3637" />
      <ellipse cx="58" cy="74" rx="2.5" ry="1.6" fill="#FFFFFF" opacity="0.75" />
      {/* 嘴 */}
      <path
        d="M50 86 Q56 92 60 86 Q64 92 70 86"
        stroke="#3B3637"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function PigMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      {/* 脸 */}
      <ellipse cx="60" cy="58" rx="42" ry="40" fill="#F9A8C8" stroke="#EC8FB3" strokeWidth="2.5" />
      {/* 眼睛 */}
      <circle cx="46" cy="52" r="6" fill="#3B3637" />
      <circle cx="74" cy="52" r="6" fill="#3B3637" />
      <circle cx="44" cy="50" r="2.4" fill="#FFFFFF" />
      <circle cx="72" cy="50" r="2.4" fill="#FFFFFF" />
      {/* 腮红 */}
      <ellipse cx="30" cy="66" rx="8" ry="5" fill="#F485AB" opacity="0.55" />
      <ellipse cx="90" cy="66" rx="8" ry="5" fill="#F485AB" opacity="0.55" />
      {/* 猪鼻 */}
      <ellipse cx="60" cy="70" rx="16" ry="12" fill="#F49CC0" stroke="#EC8FB3" strokeWidth="2.5" />
      <ellipse cx="54" cy="70" rx="2.8" ry="3.8" fill="#D96F9B" />
      <ellipse cx="66" cy="70" rx="2.8" ry="3.8" fill="#D96F9B" />
      {/* 嘴 */}
      <path
        d="M54 84 Q60 88 66 84"
        stroke="#D96F9B"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Paw({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="6.5" r="2.1" />
        <circle cx="12" cy="4.6" r="2.1" />
        <circle cx="18.5" cy="6.5" r="2.1" />
        <ellipse cx="12" cy="14.5" rx="5.4" ry="4.1" />
      </g>
    </svg>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2 C12.2 6.2 15.6 9.6 22 10 C15.6 10.4 12.2 13.8 12 18 C11.8 13.8 8.4 10.4 2 10 C8.4 9.6 11.8 6.2 12 2 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Rose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* 外瓣 */}
      <path
        d="M24 3 C14 5 7 13 7 22 C7 26.5 8.8 30.5 12 33.5 C8.5 36.5 6.5 40.8 7 45.5 C13.5 46 19 42.5 22 37.5 C24 41 28 43.5 32.5 44 C35.5 40 37 35.5 36.5 31 C40 28.5 42 24.5 42 19.5 C41 11 34 4 24 3 Z"
        fill="currentColor"
        opacity="0.55"
      />
      {/* 中瓣 */}
      <path
        d="M24 10 C16.5 12 12 18.5 12.5 25.5 C13 31 16.5 35.5 21.5 37 C19 33.5 18.5 28.5 21 25 C23.5 28 27.5 29.5 31 27.5 C28.5 30.5 28.5 34.5 30.5 37.5 C34 35 36.5 31 36.5 26 C36.5 19 31.5 11.5 24 10 Z"
        fill="currentColor"
        opacity="0.75"
      />
      {/* 内芯 */}
      <path
        d="M24 15 C20.5 16 18.5 19 19 22.5 C19.5 25.5 22 27.5 25 27.5 C28 27.5 30 25 30 22 C29.5 18.5 27.5 16 24 15 Z"
        fill="currentColor"
      />
      {/* 芯心螺旋 */}
      <path
        d="M22.5 20 C24 18.5 26.5 19.5 27 21.5 C27.5 23.5 26 25.5 24 25 C22.5 24.5 21.5 23 22 21.5"
        stroke="oklch(0.97 0.005 285)"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}