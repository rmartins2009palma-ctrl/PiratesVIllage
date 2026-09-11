"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart3, Clock, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  type StatsRangeId,
  formatDate,
  getStats,
  peakHour,
} from "@/lib/mock-data"
import { AttendanceChart } from "./attendance-chart"
import { ChartSkeleton } from "./chart-skeleton"
import { ExportMenu } from "./export-menu"
import { MetricCards } from "./metric-cards"
import { PeakHoursChart } from "./peak-hours-chart"
import { RangeSelector, type CustomRange } from "./range-selector"
import { TopVisitors } from "./top-visitors"

function SectionTitle({ icon: Icon, title }: { icon: typeof Clock; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icon className="size-4" aria-hidden />
      </span>
      <h2 className="font-serif text-lg font-semibold text-foreground">{title}</h2>
    </div>
  )
}

function EmptyRange() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <p className="font-serif text-lg font-semibold text-foreground">
        Not enough activity yet in this period
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Try widening the date range to see how the club has been doing.
      </p>
    </div>
  )
}

export function Statistics() {
  const [range, setRange] = useState<StatsRangeId>("week")
  const [custom, setCustom] = useState<CustomRange>({ from: "2026-09-04", to: "2026-09-10" })
  const [loading, setLoading] = useState(true)

  const stats = useMemo(() => getStats(range), [range])
  const peak = useMemo(() => peakHour(stats.hourly), [stats.hourly])
  const hasData = stats.daily.length > 0 && stats.summary.totalVisits > 0

  // Charts only mount after the first paint, so the skeleton stands in for the
  // measured render rather than flashing a mis-sized chart.
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [range])

  const from = range === "custom" ? custom.from : stats.from
  const to = range === "custom" ? custom.to : stats.to

  return (
    <main className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Ship's Log</h1>
            <p className="mt-1 text-muted-foreground">How your kids club is doing</p>
          </div>
          <ExportMenu />
        </div>

        {/* One filter row, scoping everything below it */}
        <div className="flex flex-col gap-2">
          <RangeSelector
            range={range}
            onRangeChange={setRange}
            custom={custom}
            onCustomChange={setCustom}
          />
          <p className="text-sm text-muted-foreground">
            Showing data from{" "}
            <span className="tabular-nums text-foreground">{formatDate(from)}</span> to{" "}
            <span className="tabular-nums text-foreground">{formatDate(to)}</span>
          </p>
        </div>

        {!hasData ? (
          <EmptyRange />
        ) : (
          <>
            <MetricCards stats={stats} />

            <Card>
              <CardHeader>
                <SectionTitle icon={BarChart3} title="Attendance over time" />
              </CardHeader>
              <CardContent>
                {loading ? <ChartSkeleton height={300} /> : <AttendanceChart data={stats.daily} />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <SectionTitle icon={Clock} title="Peak hours" />
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {loading ? (
                  <ChartSkeleton height={260} />
                ) : (
                  <PeakHoursChart data={stats.hourly} peak={peak?.hour} />
                )}
                {peak && (
                  <p className="text-sm text-muted-foreground">
                    Busiest hour:{" "}
                    <span className="font-semibold tabular-nums text-foreground">
                      {String(peak.hour).padStart(2, "0")}:00
                    </span>{" "}
                    (average{" "}
                    <span className="tabular-nums text-foreground">{peak.visits}</span> visits)
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <SectionTitle icon={Trophy} title="Top adventurers this period" />
              </CardHeader>
              <CardContent>
                <TopVisitors visitors={stats.topVisitors} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}
