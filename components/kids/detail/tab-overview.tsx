"use client"

import Link from "next/link"
import {
  Accessibility,
  ArrowRight,
  CheckCircle2,
  Clock,
  Info,
  ShieldAlert,
  Sparkles,
  Timer,
  TriangleAlert,
  UserPlus,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  type Kid,
  formatDate,
  formatDuration,
  fullName,
  getSiblings,
  getVisitStats,
  kidInitials,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { addSiblingHref } from "./child-hero"

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  tone = "default",
}: {
  icon: typeof Info
  title: string
  subtitle?: string
  tone?: "default" | "warning"
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          tone === "warning" ? "bg-warning/15 text-warning" : "bg-secondary text-primary",
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <h2
          className={cn(
            "font-serif text-lg font-semibold leading-tight",
            tone === "warning" ? "text-warning-foreground" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  )
}

function DataField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  )
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 py-2.5 last:border-0 last:pb-0">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4 shrink-0 text-muted-foreground/70" />
        {label}
      </span>
      <span className="text-right text-sm font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  )
}

export function TabOverview({ kid }: { kid: Kid }) {
  const siblings = getSiblings(kid)
  const stats = getVisitStats(kid)
  const allergyList = (kid.allergies ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean)
  const hasMedical = allergyList.length > 0 || Boolean(kid.disability) || Boolean(kid.medical)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
      {/* ---------------- Left column ---------------- */}
      <div className="flex flex-col gap-4">
        <Card className="border-border/70">
          <CardHeader>
            <SectionTitle icon={Info} title="Personal information" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <DataField label="Age" value={`${kid.age} years`} />
            <DataField label="Room number" value={kid.room} />
            <DataField
              label="Registered on"
              value={
                <>
                  {formatDate(kid.registeredOn)}
                  {kid.registeredBy && (
                    <span className="text-muted-foreground"> · by {kid.registeredBy}</span>
                  )}
                </>
              }
            />
            <DataField label="Season" value={kid.season ?? "—"} />
            <DataField label="Nationality" value={kid.nationality ?? "—"} />
            <DataField label="Language" value={kid.language ?? "—"} />
          </CardContent>
        </Card>

        {/* Medical — amber whenever there is anything to flag */}
        <Card
          className={cn(
            "gap-0 border-border/70",
            hasMedical && "border-warning/30 ring-1 ring-warning/20",
          )}
        >
          <CardHeader className={cn("pb-4", hasMedical && "bg-warning/8")}>
            <SectionTitle
              icon={ShieldAlert}
              title="Medical information"
              subtitle={
                hasMedical
                  ? "Important — please read before care activities"
                  : "Nothing flagged at registration"
              }
              tone={hasMedical ? "warning" : "default"}
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-warning">
                <TriangleAlert className="size-3.5" />
                Allergies
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {allergyList.length > 0 ? (
                  allergyList.map((allergy) => (
                    <span
                      key={allergy}
                      className="flex items-center gap-1.5 rounded-full border border-warning/25 bg-warning/8 px-3 py-1 text-sm text-warning-foreground"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-warning" />
                      {allergy}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">None reported.</p>
                )}
              </div>
            </div>

            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Accessibility className="size-3.5" />
                Illness / disability
              </p>
              <p className="mt-2 text-sm text-foreground">
                {kid.disability ?? kid.medical ?? (
                  <span className="text-muted-foreground">None reported.</span>
                )}
              </p>
            </div>

            {kid.notes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Notes from the guardian
                </p>
                <p className="mt-2 text-sm text-foreground">{kid.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consent */}
        <Card className="border-border/70">
          <CardHeader>
            <SectionTitle icon={CheckCircle2} title="Consent" />
          </CardHeader>
          <CardContent>
            {kid.consent ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-sm font-medium text-success">
                  <CheckCircle2 className="size-4 shrink-0" />
                  Signed by {kid.consent.signedBy} on {formatDate(kid.consent.signedOn)}
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <DataField label="Terms version" value={kid.consent.version} />
                  <DataField label="Method" value={kid.consent.method} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No consent record on file for this child.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---------------- Right column ---------------- */}
      <div className="flex flex-col gap-4">
        <Card className="border-border/70">
          <CardHeader>
            <SectionTitle icon={Sparkles} title="Quick stats" />
          </CardHeader>
          <CardContent className="flex flex-col">
            <StatRow icon={CheckCircle2} label="Total visits this stay" value={stats.total} />
            <StatRow
              icon={Clock}
              label="Average duration"
              value={formatDuration(stats.averageMinutes)}
            />
            <StatRow
              icon={Timer}
              label="Longest visit"
              value={formatDuration(stats.longestMinutes)}
            />
            <StatRow
              icon={Sparkles}
              label="Favorite time"
              value={<span className="font-normal">{stats.favoriteWindow}</span>}
            />
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <SectionTitle icon={Users} title="Family" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {siblings.length > 0 ? (
              <>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {siblings.length} {siblings.length === 1 ? "sibling" : "siblings"} registered
                </p>
                {siblings.map((sibling) => (
                  <div
                    key={sibling.id}
                    className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3"
                  >
                    <Avatar className="size-10 shrink-0 border-2 border-accent/30">
                      <AvatarFallback className="bg-card text-sm font-semibold text-primary">
                        {kidInitials(sibling)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {fullName(sibling)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sibling.age} years · Room {sibling.room}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      render={<Link href={`/kids/${sibling.id}`} />}
                    >
                      View
                      <ArrowRight data-icon="inline-end" className="size-3 opacity-60" />
                    </Button>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-muted-foreground">
                  No siblings registered. Travelling companions in the same room will appear here.
                </p>
                <Button variant="outline" size="sm" render={<Link href={addSiblingHref(kid)} />}>
                  <UserPlus data-icon="inline-start" />
                  Add sibling
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
