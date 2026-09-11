"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { HourlyVisits } from "@/lib/mock-data"
import { AXIS_TICK, CHART } from "./chart-theme"

const hourLabel = (h: number) => `${String(h).padStart(2, "0")}:00`

function HourTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: HourlyVisits }[]
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-card">
      <p className="text-xs text-muted-foreground">{hourLabel(point.hour)}</p>
      <p className="text-sm font-semibold tabular-nums text-foreground">
        {point.visits} {point.visits === 1 ? "visit" : "visits"}
      </p>
    </div>
  )
}

export function PeakHoursChart({ data, peak }: { data: HourlyVisits[]; peak?: number }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barCategoryGap="22%">
        <CartesianGrid stroke={CHART.grid} strokeWidth={1} vertical={false} />
        <XAxis
          dataKey="hour"
          tickFormatter={hourLabel}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={{ stroke: CHART.grid }}
          tickMargin={8}
        />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} allowDecimals={false} />
        <Tooltip content={<HourTooltip />} cursor={{ fill: CHART.grid, fillOpacity: 0.35 }} />
        {/* One series, one colour — except the single emphasised peak. */}
        <Bar dataKey="visits" radius={[4, 4, 0, 0]} maxBarSize={24}>
          {data.map((d) => (
            <Cell key={d.hour} fill={d.hour === peak ? CHART.emphasis : CHART.series} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
