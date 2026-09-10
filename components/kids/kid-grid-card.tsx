"use client"

import Link from "next/link"
import { Clock, LogIn, LogOut, TriangleAlert, UserRound, ArrowRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type Kid, fullName, kidInitials } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function minutesSince(entryTime: string): number {
  const [h, m] = entryTime.split(":").map(Number)
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() - (h * 60 + m)
}

export function KidGridCard({ kid, onCheckAction }: { kid: Kid; onCheckAction?: (kid: Kid) => void }) {
  const hasAlert = Boolean(kid.allergies || kid.medical)
  const alertText = kid.allergies ?? kid.medical ?? ""
  const longStay = kid.status === "in" && kid.entryTime && minutesSince(kid.entryTime) > 180

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:border-accent hover:shadow-lg",
        longStay && "animate-pulse-attention",
      )}
    >
      {hasAlert && (
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-warning/15 text-warning">
                <TriangleAlert className="size-4" />
              </span>
            }
          />
          <TooltipContent side="left" className="max-w-[220px]">{alertText}</TooltipContent>
        </Tooltip>
      )}

      <div className="flex items-center gap-3">
        <Avatar className="size-14 border-2 border-accent/40">
          <AvatarFallback className="bg-secondary text-lg font-semibold text-primary">
            {kidInitials(kid)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-serif text-base font-semibold text-foreground">
            {fullName(kid)}
          </p>
          <p className="text-sm text-muted-foreground">
            {kid.age} years · Room {kid.room}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {kid.status === "in" ? (
          <span className="flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-xs font-medium text-success">
            <span className="size-2 rounded-full bg-success" />
            In club
            {kid.entryTime && (
              <span className="font-mono tabular-nums text-success/70">· {kid.entryTime}</span>
            )}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-2 rounded-full bg-muted-foreground/50" />
            Checked out
          </span>
        )}
        <span className="ml-auto rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {kid.visitsThisStay} {kid.visitsThisStay === 1 ? "visit" : "visits"}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-2">
        {kid.status === "in" ? (
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onCheckAction?.(kid)}>
            <LogOut data-icon="inline-start" />
            Check out
          </Button>
        ) : (
          <Button variant="default" size="sm" className="flex-1" onClick={() => onCheckAction?.(kid)}>
            <LogIn data-icon="inline-start" />
            Check in
          </Button>
        )}
        <Button variant="ghost" size="sm" render={<Link href={`/kids/${kid.id}`} />}>
          <UserRound data-icon="inline-start" />
          Details
          <ArrowRight data-icon="inline-end" className="size-3 opacity-50 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  )
}
