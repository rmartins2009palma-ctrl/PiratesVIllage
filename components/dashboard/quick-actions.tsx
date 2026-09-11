import Link from "next/link"
import { ArrowRight, LogIn, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

const CARD_BASE =
  "group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-2xl p-7 text-left shadow-sm outline-none transition-all " +
  "hover:-translate-y-1 hover:shadow-xl hover:brightness-[1.06] " +
  "focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  // Honour the same reduced-motion contract as the keyframe animations.
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0"

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Primary: new registration — gold, the most frequent deliberate action */}
      <Link href="/register" className={cn(CARD_BASE, "bg-accent text-accent-foreground")}>
        <div className="flex items-start justify-between">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-accent-foreground/10">
            <UserPlus className="size-8" strokeWidth={2.1} />
          </span>
          <ArrowRight className="size-6 opacity-80 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
        </div>
        <div>
          <p className="font-serif text-2xl font-bold leading-tight">New Registration</p>
          <p className="mt-1 text-sm text-accent-foreground/90">
            Enrol a child for the first time this season
          </p>
        </div>
      </Link>

      {/* Secondary: quick check-in — navy */}
      <Link href="/kids" className={cn(CARD_BASE, "bg-primary text-primary-foreground")}>
        <div className="flex items-start justify-between">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <LogIn className="size-8" strokeWidth={2.1} />
          </span>
          <ArrowRight className="size-6 opacity-80 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
        </div>
        <div>
          <p className="font-serif text-2xl font-bold leading-tight">Quick Check-in</p>
          <p className="mt-1 text-sm text-primary-foreground/90">
            Find a registered child and sign them in
          </p>
        </div>
      </Link>
    </div>
  )
}
