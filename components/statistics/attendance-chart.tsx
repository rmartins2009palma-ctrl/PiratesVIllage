"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { DailyVisits } from "@/lib/mock-data"
import { AXIS_TICK, CHART } from "./chart-theme"

function dayTick(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" })
}

function fullDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  })
}

function AttendanceTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: DailyVisits }[]
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-card">
      <p className="text-xs text-muted-foreground">{fullDate(point.date)}</p>
      <p className="text-sm font-semibold tabular-nums text-foreground">
        {point.visits} {point.visits === 1 ? "visit" : "visits"}
      </p>
    </div>
  )
}

export function AttendanceChart({ data }: { data: DailyVisits[] }) {
  // A month of ticks would collide, so thin them out rather than rotate labels.
  const interval = data.length > 14 ? Math.floor(data.length / 7) : 0

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="attendance-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART.wash} stopOpacity={CHART.washOpacity} />
            <stop offset="100%" stopColor={CHART.wash} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={CHART.grid} strokeWidth={1} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={dayTick}
          interval={interval}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={{ stroke: CHART.grid }}
          tickMargin={8}
        />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          width={44}
          allowDecimals={false}
        />
        <Tooltip
          content={<AttendanceTooltip />}
          cursor={{ stroke: CHART.grid, strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="visits"
          stroke={CHART.series}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#attendance-wash)"
          // 8px dot with a 2px surface ring, per the mark spec
          activeDot={{ r: 4, fill: CHART.series, stroke: CHART.surface, strokeWidth: 2 }}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
