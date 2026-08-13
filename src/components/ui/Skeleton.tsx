"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bento-tile p-0 overflow-hidden">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="bento-tile p-5">
      <div className="flex gap-4">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}
