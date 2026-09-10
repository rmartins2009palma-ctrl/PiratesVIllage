"use client"

import { useState } from "react"
import { BadgeCheck, CheckCircle2, Mail, Phone, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Guardian, formatDate } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function guardianInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return `${first}${last}`.toUpperCase()
}

function ContactField({
  icon: Icon,
  href,
  label,
  value,
}: {
  icon: typeof Phone
  href: string
  label: string
  value: string
}) {
  return (
    <a
      href={href}
      aria-label={`${label}: ${value}`}
      className="flex min-h-11 items-center gap-2.5 rounded-xl border border-border bg-secondary/40 px-3 text-sm text-foreground transition-colors hover:border-accent/60 hover:bg-secondary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate font-medium">{value}</span>
    </a>
  )
}

function GuardianCard({
  guardian,
  onRemove,
}: {
  guardian: Guardian
  onRemove: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const signatures = guardian.signaturesThisStay ?? 0

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5",
        guardian.isPrimary ? "border-accent ring-1 ring-accent/30" : "border-border",
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-12 shrink-0 border-2 border-accent/40">
            <AvatarFallback className="bg-secondary font-semibold text-primary">
              {guardianInitials(guardian.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="font-serif text-lg font-bold leading-tight text-foreground">
              {guardian.fullName}
            </h3>
            <Badge variant="secondary">{guardian.relationship}</Badge>
            {guardian.isPrimary ? (
              <Badge className="bg-accent uppercase tracking-wide text-accent-foreground">
                <BadgeCheck data-icon="inline-start" />
                Primary guardian
              </Badge>
            ) : (
              <Badge className="uppercase tracking-wide">Authorized adult</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ContactField
            icon={Phone}
            href={`tel:${guardian.phone.replace(/\s+/g, "")}`}
            label="Call"
            value={guardian.phone}
          />
          {guardian.email && (
            <ContactField
              icon={Mail}
              href={`mailto:${guardian.email}`}
              label="Email"
              value={guardian.email}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm">
          {guardian.consentSignedOn && (
            <span className="flex items-center gap-1.5 text-success">
              <CheckCircle2 className="size-4 shrink-0" />
              Signed consent on {formatDate(guardian.consentSignedOn)}
            </span>
          )}
          <span className="text-muted-foreground">
            Signed for check-in/out{" "}
            <span className="font-semibold tabular-nums text-foreground">{signatures}</span>{" "}
            {signatures === 1 ? "time" : "times"} this stay
          </span>
          {guardian.addedOn && (
            <span className="text-muted-foreground">Added on {formatDate(guardian.addedOn)}</span>
          )}
        </div>

        {!guardian.isPrimary &&
          (confirming ? (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/25 bg-destructive/8 p-3">
              <p className="text-sm text-destructive">
                Remove {guardian.fullName}? They will no longer be able to collect this child.
              </p>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
                  Keep
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onRemove(guardian.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="w-fit rounded text-sm font-medium text-destructive underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-destructive/30"
            >
              Remove authorization
            </button>
          ))}
      </div>
    </div>
  )
}

export function TabGuardians({
  guardians,
  onRemove,
}: {
  guardians: Guardian[]
  onRemove: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {guardians.map((guardian) => (
        <GuardianCard key={guardian.id} guardian={guardian} onRemove={onRemove} />
      ))}

      <div className="flex justify-center pt-1">
        <Button
          size="lg"
          className="h-11 bg-accent px-5 font-semibold text-accent-foreground hover:brightness-105"
        >
          <UserPlus data-icon="inline-start" />
          Add authorized adult
        </Button>
      </div>
    </div>
  )
}
