"use client"

import { useState } from "react"
import { ChevronDown, LogIn, LogOut, UserPlus } from "lucide-react"
import { RECENT_ACTIVITY, type ActivityType } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const CONFIG: Record<ActivityType, { icon: typeof LogIn; label: string; className: string }> = {
  in: { icon: LogIn, label: "checked in", className: "bg-primary/10 text-primary" },
  out: { icon: LogOut, label: "checked out", className: "bg-muted text-muted-foreground" },
  registered: {
    icon: UserPlus,
    label: "registered",
    className: "bg-accent/25 text-accent-foreground",
  },
}

export function ActivityFeed() {
  const [open, setOpen] = useState(false)
  const latest = RECENT_ACTIVITY[0]
  const count = RECENT_ACTIVITY.length

  return (
    <section className="rounded-2xl border border-border bg-card shadow-card">
      <h2>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="recent-activity-panel"
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="font-serif text-base font-semibold text-foreground">
            Recent activity
          </span>
          {/* An absolute time, not "5 minutes ago": a relative string is computed
              at render and would differ between server and client. */}
          {latest && !open && (
            <span className="min-w-0 truncate text-sm text-muted-foreground">
              Latest: {latest.kidName} {CONFIG[latest.type].label} at{" "}
              <span className="tabular-nums">{latest.time}</span>
            </span>
          )}
          <span className="ml-auto flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
              {count}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform motion-reduce:transition-none",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </span>
        </button>
      </h2>

      <div id="recent-activity-panel" hidden={!open}>
        <ol className="max-h-[200px] overflow-y-auto border-t border-border px-4 py-3">
          {RECENT_ACTIVITY.map((event, i) => {
            const cfg = CONFIG[event.type]
            const Icon = cfg.icon
            const isLast = i === RECENT_ACTIVITY.length - 1
            return (
              <li key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      cfg.className,
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  {!isLast && <span className="my-1 w-px flex-1 bg-border" />}
                </div>

                <div className={cn("min-w-0 flex-1", !isLast && "pb-3")}>
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
      </div>
    </section>
  )
}
