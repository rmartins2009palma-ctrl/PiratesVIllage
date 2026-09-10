import Link from "next/link"
import { UserPlus, Search, ArrowRight } from "lucide-react"

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Primary: new registration */}
      <Link
        href="/register"
        className="group flex min-h-[132px] flex-col justify-between rounded-2xl bg-primary p-6 text-left text-primary-foreground shadow-sm transition-all hover:shadow-lg hover:brightness-110"
      >
        <div className="flex items-center justify-between">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/10">
            <UserPlus className="size-6" />
          </span>
          <ArrowRight className="size-5 opacity-60 transition-transform group-hover:translate-x-1" />
        </div>
        <div>
          <p className="font-serif text-xl font-semibold">New Registration</p>
          <p className="text-sm text-primary-foreground/70">
            Enrol a child for the first time this season
          </p>
        </div>
      </Link>

      {/* Secondary: quick check-in */}
      <Link
        href="/kids"
        className="group flex min-h-[132px] flex-col justify-between rounded-2xl border-2 border-accent bg-accent/10 p-6 text-left text-foreground shadow-sm transition-all hover:bg-accent/20 hover:shadow-lg"
      >
        <div className="flex items-center justify-between">
          <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Search className="size-6" />
          </span>
          <ArrowRight className="size-5 text-accent-foreground/60 transition-transform group-hover:translate-x-1" />
        </div>
        <div>
          <p className="font-serif text-xl font-semibold">Quick Check-in</p>
          <p className="text-sm text-muted-foreground">
            Find a registered child and sign them in
          </p>
        </div>
      </Link>
    </div>
  )
}
