"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LogIn, LogOut, Pencil, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  type Kid,
  formatDate,
  formatDuration,
  fullName,
  kidInitials,
  primaryGuardian,
} from "@/lib/mock-data"
import { buildSiblingHref } from "@/lib/registration"
import { cn } from "@/lib/utils"
import { CompassRose } from "./compass-rose"

const TODAY_ISO = "2026-09-10"

/**
 * Starts as null so the server and the first client render agree; the live
 * elapsed time only appears once mounted.
 */
function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return now
}

function minutesSince(entryTime: string, now: Date): number {
  const [h, m] = entryTime.split(":").map(Number)
  return Math.max(0, now.getHours() * 60 + now.getMinutes() - (h * 60 + m))
}

/** Carries the room and primary guardian across to the registration form. */
export function addSiblingHref(kid: Kid): string {
  const guardian = primaryGuardian(kid)
  return buildSiblingHref({
    room: kid.room,
    guardianName: guardian?.fullName,
    guardianPhone: guardian?.phone,
    guardianEmail: guardian?.email,
  })
}

export function ChildHero({ kid, onCheckAction }: { kid: Kid; onCheckAction: (kid: Kid) => void }) {
  const now = useClock()
  const isIn = kid.status === "in"
  const elapsed = isIn && kid.entryTime && now ? minutesSince(kid.entryTime, now) : null
  const visitsToday = kid.history.filter((v) => v.date === TODAY_ISO).length

  const metaPills = [
    `${visitsToday} ${visitsToday === 1 ? "visit" : "visits"} today`,
    `${kid.visitsThisStay} total this stay`,
    `Registered on ${formatDate(kid.registeredOn)}`,
  ]

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-secondary/70 via-secondary/40 to-card">
      <CompassRose className="absolute -right-16 top-1/2 size-[340px] -translate-y-1/2 opacity-[0.07]" />

      <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-24 shrink-0 border-2 border-accent/50 shadow-sm sm:size-28">
            <AvatarFallback className="bg-secondary font-serif text-3xl font-bold tracking-wide text-primary sm:text-4xl">
              {kidInitials(kid)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col gap-2">
            <div>
              <h1 className="text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {fullName(kid)}
              </h1>
              <p className="mt-0.5 text-base text-muted-foreground">
                {kid.age} years old · Room {kid.room}
              </p>
            </div>

            {/* Presence */}
            <div className="flex">
              {isIn ? (
                <span className="flex items-center gap-2 rounded-full bg-success/12 px-3 py-1.5 text-sm text-success">
                  <span className="size-2 shrink-0 rounded-full bg-success" />
                  <span className="font-semibold uppercase tracking-wide">In club</span>
                  {kid.entryTime && (
                    <span className="text-success/80">
                      since <span className="font-mono tabular-nums">{kid.entryTime}</span>
                      {elapsed !== null && ` (${formatDuration(elapsed)} elapsed)`}
                    </span>
                  )}
                </span>
              ) : (
                <span className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                  <span className="size-2 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span className="font-semibold uppercase tracking-wide">Out</span>
                  <span>· last visit {formatDate(kid.lastVisit)}</span>
                </span>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-2">
              {metaPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col items-stretch gap-2 lg:w-56">
          <Button
            size="lg"
            className={cn(
              "h-11 justify-center bg-accent px-5 text-base font-semibold text-accent-foreground",
              "hover:brightness-105",
            )}
            onClick={() => onCheckAction(kid)}
          >
            {isIn ? <LogOut data-icon="inline-start" /> : <LogIn data-icon="inline-start" />}
            {isIn ? "Check-out" : "Check-in"}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-11 justify-center px-5"
            render={<Link href={addSiblingHref(kid)} />}
          >
            <UserPlus data-icon="inline-start" />
            Add sibling
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="justify-center text-muted-foreground hover:text-foreground"
          >
            <Pencil data-icon="inline-start" />
            Edit information
          </Button>
        </div>
      </div>
    </section>
  )
}
