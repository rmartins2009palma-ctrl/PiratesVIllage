import { LogIn, LogOut, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { RECENT_ACTIVITY, type ActivityType } from "@/lib/mock-data"

const CONFIG: Record<
  ActivityType,
  { icon: typeof LogIn; label: string; className: string }
> = {
  in: { icon: LogIn, label: "checked in", className: "bg-primary/10 text-primary" },
  out: { icon: LogOut, label: "checked out", className: "bg-muted text-muted-foreground" },
  registered: { icon: UserPlus, label: "registered", className: "bg-accent/20 text-accent-foreground" },
}

export function ActivityFeed() {
  return (
    <Card className="flex h-full flex-col border-border/70">
      <CardHeader className="border-b border-border/70 pb-4">
        <CardTitle className="font-serif text-lg">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        <ol className="flex flex-col">
          {RECENT_ACTIVITY.map((event, i) => {
            const cfg = CONFIG[event.type]
            const Icon = cfg.icon
            const isLast = i === RECENT_ACTIVITY.length - 1
            return (
              <li key={event.id} className="flex gap-3">
                {/* Timeline rail */}
                <div className="flex flex-col items-center">
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", cfg.className)}>
                    <Icon className="size-4" />
                  </span>
                  {!isLast && <span className="my-1 w-px flex-1 bg-border" />}
                </div>

                <div className={cn("min-w-0 flex-1", !isLast && "pb-4")}>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{event.kidName}</span>{" "}
                    <span className="text-muted-foreground">{cfg.label}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="tabular-nums">{event.time}</span>
                    {event.guardian && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="truncate">by {event.guardian}</span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
