import { Repeat, Timer, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { TODAY_STATS, formatDuration } from "@/lib/mock-data"

const STATS = [
  {
    label: "Today's total visits",
    value: String(TODAY_STATS.totalVisits),
    hint: "check-ins so far",
    icon: Repeat,
  },
  {
    label: "Average stay today",
    value: formatDuration(TODAY_STATS.averageStayMinutes),
    hint: "per adventurer",
    icon: Timer,
  },
  {
    label: "Unique kids today",
    value: String(TODAY_STATS.uniqueKids),
    hint: "distinct children",
    icon: Users,
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STATS.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} size="sm" className="border-border/70">
            <CardContent className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/70 text-muted-foreground">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold leading-tight tabular-nums text-foreground">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
