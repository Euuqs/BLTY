import type { ReactNode } from "react";

type MetaIconName =
  | "lightbulb" | "pin" | "clock" | "calendar" | "ticket" | "stadium"
  | "screen" | "wall" | "flower" | "flag" | "camera" | "sign" | "metro"
  | "car" | "bus" | "walk" | "microphone" | "sparkles" | "clipboard" | "balloon";

const paths: Record<MetaIconName, ReactNode> = {
  lightbulb: <><path d="M9 18h6" /><path d="M10 21h4" /><path d="M8.2 14.8A6 6 0 1 1 15.8 14.8c-.9.8-1.4 1.7-1.6 3.2h-4.4c-.2-1.5-.7-2.4-1.6-3.2Z" /></>,
  pin: <><path d="M19 10c0 4.5-7 10-7 10S5 14.5 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M7.5 3.5v3M16.5 3.5v3M3.5 9h17" /></>,
  ticket: <><path d="M4 7.5a2 2 0 0 0 0 4v1a2 2 0 0 0 0 4h16v-4a2 2 0 0 0 0-4v-1a2 2 0 0 0 0-4H4Z" /><path d="M12 7.5v1M12 11v1M12 14.5v1" /></>,
  stadium: <><path d="M3 18.5h18M5 18.5V10l7-4 7 4v8.5M8 18.5v-5h8v5" /></>,
  screen: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 21h8M12 19v2" /><path d="m9 10 2 2 4-4" /></>,
  wall: <><path d="M4 4h16v16H4zM4 10h16M10 4v16" /></>,
  flower: <><circle cx="12" cy="10" r="2" /><path d="M12 8c-4-5-8 1-3 3-5 2-1 7 3 3 4 4 8-1 3-3 5-2 1-8-3-3ZM12 12v8M9 20h6" /></>,
  flag: <><path d="M6 21V4" /><path d="M6 5c4-3 7 3 12 0v9c-5 3-8-3-12 0" /></>,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13.5" r="3.2" /></>,
  sign: <><path d="M5 4h14v7H5zM12 11v9M8 20h8" /><path d="M8 7h8" /></>,
  metro: <><path d="M6 18V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v11" /><path d="M6 14h12M8 21l2-3M16 18l2 3" /><circle cx="9" cy="10" r="1" /><circle cx="15" cy="10" r="1" /></>,
  car: <><path d="m5 16 1.5-6h11L19 16v3H5v-3Z" /><path d="M7 10 8.5 6h7l1.5 4M5 14h14" /><circle cx="8" cy="19" r="1.5" /><circle cx="16" cy="19" r="1.5" /></>,
  bus: <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M5 13h14M8 17h.01M16 17h.01M8 8h8" /></>,
  walk: <><circle cx="13" cy="5" r="2" /><path d="m11 9 3 2 2 4M11 9l-2 5-3 4M12 12l-1 5 3 3" /></>,
  microphone: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11.5a7 7 0 0 0 14 0M12 18.5V21" /></>,
  sparkles: <><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5V3h6v1.5M8 9h8M8 13h8M8 17h5" /></>,
  balloon: <><path d="M12 3c-3.5 0-5.5 2.8-5.5 6 0 3.2 2.3 5.5 5.5 5.5s5.5-2.3 5.5-5.5c0-3.2-2-6-5.5-6Z" /><path d="M12 14.5v3M10.5 21h3M12 17.5l-1.5 3.5" /></>,
};

export function MetaIcon({ name, className = "" }: { name: string; className?: string }) {
  const node = paths[name as MetaIconName] ?? paths.sparkles;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {node}
    </svg>
  );
}
