"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import {
  Anchor,
  Check,
  Clock,
  Eraser,
  Loader2,
  LogIn,
  LogOut,
  TriangleAlert,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { type Kid, fullName, kidInitials, formatDuration } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export type CheckAction = "in" | "out"

interface CheckInModalProps {
  kid: Kid
  action: CheckAction
  onClose: () => void
  onConfirm: (kid: Kid, action: CheckAction, guardianName: string, time: string) => void
}

type ModalState = "form" | "saving" | "success" | "error"

const PAD_HEIGHT = 200

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

function formatLongDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function entryDurationMinutes(entryTime: string, now: Date): number {
  const [h, m] = entryTime.split(":").map(Number)
  return now.getHours() * 60 + now.getMinutes() - (h * 60 + m)
}

export function CheckInModal({ kid, action, onClose, onConfirm }: CheckInModalProps) {
  const now = useClock()
  const currentTime = formatTime(now)
  const longDate = formatLongDate(now)

  const padRef = useRef<SignatureCanvas>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [padWidth, setPadWidth] = useState(0)
  const [signed, setSigned] = useState(false)
  const [sigError, setSigError] = useState(false)
  const [selectedGuardian, setSelectedGuardian] = useState(
    kid.guardians.find((g) => g.isPrimary) ?? kid.guardians[0],
  )
  const [state, setState] = useState<ModalState>("form")
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)
  const [thick, setThick] = useState(false)

  // If kid is already "in" and action is "in", show the warning variant
  const alreadyIn = action === "in" && kid.status === "in"

  const isIn = action === "in"
  const accentColor = isIn ? "success" : "primary"
  const accentBg = isIn ? "bg-success" : "bg-primary"
  const accentText = isIn ? "text-success" : "text-primary"
  const accentBorder = isIn ? "border-success" : "border-primary"

  // Resize observer for signature pad
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setPadWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ESC key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (state === "form" && signed) {
          setShowDiscardConfirm(true)
        } else if (state === "form") {
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [signed, state, onClose])

  // Focus trap
  useEffect(() => {
    const modal = document.getElementById("checkin-modal")
    if (!modal) return
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    focusable[0].focus()
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    modal.addEventListener("keydown", handleTab)
    return () => modal.removeEventListener("keydown", handleTab)
  }, [state, showDiscardConfirm])

  // Auto-dismiss success
  useEffect(() => {
    if (state !== "success") return
    const t = setTimeout(() => onClose(), 2000)
    return () => clearTimeout(t)
  }, [state, onClose])

  const handleSignatureEnd = useCallback(() => {
    const empty = padRef.current?.isEmpty() ?? true
    setSigned(!empty)
    if (!empty) setSigError(false)
  }, [])

  const handleClear = useCallback(() => {
    padRef.current?.clear()
    setSigned(false)
    setSigError(false)
  }, [])

  const handleConfirm = useCallback(() => {
    if (!signed) {
      setSigError(true)
      return
    }
    setState("saving")
    // Simulate network save
    setTimeout(() => {
      // 90% success rate for demo
      if (Math.random() > 0.1) {
        setState("success")
        onConfirm(kid, action, selectedGuardian.fullName, currentTime)
      } else {
        setState("error")
      }
    }, 1500)
  }, [signed, kid, action, selectedGuardian, currentTime, onConfirm])

  const handleRetry = useCallback(() => {
    setState("saving")
    setTimeout(() => setState("success"), 1500)
  }, [])

  const handleBackdropClick = useCallback(() => {
    if (state === "form" && signed) {
      setShowDiscardConfirm(true)
    } else if (state === "form" || state === "error") {
      onClose()
    }
  }, [signed, state, onClose])

  const durationMin = kid.entryTime ? entryDurationMinutes(kid.entryTime, now) : 0
  const hasAlert = Boolean(kid.allergies || kid.medical)
  const alertText = kid.allergies ?? kid.medical ?? ""

  // Success state
  if (state === "success") {
    return (
      <Backdrop onBackdropClick={onClose}>
        <div
          id="checkin-modal"
          className="animate-pop-in flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-border bg-card p-8 text-center shadow-2xl"
        >
          <div
            className={cn(
              "flex size-20 items-center justify-center rounded-full",
              isIn ? "bg-success/12" : "bg-primary/10",
            )}
          >
            <Check className={cn("size-10", isIn ? "text-success" : "text-primary")} strokeWidth={3} />
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-foreground">
              {isIn ? "Welcome aboard!" : "Sailed home safely!"}
            </p>
            <p className="mt-1 text-base text-muted-foreground">
              {fullName(kid)} {isIn ? "has boarded the ship" : "has checked out"}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
            <Clock className="size-4 text-muted-foreground" />
            <span className="font-mono tabular-nums font-medium">{currentTime}</span>
            <span className="text-muted-foreground">· {longDate}</span>
          </div>
        </div>
      </Backdrop>
    )
  }

  // Already checked in warning
  if (alreadyIn) {
    return (
      <Backdrop onBackdropClick={onClose}>
        <div
          id="checkin-modal"
          className="animate-pop-in w-full max-w-md overflow-hidden rounded-2xl border-2 border-warning/40 bg-card shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-warning/20 bg-warning/8 p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <TriangleAlert className="size-5" />
            </span>
            <div>
              <p className="font-serif text-lg font-semibold text-foreground">Already checked in</p>
              <p className="text-sm text-muted-foreground">
                {fullName(kid)} entered the club at {kid.entryTime}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex flex-col gap-4 p-5">
            <p className="text-sm text-muted-foreground">
              Did you mean to check this child out instead?
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary"
                onClick={() => onConfirm(kid, "out", selectedGuardian?.fullName ?? "", currentTime)}
              >
                <LogOut data-icon="inline-start" />
                Yes, check out instead
              </Button>
            </div>
          </div>
        </div>
      </Backdrop>
    )
  }

  // Main form
  return (
    <Backdrop onBackdropClick={handleBackdropClick}>
      <div
        id="checkin-modal"
        className="animate-pop-in flex max-h-[90vh] w-full max-w-[700px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-border p-5">
          <Avatar className="size-12 border-2 border-accent/40">
            <AvatarFallback className="bg-secondary font-semibold text-primary">
              {kidInitials(kid)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg font-bold text-foreground">{fullName(kid)}</p>
            <p className="text-sm text-muted-foreground">
              {kid.age} years · Room {kid.room}
            </p>
          </div>
          <button
            type="button"
            onClick={() => (signed ? setShowDiscardConfirm(true) : onClose())}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Action strip */}
        <div
          className={cn(
            "flex items-center gap-2 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white",
            accentBg,
          )}
        >
          {isIn ? <LogIn className="size-4" /> : <LogOut className="size-4" />}
          {isIn ? "Check-in" : "Check-out"}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Guardian list */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-foreground">Guardians on file</p>
            <p className="mb-3 text-xs text-muted-foreground">
              {kid.guardians.map((g) => `${g.fullName} (${g.relationship})`).join(", ")}
            </p>
          </div>

          {/* Allergy/medical alert */}
          {hasAlert && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/8 p-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
                <TriangleAlert className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-warning-foreground">
                  {kid.allergies ? "Allergies" : "Medical info"}
                </p>
                <p className="text-sm text-warning-foreground/80">{alertText}</p>
              </div>
            </div>
          )}

          {/* Time display */}
          <div className="mb-5 flex flex-col items-center gap-1 rounded-xl bg-secondary/50 p-5">
            <p className="font-mono text-5xl font-bold tabular-nums text-foreground">{currentTime}</p>
            <p className="text-sm text-muted-foreground">{longDate}</p>
            {!isIn && kid.entryTime && (
              <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <LogIn className="size-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Checked in at</span>
                  <span className="font-mono tabular-nums font-medium">{kid.entryTime}</span>
                </div>
                <div className={cn("flex items-center gap-1.5 font-semibold", accentText)}>
                  <Clock className="size-3.5" />
                  {formatDuration(durationMin)}
                </div>
              </div>
            )}
          </div>

          {/* Guardian selection */}
          {kid.guardians.length > 1 && (
            <div className="mb-5">
              <p className="mb-2 text-sm font-medium text-foreground">Who is signing?</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {kid.guardians.map((g) => {
                  const isSelected = selectedGuardian?.id === g.id
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGuardian(g)}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all",
                        isSelected
                          ? cn(accentBorder, "bg-accent/5")
                          : "border-border hover:border-accent/50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                          isSelected ? cn(accentBorder, accentBg) : "border-border",
                        )}
                      >
                        {isSelected && <Check className="size-3 text-white" strokeWidth={4} />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{g.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {g.relationship}
                          {g.isPrimary && " · Primary"}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Signature pad */}
          <div className="mb-2">
            <p className="mb-2 text-sm font-medium text-foreground">
              Guardian signature
              <span className="ml-1 text-muted-foreground">— {selectedGuardian?.fullName}</span>
            </p>
            <div
              ref={wrapRef}
              className={cn(
                "relative overflow-hidden rounded-xl border-2 bg-secondary/40 transition-colors",
                sigError ? "border-destructive" : "border-dashed border-input",
              )}
              style={{ height: PAD_HEIGHT }}
            >
              {/* Placeholder */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-x-10 bottom-14 flex flex-col items-center gap-3 transition-opacity duration-500",
                  signed ? "opacity-0" : "opacity-100",
                )}
              >
                <span className="font-serif text-lg tracking-wide text-muted-foreground/45">
                  Guardian signature
                </span>
                <div className="h-0.5 w-full animate-wave-drift rounded-full bg-[repeating-linear-gradient(90deg,var(--color-accent)_0_10px,transparent_10px_18px)] opacity-40" />
              </div>

              {padWidth > 0 && (
                <SignatureCanvas
                  ref={padRef}
                  penColor="#0b2545"
                  minWidth={thick ? 1.8 : 0.9}
                  maxWidth={thick ? 3.8 : 2.2}
                  dotSize={thick ? 2.4 : 1.4}
                  clearOnResize={false}
                  onEnd={handleSignatureEnd}
                  canvasProps={{
                    width: padWidth,
                    height: PAD_HEIGHT,
                    className: "touch-none",
                    role: "application",
                    tabIndex: 0,
                    "aria-label": `Signature pad for ${selectedGuardian?.fullName ?? "guardian"}. Draw the guardian's signature using touch, stylus, or mouse.`,
                  }}
                />
              )}
            </div>

            {sigError && (
              <p className="mt-1.5 text-sm text-destructive" role="alert">
                Please provide a clearer signature
              </p>
            )}

            {/* Pad controls */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleClear}>
                  <Eraser data-icon="inline-start" />
                  Clear
                </Button>
                <Button
                  type="button"
                  variant={thick ? "default" : "outline"}
                  size="sm"
                  onClick={() => setThick((t) => !t)}
                  aria-pressed={thick}
                >
                  {thick ? "Bold pen" : "Fine pen"}
                </Button>
              </div>
              {signed && !sigError && (
                <span className="flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-sm font-medium text-success">
                  <Check className="size-4" />
                  Signature captured
                </span>
              )}
            </div>
          </div>

          {/* Error banner */}
          {state === "error" && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/8 p-3">
              <p className="text-sm text-destructive">Could not save. Please retry.</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-border bg-secondary/30 p-4">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none sm:px-8"
            onClick={() => (signed ? setShowDiscardConfirm(true) : onClose())}
          >
            Cancel
          </Button>
          <Button
            className={cn("flex-1 font-semibold sm:flex-none sm:px-8", accentBg)}
            onClick={handleConfirm}
            disabled={state === "saving" || !signed}
          >
            {state === "saving" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {isIn ? <LogIn data-icon="inline-start" /> : <LogOut data-icon="inline-start" />}
                Confirm {isIn ? "check-in" : "check-out"} at {currentTime}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Discard confirmation dialog */}
      {showDiscardConfirm && (
        <Backdrop onBackdropClick={() => setShowDiscardConfirm(false)} embedded>
          <div className="animate-pop-in w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <p className="font-serif text-lg font-semibold text-foreground">Discard signature?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You have an unsaved signature. Closing now will discard it.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDiscardConfirm(false)}
              >
                Keep signing
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  setShowDiscardConfirm(false)
                  onClose()
                }}
              >
                Discard & close
              </Button>
            </div>
          </div>
        </Backdrop>
      )}
    </Backdrop>
  )
}

function Backdrop({
  children,
  onBackdropClick,
  embedded,
}: {
  children: React.ReactNode
  onBackdropClick: () => void
  embedded?: boolean
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        embedded ? "bg-black/30" : "bg-primary/30 backdrop-blur-sm",
      )}
      onClick={onBackdropClick}
    >
      <div className="flex w-full max-w-[700px] justify-center" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
