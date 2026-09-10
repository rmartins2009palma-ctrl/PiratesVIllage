"use client"

import Link from "next/link"
import { LogIn, LogOut, TriangleAlert } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type Kid, fullName, kidInitials, formatDate } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function minutesSince(entryTime: string): number {
  const [h, m] = entryTime.split(":").map(Number)
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() - (h * 60 + m)
}

export function KidListRow({ kid, onCheckAction }: { kid: Kid; onCheckAction?: (kid: Kid) => void }) {
  const hasAlert = Boolean(kid.allergies || kid.medical)
  const alertText = kid.allergies ?? kid.medical ?? ""
  const longStay = kid.status === "in" && kid.entryTime && minutesSince(kid.entryTime) > 180

  return (
    <div
      className={cn(
        "group grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 rounded-xl border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-secondary/40",
        longStay && "animate-pulse-attention",
      )}
    >
      <Avatar className="size-10 border-2 border-accent/30">
        <AvatarFallback className="bg-secondary text-sm font-semibold text-primary">
          {kidInitials(kid)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{fullName(kid)}</p>
          {hasAlert && (
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
                  <TriangleAlert className="size-3" />
                </span>
              }
            />
            <TooltipContent side="top" className="max-w-[200px]">{alertText}</TooltipContent>
          </Tooltip>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{kid.age} years</p>
      </div>

      <div className="hidden text-sm text-muted-foreground sm:block">Room {kid.room}</div>

      <div>
        {kid.status === "in" ? (
          <span className="flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-xs font-medium text-success">
            <span className="size-2 rounded-full bg-success" />
            In club
            {kid.entryTime && <span className="font-mono tabular-nums text-success/70">{kid.entryTime}</span>}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-2 rounded-full bg-muted-foreground/50" />
            Out
          </span>
        )}
      </div>

      <div className="hidden text-xs text-muted-foreground md:block">
        {formatDate(kid.lastVisit)}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="hidden rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground lg:block">
          {kid.visitsThisStay} visits
        </span>
        {kid.status === "in" ? (
          <Button variant="outline" size="sm" onClick={() => onCheckAction?.(kid)}>
            <LogOut data-icon="inline-start" />
            <span className="hidden sm:inline">Check out</span>
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={() => onCheckAction?.(kid)}>
            <LogIn data-icon="inline-start" />
            <span className="hidden sm:inline">Check in</span>
          </Button>
        )}
        <Button variant="ghost" size="sm" render={<Link href={`/kids/${kid.id}`} />}>
          <span className="sr-only sm:not-sr-only">Details</span>
        </Button>
      </div>
    </div>
  )
}
