"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { type DailyVisits, type StatsSnapshot, formatDuration } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { CHART } from "./chart-theme"

function Sparkline({ data }: { data: DailyVisits[] }) {
  if (data.length < 2) return <div className="h-8" aria-hidden />
  return (
    <div className="h-8" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Area
            type="monotone"
            dataKey="visits"
            stroke={CHART.series}
            strokeWidth={2}
            strokeLinecap="round"
            fill={CHART.wash}
            fillOpacity={CHART.washOpacity}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function Trend({ value }: { value: number }) {
  const up = value >= 0
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <span
      className={cn(
        "flex items-center gap-1 text-sm font-medium",
        up ? "text-success" : "text-muted-foreground",
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {up ? "+" : ""}
      {value}%
      <span className="sr-only"> versus the previous period</span>
    </span>
  )
}

export function MetricCards({ stats }: { stats: StatsSnapshot }) {
  const metrics = [
    {
      label: "Total visits",
      // Proportional figures on display numbers; tabular-nums is for columns.
      value: String(stats.summary.totalVisits),
      trend: stats.trend.totalVisits,
    },
    {
      label: "Unique children",
      value: String(stats.summary.uniqueChildren),
      trend: stats.trend.uniqueChildren,
    },
    {
      label: "Average stay",
      value: formatDuration(stats.summary.averageStayMinutes),
      trend: stats.trend.averageStayMinutes,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((m) => (
        <Card key={m.label}>
          <CardContent className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <div className="flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold leading-none text-foreground">{m.value}</p>
              <Trend value={m.trend} />
            </div>
            <Sparkline data={stats.daily} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
