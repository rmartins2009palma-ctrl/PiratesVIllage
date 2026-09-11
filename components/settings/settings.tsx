"use client"

import { useState } from "react"
import { Building2, Eye, Info, LayoutGrid, SlidersHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  HOTEL_CONFIG,
  type RegistrationFieldKey,
  CORE_REQUIRED_FIELDS,
} from "@/lib/hotel-config"
import { CURRENT_USER, HOTEL } from "@/lib/mock-data"

const FIELD_LABELS: Record<RegistrationFieldKey, string> = {
  childAllergies: "Allergies",
  childDisability: "Illness or disability",
  childNationality: "Nationality",
  childLanguage: "Language",
  specialNotes: "Special notes for staff",
  guardianRelationship: "Guardian relationship (Mother, Father…)",
  guardianEmail: "Guardian email",
  additionalGuardians: "Additional authorized adults",
}

const DISPLAY_LABELS: Record<string, string> = {
  showVisitCount: "Visit count on registry cards",
  showEntryTimeInStatus: "Entry time inside the status pill",
  showAllergyIcon: "Allergy warning icon",
  showAdvancedFilters: "Advanced filter chips (registered today, with allergies)",
  showGuardianRelationship: "Guardian relationship on the child profile",
  showNationality: "Nationality on the child profile",
  showLanguage: "Language on the child profile",
  showSeason: "Season on the child profile",
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Info
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <h2 className="font-serif text-lg font-semibold leading-tight text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  )
}

function ToggleRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-secondary/50"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
      <span className="text-sm text-foreground">{label}</span>
      <span className="ml-auto shrink-0 text-xs font-medium text-muted-foreground">
        {checked ? "Shown" : "Hidden"}
      </span>
    </label>
  )
}

export function Settings() {
  // Local only: the toggles show what the config does and let the manager try
  // it, but nothing is persisted until there is a backend to persist it to.
  const [fields, setFields] = useState(() =>
    Object.fromEntries(
      (Object.keys(HOTEL_CONFIG.registrationFields) as RegistrationFieldKey[]).map((k) => [
        k,
        HOTEL_CONFIG.registrationFields[k].visible,
      ]),
    ) as Record<RegistrationFieldKey, boolean>,
  )
  const [display, setDisplay] = useState(() => ({
    ...HOTEL_CONFIG.displayFields.kidCard,
    ...HOTEL_CONFIG.displayFields.kidsRegistry,
    ...HOTEL_CONFIG.displayFields.childDetail,
  }))

  const displayKeys = Object.keys(display) as (keyof typeof display)[]

  return (
    <main className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 sm:px-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            What this club records and what it shows
          </p>
        </div>

        <p className="flex items-start gap-2.5 rounded-xl border border-accent/40 bg-accent/8 px-3 py-2.5 text-sm text-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-accent-foreground" aria-hidden />
          Changes preview here but are not saved yet — storing them per hotel arrives
          with the backend.
        </p>

        {/* Club */}
        <Card>
          <CardHeader>
            <SectionTitle icon={Building2} title="Club" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              ["Hotel", HOTEL.name],
              ["Club", HOTEL.club],
              ["Location", HOTEL.location],
              ["Signed in as", `${CURRENT_USER.name} · ${CURRENT_USER.role}`],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-0.5 text-sm text-foreground">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Registration fields */}
        <Card>
          <CardHeader>
            <SectionTitle
              icon={SlidersHorizontal}
              title="Registration fields"
              subtitle="Hidden fields are not rendered and never block the form"
            />
          </CardHeader>
          <CardContent className="flex flex-col">
            {(Object.keys(FIELD_LABELS) as RegistrationFieldKey[]).map((key) => (
              <ToggleRow
                key={key}
                id={`field-${key}`}
                label={FIELD_LABELS[key]}
                checked={fields[key]}
                onChange={(v) => setFields((f) => ({ ...f, [key]: v }))}
              />
            ))}
          </CardContent>
        </Card>

        {/* Display */}
        <Card>
          <CardHeader>
            <SectionTitle icon={LayoutGrid} title="What the screens show" />
          </CardHeader>
          <CardContent className="flex flex-col">
            {displayKeys.map((key) => (
              <ToggleRow
                key={key}
                id={`display-${key}`}
                label={DISPLAY_LABELS[key] ?? key}
                checked={display[key]}
                onChange={(v) => setDisplay((d) => ({ ...d, [key]: v }))}
              />
            ))}
          </CardContent>
        </Card>

        {/* Always-on */}
        <Card>
          <CardHeader>
            <SectionTitle
              icon={Eye}
              title="Always recorded"
              subtitle="A child cannot be supervised safely without these, so they are not configurable"
            />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {CORE_REQUIRED_FIELDS.map((field) => (
              <span
                key={field}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
              </span>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
