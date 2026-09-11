"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft, CheckCircle2, Save, Users, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { ProgressSteps } from "@/components/register/progress-steps"
import { ChildSection } from "@/components/register/child-section"
import { GuardianSection } from "@/components/register/guardian-section"
import { ConsentSection } from "@/components/register/consent-section"
import { SuccessOverlay } from "@/components/register/success-overlay"
import {
  createGuardian,
  createInitialDraft,
  draftFromPrefill,
  hasSiblingPrefill,
  readSiblingPrefill,
  type GuardianDraft,
  type RegistrationDraft,
} from "@/lib/registration"
import { isFieldRequired } from "@/lib/hotel-config"
import { cn } from "@/lib/utils"

function computeErrors(draft: RegistrationDraft, signed: boolean): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!draft.firstName.trim()) errors.firstName = "Enter the child's first name."
  if (!draft.lastName.trim()) errors.lastName = "Enter the child's last name."
  if (!draft.age) errors.age = "Select an age."
  if (!draft.room.trim()) errors.room = "Enter the room number."

  draft.guardians.forEach((g) => {
    if (!g.fullName.trim()) errors[`g:${g.id}:fullName`] = "Enter the guardian's name."
    if (g.phone.replace(/\D/g, "").length < 6) errors[`g:${g.id}:phone`] = "Enter a valid phone number."
    // A hidden field must never block the form — isFieldRequired() already
    // refuses to require anything invisible.
    if (isFieldRequired("guardianRelationship") && !g.relationship) {
      errors[`g:${g.id}:relationship`] = "Select a relationship."
    }
  })

  if (!draft.consent) errors.consent = "You must accept the terms to continue."
  if (!signed) errors.signature = "A guardian signature is required."
  return errors
}

function nowTime() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
}

export function RegistrationForm() {
  // Arriving from a child profile via "Add sibling" seeds the room and primary guardian.
  const searchParams = useSearchParams()
  const prefill = useMemo(() => readSiblingPrefill(searchParams), [searchParams])
  const isSibling = hasSiblingPrefill(prefill)

  const [draft, setDraft] = useState<RegistrationDraft>(() => draftFromPrefill(prefill))
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [signed, setSigned] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [checkInTime, setCheckInTime] = useState("")
  const [registeredName, setRegisteredName] = useState("")

  const scrollRef = useRef<HTMLElement>(null)
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]

  const allErrors = useMemo(() => computeErrors(draft, signed), [draft, signed])
  const missingCount = Object.keys(allErrors).length
  const isComplete = missingCount === 0
  const visibleErrors = showErrors ? allErrors : {}

  const completed = useMemo<boolean[]>(
    () => [
      !!draft.firstName.trim() && !!draft.lastName.trim() && !!draft.age && !!draft.room.trim(),
      draft.guardians.every(
        (g) =>
          g.fullName.trim() &&
          g.phone.replace(/\D/g, "").length >= 6 &&
          (!isFieldRequired("guardianRelationship") || g.relationship),
      ),
      draft.consent && signed,
    ],
    [draft, signed],
  )

  // Track the section currently in view to drive the step indicator.
  useEffect(() => {
    const root = scrollRef.current
    const nodes = sectionRefs.map((r) => r.current).filter(Boolean) as Element[]
    if (!root || nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const idx = nodes.indexOf(visible.target)
          if (idx >= 0) setCurrentStep(idx + 1)
        }
      },
      { root, rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 1] },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const patchDraft = useCallback((patch: Partial<RegistrationDraft>) => {
    setDraft((d) => ({ ...d, ...patch }))
  }, [])

  const patchGuardian = useCallback((id: string, patch: Partial<GuardianDraft>) => {
    setDraft((d) => ({
      ...d,
      guardians: d.guardians.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }))
  }, [])

  const addGuardian = useCallback(() => {
    setDraft((d) => ({
      ...d,
      guardians: [...d.guardians, createGuardian(`g-${Date.now()}`)],
    }))
  }, [])

  const removeGuardian = useCallback((id: string) => {
    setDraft((d) => ({ ...d, guardians: d.guardians.filter((g) => g.id !== id) }))
  }, [])

  const handleSubmit = useCallback(() => {
    if (!isComplete) {
      setShowErrors(true)
      const firstKey = Object.keys(allErrors)[0]
      const el = document.getElementById(firstKey) ?? document.querySelector("[aria-invalid='true']")
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setRegisteredName(draft.firstName.trim())
    setCheckInTime(nowTime())
  }, [isComplete, allErrors, draft.firstName])

  const handleAddSibling = useCallback(() => {
    setDraft((d) => ({ ...createInitialDraft(), guardians: d.guardians }))
    setSigned(false)
    setShowErrors(false)
    setRegisteredName("")
    setCheckInTime("")
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <>
      <main ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
          {/* Page heading + back */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "w-fit text-muted-foreground",
              )}
            >
              <ArrowLeft data-icon="inline-start" />
              Back to dashboard
            </Link>
            <div>
              <h1 className="text-balance font-serif text-3xl font-bold text-foreground">
                New crew registration
              </h1>
              <p className="mt-1 text-muted-foreground">
                Enrol a child in the Pirates Village Kids Club for the first time this season.
              </p>
            </div>
          </div>

          {isSibling && !bannerDismissed && (
            <div className="flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/8 p-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">
                <Users className="size-4" />
              </span>
              <p className="min-w-0 flex-1 pt-1.5 text-sm text-foreground">
                {prefill.room && (
                  <>
                    Adding a sibling to <span className="font-semibold">Room {prefill.room}</span>.{" "}
                  </>
                )}
                {prefill.guardianName && "Primary guardian pre-filled."}
              </p>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss sibling prefill notice"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          <div className="sticky top-0 z-10 -mx-4 bg-background/80 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
            <ProgressSteps current={currentStep} completed={completed} />
          </div>

          <div ref={sectionRefs[0]}>
            <ChildSection draft={draft} onChange={patchDraft} errors={visibleErrors} />
          </div>
          <div ref={sectionRefs[1]}>
            <GuardianSection
              guardians={draft.guardians}
              onGuardianChange={patchGuardian}
              onAddGuardian={addGuardian}
              onRemoveGuardian={removeGuardian}
              errors={visibleErrors}
            />
          </div>
          <div ref={sectionRefs[2]}>
            <ConsentSection
              consent={draft.consent}
              onConsentChange={(v) => patchDraft({ consent: v })}
              onSignatureChange={setSigned}
              errors={visibleErrors}
            />
          </div>
        </div>
      </main>

      {/* Sticky action footer */}
      <footer className="border-t border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-sm">
            {isComplete ? (
              <span className="flex items-center gap-2 font-medium text-success">
                <CheckCircle2 className="size-5" />
                All required fields complete — ready to register.
              </span>
            ) : (
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                <AlertCircle className={cn("size-5", showErrors && "text-destructive")} />
                {missingCount} required {missingCount === 1 ? "field" : "fields"} still missing
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button onClick={handleSubmit} disabled={showErrors && !isComplete}>
              <Save data-icon="inline-start" />
              Register &amp; check in
            </Button>
          </div>
        </div>
      </footer>

      {registeredName && (
        <SuccessOverlay
          childName={registeredName}
          checkInTime={checkInTime}
          onAddSibling={handleAddSibling}
        />
      )}
    </>
  )
}
