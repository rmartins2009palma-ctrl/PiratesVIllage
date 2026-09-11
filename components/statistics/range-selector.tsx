"use client"

import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { StatsRangeId } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const RANGES: { id: StatsRangeId; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "custom", label: "Custom" },
]

export interface CustomRange {
  from: string
  to: string
}

export function RangeSelector({
  range,
  onRangeChange,
  custom,
  onCustomChange,
}: {
  range: StatsRangeId
  onRangeChange: (id: StatsRangeId) => void
  custom: CustomRange
  onCustomChange: (next: CustomRange) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        role="group"
        aria-label="Date range"
        className="flex flex-wrap items-center gap-2"
      >
        {RANGES.map((r) => {
          const active = r.id === range
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onRangeChange(r.id)}
              aria-pressed={active}
              className={cn(
                "flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-accent hover:text-foreground",
              )}
            >
              {r.id === "custom" && <Calendar className="size-4 shrink-0" aria-hidden />}
              {r.label}
            </button>
          )
        })}
      </div>

      {range === "custom" && (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
          <div className="flex flex-col gap-1">
            <label htmlFor="range-from" className="text-xs font-medium text-muted-foreground">
              From
            </label>
            <Input
              id="range-from"
              type="date"
              value={custom.from}
              max={custom.to}
              onChange={(e) => onCustomChange({ ...custom, from: e.target.value })}
              className="h-11 w-[170px]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="range-to" className="text-xs font-medium text-muted-foreground">
              To
            </label>
            <Input
              id="range-to"
              type="date"
              value={custom.to}
              min={custom.from}
              onChange={(e) => onCustomChange({ ...custom, to: e.target.value })}
              className="h-11 w-[170px]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
