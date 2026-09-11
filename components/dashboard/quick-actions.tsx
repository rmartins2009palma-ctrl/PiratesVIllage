import Link from "next/link"
import { ArrowRight, LogIn, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

// Hero-sized: these are the two things Marina came to the dashboard to do, and
// they should win the page before she has read a word.
const CARD_BASE =
  "group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl p-8 text-left shadow-card outline-none transition-all sm:min-h-[260px] " +
  "hover:-translate-y-1 hover:shadow-card-hover hover:brightness-[1.06] " +
  "active:translate-y-0 active:brightness-[0.98] " +
  "focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0"

const ARROW =
  "size-7 opacity-80 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Link href="/register" className={cn(CARD_BASE, "bg-accent text-accent-foreground")}>
        <div className="flex items-start justify-between">
          <span className="flex size-20 items-center justify-center rounded-2xl bg-accent-foreground/10">
            <UserPlus className="size-11" strokeWidth={1.9} aria-hidden />
          </span>
          <ArrowRight className={ARROW} aria-hidden />
        </div>
        <div>
          <p className="font-serif text-3xl font-bold leading-tight">New Registration</p>
          <p className="mt-1.5 text-base text-accent-foreground/90">
            Enrol a child for the first time this season
          </p>
        </div>
      </Link>

      <Link href="/kids" className={cn(CARD_BASE, "bg-primary text-primary-foreground")}>
        <div className="flex items-start justify-between">
          <span className="flex size-20 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <LogIn className="size-11" strokeWidth={1.9} aria-hidden />
          </span>
          <ArrowRight className={ARROW} aria-hidden />
        </div>
        <div>
          <p className="font-serif text-3xl font-bold leading-tight">Quick Check-in</p>
          <p className="mt-1.5 text-base text-primary-foreground/90">
            Find a registered child and sign them in
          </p>
        </div>
      </Link>
    </div>
  )
}
