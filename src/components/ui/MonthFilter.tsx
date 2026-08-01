"use client";

interface MonthFilterProps {
  months: string[];
  selectedMonth: string | null;
  onSelectMonth: (month: string | null) => void;
  label?: string;
}

export function MonthFilter({ months, selectedMonth, onSelectMonth, label = "全部" }: MonthFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectMonth(null)}
        className={`text-[10px] font-mono px-3 py-1.5 rounded-full border transition-all ${
          selectedMonth === null
            ? "bg-cp text-background border-cp"
            : "bg-transparent text-muted border-border hover:border-cp/50 hover:text-cp/80"
        }`}
      >
        {label}
      </button>
      {months.map((month) => (
        <button
          key={month}
          onClick={() => onSelectMonth(month)}
          className={`text-[10px] font-mono px-3 py-1.5 rounded-full border transition-all ${
            selectedMonth === month
              ? "bg-cp text-background border-cp"
              : "bg-transparent text-muted border-border hover:border-cp/50 hover:text-cp/80"
          }`}
        >
          {month}
        </button>
      ))}
    </div>
  );
}
