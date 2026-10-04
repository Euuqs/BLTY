type ChannelTone = "bai" | "zhu" | "shared" | "fan";

interface ChannelDividerProps {
  label: string;
  note: string;
  tone?: ChannelTone;
}

export function ChannelDivider({ label, note, tone = "shared" }: ChannelDividerProps) {
  return (
    <div className={`channel-divider is-${tone}`} aria-hidden="true">
      <span className="channel-divider-dot" />
      <span className="channel-divider-label">{label}</span>
      <span className="channel-divider-line" />
      <span className="channel-divider-note">{note}</span>
    </div>
  );
}
