import { CURRENT_USER, KIDS } from "@/lib/mock-data"
import { PresencePanel } from "./presence-panel"
import { QuickActions } from "./quick-actions"
import { StatCards } from "./stat-cards"
import { ActivityFeed } from "./activity-feed"

export function Dashboard() {
  const inClub = KIDS.filter((k) => k.status === "in")

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Ahoy, {CURRENT_USER.name.split(" ")[0]}
        </h2>
        <p className="text-sm text-muted-foreground">
          Here's what's happening at the club right now.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main column */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          <PresencePanel kids={inClub} />
          <QuickActions />
          <StatCards />
        </div>

        {/* Activity rail */}
        <div className="xl:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
