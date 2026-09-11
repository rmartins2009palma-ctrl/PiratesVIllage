"use client"

import Link from "next/link"
import { LogIn, LogOut, TriangleAlert } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HOTEL_CONFIG } from "@/lib/hotel-config"
import { type Kid, fullName, kidInitials } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function KidGridCard({ kid, onCheckAction }: { kid: Kid; onCheckAction?: (kid: Kid) => void }) {
  const card = HOTEL_CONFIG.displayFields.kidCard
  const hasAlert = Boolean(kid.allergies || kid.medical)
  const alertText = kid.allergies ?? kid.medical ?? ""
  const isIn = kid.status === "in"

  return (
    // `relative` anchors the stretched link below: the whole card is clickable,
    // while the action button sits above it on its own z-layer.
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:border-accent hover:shadow-card-hover focus-within:border-accent">
      {card.showAllergyIcon && hasAlert && (
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-full bg-warning/15 text-warning">
                <TriangleAlert className="size-4" />
                <span className="sr-only">Has medical alerts</span>
              </span>
            }
          />
          <TooltipContent side="left" className="max-w-[220px]">
            {alertText}
          </TooltipContent>
        </Tooltip>
      )}

      <div className="flex items-center gap-3">
        <Avatar className="size-14 shrink-0 border-2 border-accent/40">
          <AvatarFallback className="bg-secondary text-lg font-semibold text-primary">
            {kidInitials(kid)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <Link
            href={`/kids/${kid.id}`}
            className="truncate rounded font-serif text-base font-semibold text-foreground outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline focus-visible:decoration-accent focus-visible:decoration-2 focus-visible:underline-offset-4"
          >
            {fullName(kid)}
          </Link>
          <p className="text-sm text-muted-foreground">
            {kid.age} years · Room {kid.room}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        {isIn ? (
          <span className="flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-xs font-medium text-success">
            <span className="size-2 rounded-full bg-success" />
            In club
            {card.showEntryTimeInStatus && kid.entryTime && (
              <span className="tabular-nums text-success">· {kid.entryTime}</span>
            )}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-2 rounded-full bg-muted-foreground/50" />
            Out
          </span>
        )}
        {card.showVisitCount && (
          <span className="ml-auto rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {kid.visitsThisStay} {kid.visitsThisStay === 1 ? "visit" : "visits"}
          </span>
        )}
      </div>

      {/* z-10 lifts the button clear of the stretched link's overlay. */}
      <div className="relative z-10 mt-1">
        <Button
          variant={isIn ? "outline" : "default"}
          size="sm"
          className="w-full"
          onClick={() => onCheckAction?.(kid)}
        >
          {isIn ? <LogOut data-icon="inline-start" /> : <LogIn data-icon="inline-start" />}
          {isIn ? "Check-out" : "Check-in"}
          <span className="sr-only"> {fullName(kid)}</span>
        </Button>
      </div>
    </div>
  )
}
