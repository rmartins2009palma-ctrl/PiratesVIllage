import Link from "next/link"
import { Anchor, ArrowRight } from "lucide-react"

/**
 * Deliberately a single sentence, not a panel. Browsing children belongs to the
 * Kids section; the dashboard only needs to say how busy the club is right now.
 */
export function PresenceSummary({ count }: { count: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <Anchor className="size-4" />
      </span>
      <p className="text-muted-foreground">
        <span className="font-semibold tabular-nums text-foreground">{count}</span>{" "}
        {count === 1 ? "adventurer" : "adventurers"} currently in the club
      </p>
      <Link
        href="/kids"
        className="group flex items-center gap-1 rounded font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        View all
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
      </Link>
    </div>
  )
}
