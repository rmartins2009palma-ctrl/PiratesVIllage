"use client"

import { isFieldVisible } from "@/lib/hotel-config"
import { LifeBuoy, Plus, ShieldCheck, Trash2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  COUNTRY_CODES,
  RELATIONSHIPS,
  formatPhone,
  type GuardianDraft,
} from "@/lib/registration"

interface Props {
  guardians: GuardianDraft[]
  onGuardianChange: (id: string, patch: Partial<GuardianDraft>) => void
  onAddGuardian: () => void
  onRemoveGuardian: (id: string) => void
  errors: Record<string, string>
}

function Req() {
  return <span className="text-destructive"> *</span>
}

function GuardianFields({
  guardian,
  index,
  onChange,
  errors,
  showEmail,
}: {
  guardian: GuardianDraft
  index: number
  onChange: (patch: Partial<GuardianDraft>) => void
  errors: Record<string, string>
  showEmail: boolean
}) {
  const key = (field: string) => `g:${guardian.id}:${field}`
  const showRelationship = isFieldVisible("guardianRelationship")

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field data-invalid={!!errors[key("fullName")] || undefined}>
        <FieldLabel htmlFor={`${guardian.id}-name`}>
          Full name<Req />
        </FieldLabel>
        <Input
          id={`${guardian.id}-name`}
          autoComplete="off"
          value={guardian.fullName}
          aria-invalid={!!errors[key("fullName")] || undefined}
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
        {errors[key("fullName")] && <FieldError>{errors[key("fullName")]}</FieldError>}
      </Field>

      <Field data-invalid={!!errors[key("phone")] || undefined}>
        <FieldLabel htmlFor={`${guardian.id}-phone`}>
          Phone number<Req />
        </FieldLabel>
        <div className="flex gap-2">
          <Select
            value={guardian.countryCode}
            onValueChange={(value) => onChange({ countryCode: value as string })}
          >
            <SelectTrigger aria-label="Country dialling code" className="w-[104px] shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {COUNTRY_CODES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} · {c.country}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            id={`${guardian.id}-phone`}
            inputMode="tel"
            autoComplete="off"
            value={guardian.phone}
            aria-invalid={!!errors[key("phone")] || undefined}
            onChange={(e) => onChange({ phone: formatPhone(e.target.value) })}
          />
        </div>
        {errors[key("phone")] && <FieldError>{errors[key("phone")]}</FieldError>}
      </Field>

      {showRelationship && (
      <Field data-invalid={!!errors[key("relationship")] || undefined}>
        <FieldLabel htmlFor={`${guardian.id}-rel`}>
          Relationship<Req />
        </FieldLabel>
        <Select
          value={guardian.relationship === "" ? null : guardian.relationship}
          onValueChange={(value) => onChange({ relationship: (value as string) ?? "" })}
        >
          <SelectTrigger id={`${guardian.id}-rel`} className="w-full" aria-invalid={!!errors[key("relationship")] || undefined}>
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {RELATIONSHIPS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors[key("relationship")] && <FieldError>{errors[key("relationship")]}</FieldError>}
      </Field>
      )}

      {showEmail && (
        <Field>
          <FieldLabel htmlFor={`${guardian.id}-email`}>Email</FieldLabel>
          <Input
            id={`${guardian.id}-email`}
            type="email"
            autoComplete="off"
            value={guardian.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
          <span className="text-sm text-muted-foreground">For RGPD-related communications.</span>
        </Field>
      )}
    </div>
  )
}

export function GuardianSection({
  guardians,
  onGuardianChange,
  onAddGuardian,
  onRemoveGuardian,
  errors,
}: Props) {
  const [primary, ...additional] = guardians

  return (
    <Card className="scroll-mt-6">
      <CardContent className="flex flex-col gap-6 pt-1">
        <GuardianFields
          guardian={primary}
          index={0}
          showEmail
          errors={errors}
          onChange={(patch) => onGuardianChange(primary.id, patch)}
        />

        {additional.map((g, i) => (
          <div key={g.id} className="rounded-xl border border-border bg-secondary/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Authorized adult {i + 2}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveGuardian(g.id)}
                aria-label={`Remove authorized adult ${i + 2}`}
              >
                <Trash2 data-icon="inline-start" />
                Remove
              </Button>
            </div>
            <GuardianFields
              guardian={g}
              index={i + 1}
              showEmail={false}
              errors={errors}
              onChange={(patch) => onGuardianChange(g.id, patch)}
            />
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <Button type="button" variant="outline" className="w-fit" onClick={onAddGuardian}>
            <Plus data-icon="inline-start" />
            Add another authorized adult
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
