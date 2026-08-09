import { DogMascot, PigMascot } from "@/components/mascot/Mascots";

interface EmptyStateProps {
  message: string;
  hint?: string;
  member?: "A" | "B" | "both";
}

export function EmptyState({ message, hint, member = "both" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex items-center">
        <DogMascot
          className={`mascot-float w-16 h-16 ${member === "B" ? "opacity-20" : "opacity-70"}`}
        />
        <PigMascot
          className={`mascot-float mascot-float-delayed w-16 h-16 -ml-3 ${member === "A" ? "opacity-20" : "opacity-70"}`}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="font-serif text-lg text-foreground/80">{message}</p>
        {hint && <p className="text-xs font-mono text-muted">{hint}</p>}
      </div>
    </div>
  );
}
