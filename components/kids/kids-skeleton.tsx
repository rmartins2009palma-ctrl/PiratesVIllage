"use client"

export function KidCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="size-14 shrink-0 animate-shimmer rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-28 animate-shimmer rounded" />
          <div className="h-3 w-20 animate-shimmer rounded" />
        </div>
      </div>
      <div className="h-6 w-32 animate-shimmer rounded-full" />
      <div className="flex gap-2">
        <div className="h-7 flex-1 animate-shimmer rounded-lg" />
        <div className="h-7 w-20 animate-shimmer rounded-lg" />
      </div>
    </div>
  )
}

export function KidRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl px-4 py-3">
      <div className="size-10 shrink-0 animate-shimmer rounded-full" />
      <div className="flex flex-1 items-center gap-2">
        <div className="h-4 w-32 animate-shimmer rounded" />
      </div>
      <div className="h-3 w-16 animate-shimmer rounded" />
      <div className="h-6 w-20 animate-shimmer rounded-full" />
      <div className="h-7 w-20 animate-shimmer rounded-lg" />
    </div>
  )
}

export function KidsSkeleton({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="flex flex-col gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <KidRowSkeleton key={i} />
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <KidCardSkeleton key={i} />
      ))}
    </div>
  )
}
