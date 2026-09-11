"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["About the child", "Guardian", "Consent"]

export function ProgressSteps({
  current,
  completed,
}: {
  current: number
  completed: boolean[]
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <p className="font-serif text-sm font-semibold text-foreground">
          Step {current} of {STEPS.length}
        </p>
        <p className="text-xs text-muted-foreground">{STEPS[current - 1]}</p>
      </div>
      <ol className="mt-3 flex items-center gap-2">
        {STEPS.map((label, i) => {
          const stepNo = i + 1
          const isDone = completed[i]
          const isCurrent = stepNo === current
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    isDone
                      ? "border-success bg-success text-success-foreground"
                      : isCurrent
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-secondary text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="size-4" /> : stepNo}
                </span>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:inline",
                    isCurrent || isDone ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "h-0.5 flex-1 rounded-full transition-colors",
                    completed[i] ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
