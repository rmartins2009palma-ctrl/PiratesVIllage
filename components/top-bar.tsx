"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CURRENT_USER, HOTEL } from "@/lib/mock-data"

function useClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return now
}

function formatDateTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1)
  const year = date.getFullYear()
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  return { date: `${day}/${month}/${year}`, time }
}

export function TopBar() {
  const now = useClock()
  const stamp = now ? formatDateTime(now) : null

  return (
    <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-6">
      {/* Location / context */}
      <div className="flex flex-col">
        <p className="font-serif text-lg font-semibold leading-tight text-foreground">
          {HOTEL.name} {HOTEL.club}
        </p>
        <p className="text-sm text-muted-foreground">{HOTEL.location}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Date & time */}
        <div className="hidden text-right sm:block">
          <p className="text-lg font-semibold tabular-nums leading-tight text-foreground">
            {stamp ? stamp.time : "--:--"}
          </p>
          <p className="text-xs text-muted-foreground">{stamp ? stamp.date : "--/--/----"}</p>
        </div>

        <Separator orientation="vertical" className="hidden h-10 sm:block" />

        {/* Language selector */}
        <button
          type="button"
          className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Change language, current language English"
        >
          <Globe className="size-4 text-muted-foreground" />
          <span>EN</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 rounded-lg py-1 pl-1 pr-3 transition-colors hover:bg-secondary">
          <Avatar className="size-10 border-2 border-accent/60">
            <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
              {CURRENT_USER.initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold leading-tight text-foreground">{CURRENT_USER.name}</p>
            <p className="text-xs text-muted-foreground">{CURRENT_USER.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
