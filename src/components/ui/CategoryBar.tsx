interface CategoryBarProps {
  items: { label: string; count: number }[];
  total: number;
}

export function CategoryBar({ items, total }: CategoryBarProps) {
  if (total === 0) return null;
  return (
    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/60">
      {items.map((item) => {
        const pct = Math.round((item.count / total) * 100);
        return (
          <div key={item.label} className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-muted w-7 shrink-0">{item.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-surface-3 overflow-hidden">
              <div
                className={"h-full rounded-full cover-bar-" + item.label}
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            <span className="font-mono text-[9px] text-muted/70 w-5 text-right shrink-0">{item.count}</span>
          </div>
        );
      })}
    </div>
  );
}
