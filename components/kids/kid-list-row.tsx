"use client"

import Link from "next/link"
import { LogIn, LogOut, TriangleAlert } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HOTEL_CONFIG } from "@/lib/hotel-config"
import { type Kid, fullName, kidInitials, formatDate } from "@/lib/mock-data"

export function KidListRow({ kid, onCheckAction }: { kid: Kid; onCheckAction?: (kid: Kid) => void }) {
  const card = HOTEL_CONFIG.displayFields.kidCard
  const hasAlert = Boolean(kid.allergies || kid.medical)
  const alertText = kid.allergies ?? kid.medical ?? ""
  const isIn = kid.status === "in"

  return (
    <div className="group relative grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 rounded-xl border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-secondary/40 focus-within:border-border">
      <Avatar className="size-10 border-2 border-accent/30">
        <AvatarFallback className="bg-secondary text-sm font-semibold text-primary">
          {kidInitials(kid)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/kids/${kid.id}`}
            className="truncate rounded text-sm font-semibold text-foreground outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline focus-visible:decoration-accent focus-visible:decoration-2 focus-visible:underline-offset-4"
          >
            {fullName(kid)}
          </Link>
          {card.showAllergyIcon && hasAlert && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
                    <TriangleAlert className="size-3" />
                    <span className="sr-only">Has medical alerts</span>
                  </span>
                }
              />
              <TooltipContent side="top" className="max-w-[200px]">
                {alertText}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{kid.age} years</p>
      </div>

      <div className="hidden text-sm text-muted-foreground sm:block">Room {kid.room}</div>

      <div>
        {isIn ? (
          <span className="flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-xs font-medium text-success">
            <span className="size-2 rounded-full bg-success" />
            In club
            {card.showEntryTimeInStatus && kid.entryTime && (
              <span className="tabular-nums text-success">{kid.entryTime}</span>
            )}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-2 rounded-full bg-muted-foreground/50" />
            Out
          </span>
        )}
      </div>

      <div className="hidden text-xs text-muted-foreground md:block">{formatDate(kid.lastVisit)}</div>

      <div className="relative z-10 flex items-center gap-1.5">
        {card.showVisitCount && (
          <span className="hidden rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground lg:block">
            {kid.visitsThisStay} visits
          </span>
        )}
        <Button
          variant={isIn ? "outline" : "default"}
          size="sm"
          onClick={() => onCheckAction?.(kid)}
        >
          {isIn ? <LogOut data-icon="inline-start" /> : <LogIn data-icon="inline-start" />}
          <span className="hidden sm:inline">{isIn ? "Check-out" : "Check-in"}</span>
          <span className="sr-only"> {fullName(kid)}</span>
        </Button>
      </div>
    </div>
  )
}
