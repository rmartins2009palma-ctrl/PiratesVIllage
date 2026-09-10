"use client"

import { useCallback, useMemo, useState } from "react"
import { ArrowRight, Calendar, ChevronDown, Download, PenLine, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type Kid,
  type Visit,
  formatDate,
  formatDuration,
  fullName,
  visitStatus,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const TODAY_ISO = "2026-09-10"

type RangeId = "today" | "week" | "stay" | "all"

const RANGES: { id: RangeId; label: string }[] = [
  { id: "stay", label: "This stay" },
  { id: "today", label: "Today" },
  { id: "week", label: "Last 7 days" },
  { id: "all", label: "All time" },
]

/** ISO dates are compared as UTC so the label never shifts with the timezone. */
function daysBetween(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  return Math.round((b - a) / 86_400_000)
}

function dayLabel(iso: string): string {
  const diff = daysBetween(iso, TODAY_ISO)
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  const weekday = new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    timeZone: "UTC",
  })
  const [, month, day] = iso.split("-")
  return `${weekday} ${day}/${month}`
}

function inRange(visit: Visit, range: RangeId, registeredOn: string): boolean {
  const age = daysBetween(visit.date, TODAY_ISO)
  switch (range) {
    case "today":
      return age === 0
    case "week":
      return age >= 0 && age < 7
    case "stay":
      return visit.date >= registeredOn
    default:
      return true
  }
}

const DOT_TONE: Record<ReturnType<typeof visitStatus>, string> = {
  completed: "bg-success",
  ongoing: "bg-warning",
  anomaly: "bg-destructive",
}

const STATUS_LABEL: Record<ReturnType<typeof visitStatus>, string> = {
  completed: "Completed",
  ongoing: "In club now",
  anomaly: "Needs review",
}

function toCsv(visits: Visit[]): string {
  const escape = (value: string | number) => {
    const text = String(value)
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const header = [
    "Date",
    "Check-in",
    "Check-out",
    "Duration",
    "Signed by",
    "Registered by",
    "Status",
  ]
  const rows = visits.map((v) => [
    formatDate(v.date),
    v.checkIn,
    v.checkOut ?? "",
    formatDuration(v.durationMinutes),
    v.signedBy,
    v.registeredBy ?? "",
    STATUS_LABEL[visitStatus(v)],
  ])
  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n")
}

function VisitRow({ visit, isLast }: { visit: Visit; isLast: boolean }) {
  const [open, setOpen] = useState(false)
  const status = visitStatus(visit)
  const ongoing = status === "ongoing"

  return (
    <li className="relative flex gap-3 pb-2 last:pb-0">
      {/* Timeline rail */}
      <span className="relative flex w-4 shrink-0 justify-center" aria-hidden>
        <span
          className={cn(
            "absolute left-1/2 w-px -translate-x-1/2 bg-border",
            isLast ? "top-0 h-5" : "inset-y-0",
          )}
        />
        <span
          className={cn(
            "relative mt-3.5 size-3 rounded-full ring-4 ring-background",
            DOT_TONE[status],
          )}
        />
      </span>

      <div className="min-w-0 flex-1 rounded-xl border border-border bg-card">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full min-h-11 flex-wrap items-center gap-x-3 gap-y-1 rounded-xl px-4 py-2.5 text-left transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex items-center gap-2 font-mono text-sm font-semibold tabular-nums text-foreground">
            {visit.checkIn}
            <ArrowRight className="size-3.5 text-muted-foreground" />
            {ongoing ? (
              <span className="font-sans font-medium text-warning">in club</span>
            ) : (
              visit.checkOut
            )}
          </span>

          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              ongoing ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {formatDuration(visit.durationMinutes)}
          </span>

          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <PenLine className="size-3.5 shrink-0" />
            {visit.signedBy}
          </span>

          {visit.registeredBy && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <UserRound className="size-3.5 shrink-0" />
              {visit.registeredBy}
            </span>
          )}

          <ChevronDown
            className={cn(
              "ml-auto size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div className="flex flex-col gap-2 border-t border-border px-4 py-3 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span className="text-muted-foreground">
                Date <span className="text-foreground">{formatDate(visit.date)}</span>
              </span>
              <span className="text-muted-foreground">
                Status{" "}
                <span
                  className={cn(
                    "font-medium",
                    status === "anomaly"
                      ? "text-destructive"
                      : status === "ongoing"
                        ? "text-warning"
                        : "text-success",
                  )}
                >
                  {STATUS_LABEL[status]}
                </span>
              </span>
              <span className="text-muted-foreground">
                Signed by <span className="text-foreground">{visit.signedBy}</span>
              </span>
              {visit.registeredBy && (
                <span className="text-muted-foreground">
                  Registered by <span className="text-foreground">{visit.registeredBy}</span>
                </span>
              )}
            </div>
            {visit.anomalyReason && (
              <p className="rounded-lg border border-destructive/25 bg-destructive/8 px-3 py-2 text-destructive">
                {visit.anomalyReason}
              </p>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

export function TabVisits({ kid }: { kid: Kid }) {
  const [range, setRange] = useState<RangeId>("stay")

  const visits = useMemo(
    () => kid.history.filter((v) => inRange(v, range, kid.registeredOn)),
    [kid.history, kid.registeredOn, range],
  )

  const groups = useMemo(() => {
    const byDate = new Map<string, Visit[]>()
    for (const visit of visits) {
      const bucket = byDate.get(visit.date)
      if (bucket) bucket.push(visit)
      else byDate.set(visit.date, [visit])
    }
    return [...byDate.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, items]) => ({
        date,
        label: dayLabel(date),
        visits: [...items].sort((a, b) => b.checkIn.localeCompare(a.checkIn)),
      }))
  }, [visits])

  const handleExport = useCallback(() => {
    const blob = new Blob([toCsv(visits)], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${fullName(kid).toLowerCase().replace(/\s+/g, "-")}-visits.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }, [kid, visits])

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0 text-muted-foreground" />
          <Select value={range} onValueChange={(value) => setRange(value as RangeId)}>
            <SelectTrigger aria-label="Filter visits by date range" className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {RANGES.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={handleExport} disabled={visits.length === 0}>
          <Download data-icon="inline-start" />
          Export history to CSV
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-serif text-lg font-semibold text-foreground">No visits logged</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Nothing in this date range — try widening the filter.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <section key={group.date}>
              <h3 className="mb-2 flex items-baseline gap-2">
                <span className="font-serif text-sm font-semibold uppercase tracking-wide text-foreground">
                  {group.label}
                </span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  · {formatDate(group.date)}
                </span>
              </h3>
              <ul className="flex flex-col">
                {group.visits.map((visit, index) => (
                  <VisitRow
                    key={visit.id}
                    visit={visit}
                    isLast={index === group.visits.length - 1}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
