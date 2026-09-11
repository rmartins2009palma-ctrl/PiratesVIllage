/**
 * A thin completion bar, not a step indicator.
 *
 * The old version tracked which section was on screen, which made sense while
 * sections had titles to navigate between. With those gone, scroll position
 * answers nothing; what a parent in a hurry wants to know is "how much is
 * left", so this measures fields completed instead.
 */
export function ProgressSteps({ completed }: { completed: boolean[] }) {
  const done = completed.filter(Boolean).length
  const pct = completed.length === 0 ? 0 : Math.round((done / completed.length) * 100)

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Registration progress"
      className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
