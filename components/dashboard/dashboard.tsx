import { CURRENT_USER, KIDS } from "@/lib/mock-data"
import { ActivityFeed } from "./activity-feed"
import { PresenceSummary } from "./presence-summary"
import { QuickActions } from "./quick-actions"
import { StatCards } from "./stat-cards"

export function Dashboard() {
  const inClub = KIDS.filter((k) => k.status === "in")

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-6">
      <div>
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">
              Ahoy, {CURRENT_USER.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-muted-foreground">
              Here's what's happening at the club right now.
            </p>
          </div>
          <PresenceSummary count={inClub.length} />
        </div>
      </div>

      {/* The visual anchor of the page */}
      <QuickActions />

      {/* Secondary */}
      <StatCards />

      {/* Tertiary */}
      <ActivityFeed />
    </div>
  )
}
