export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="animate-shimmer rounded-xl"
      style={{ height }}
      role="status"
      aria-label="Loading chart"
    />
  )
}
