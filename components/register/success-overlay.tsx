"use client"

import Link from "next/link"
import { Check, LogIn, Sailboat, UserPlus } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CONFETTI = Array.from({ length: 18 }, (_, i) => i)
const CONFETTI_COLORS = ["var(--color-accent)", "var(--color-primary)", "var(--color-success)"]

export function SuccessOverlay({
  childName,
  checkInTime,
  onAddSibling,
}: {
  childName: string
  checkInTime: string
  onAddSibling: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${childName} registered and checked in`}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-primary/70 p-4 backdrop-blur-sm"
    >
      {/* Falling confetti */}
      {CONFETTI.map((i) => (
        <span
          key={i}
          aria-hidden
          className="absolute top-0 size-2 animate-confetti-fall rounded-[2px]"
          style={{
            left: `${(i * 5.5 + 4) % 100}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDuration: `${2.4 + (i % 5) * 0.4}s`,
            animationDelay: `${(i % 6) * 0.18}s`,
          }}
        />
      ))}

      {/* Sailboat crossing the screen */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-[28%] text-accent animate-sail-across">
        <Sailboat className="size-16" strokeWidth={1.75} />
      </div>

      <div className="relative w-full max-w-md animate-pop-in rounded-3xl bg-card p-8 text-center shadow-2xl ring-1 ring-border">
        <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-success/15">
          <div className="flex size-16 items-center justify-center rounded-full bg-success text-success-foreground">
            <Check className="size-9" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-balance font-serif text-2xl font-bold text-foreground">
          Welcome aboard, {childName}!
        </h2>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          {childName} is now registered and checked in.
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-success">
          <LogIn className="size-5" />
          <span className="text-sm font-semibold">
            Checked in at <span className="tabular-nums">{checkInTime}</span>
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button type="button" size="lg" className="w-full" onClick={onAddSibling}>
            <UserPlus data-icon="inline-start" />
            Add sibling
          </Button>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
