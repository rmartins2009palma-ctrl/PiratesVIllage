"use client"

import Link from "next/link"
import { ArrowRight, Medal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { type TopVisitor, findKid, formatDuration, fullName, kidInitials } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

/** Gold, silver, bronze for the podium; plain rank number after that. */
const MEDAL_TONE = ["text-accent", "text-muted-foreground", "text-warning"]

export function TopVisitors({ visitors }: { visitors: TopVisitor[] }) {
  const rows = visitors
    .map((v) => ({ ...v, kid: findKid(v.kidId) }))
    .filter((v) => v.kid !== undefined)

  if (rows.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No visits recorded in this period.
      </p>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="hidden grid-cols-[2.5rem_1fr_4rem_4rem_5.5rem] gap-3 border-b border-border px-3 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
        <span>Rank</span>
        <span>Child</span>
        <span className="text-right">Age</span>
        <span className="text-right">Visits</span>
        <span className="text-right">Total time</span>
      </div>

      <ul className="flex flex-col">
        {rows.map((row, index) => {
          const kid = row.kid!
          return (
            <li
              key={row.kidId}
              className="relative grid grid-cols-[2.5rem_1fr_4rem_4rem_5.5rem] items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary/40 focus-within:bg-secondary/40"
            >
              <span className="flex items-center">
                {index < 3 ? (
                  <>
                    <Medal className={cn("size-4", MEDAL_TONE[index])} aria-hidden />
                    <span className="sr-only">Rank {index + 1}</span>
                  </>
                ) : (
                  <span className="text-sm tabular-nums text-muted-foreground">{index + 1}</span>
                )}
              </span>

              <span className="flex min-w-0 items-center gap-2.5">
                <Avatar className="size-8 shrink-0 border-2 border-accent/30">
                  <AvatarFallback className="bg-secondary text-xs font-semibold text-primary">
                    {kidInitials(kid)}
                  </AvatarFallback>
                </Avatar>
                {/* Stretched link: the whole row is the target, one anchor only. */}
                <Link
                  href={`/kids/${kid.id}`}
                  className="truncate rounded text-sm font-medium text-foreground outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline focus-visible:decoration-accent focus-visible:decoration-2 focus-visible:underline-offset-4"
                >
                  {fullName(kid)}
                </Link>
              </span>

              <span className="text-right text-sm tabular-nums text-muted-foreground">
                {kid.age}
              </span>
              <span className="text-right text-sm font-semibold tabular-nums text-foreground">
                {row.visits}
              </span>
              <span className="text-right text-sm tabular-nums text-muted-foreground">
                {formatDuration(row.totalMinutes)}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="mt-2 flex justify-end border-t border-border pt-2">
        <Link
          href="/kids"
          className="group flex items-center gap-1 rounded text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          View all
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
        </Link>
      </div>
    </div>
  )
}
