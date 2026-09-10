"use client"

import { Compass } from "lucide-react"
import Image from "next/image"

export function KidsEmptyState({ hasSearch, searchTerm }: { hasSearch: boolean; searchTerm: string }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Image
          src="/compass-rose.png"
          alt=""
          width={80}
          height={80}
          className="animate-compass-spin opacity-30"
        />
        <div>
          <p className="font-serif text-lg font-semibold text-foreground">
            No adventurers found
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            No children match &ldquo;{searchTerm}&rdquo;. Try a different name or room number.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <Image
        src="/compass-rose.png"
        alt=""
        width={120}
        height={120}
        className="opacity-20"
      />
      <div>
        <p className="font-serif text-xl font-semibold text-foreground">
          No adventurers yet
        </p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Register the first crew member to begin!
        </p>
      </div>
    </div>
  )
}
