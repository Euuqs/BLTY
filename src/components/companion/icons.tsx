import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return <IconBase {...props}><path d="M5 18.5 3.5 21l4-1.2A9 9 0 1 0 5 18.5Z" /><path d="M8 10h8M8 14h5" /></IconBase>;
}
export function CloseIcon(props: IconProps) {
  return <IconBase {...props}><path d="m6 6 12 12M18 6 6 18" /></IconBase>;
}
export function SendIcon(props: IconProps) {
  return <IconBase {...props}><path d="m4 4 17 8-17 8 3-8-3-8Z" /><path d="M7 12h14" /></IconBase>;
}
export function StopIcon(props: IconProps) {
  return <IconBase {...props}><rect x="7" y="7" width="10" height="10" rx="1.5" /></IconBase>;
}
export function TrashIcon(props: IconProps) {
  return <IconBase {...props}><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></IconBase>;
}
export function ArrowIcon(props: IconProps) {
  return <IconBase {...props}><path d="M5 12h14M14 7l5 5-5 5" /></IconBase>;
}

