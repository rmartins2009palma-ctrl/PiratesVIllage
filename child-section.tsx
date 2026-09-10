"use client"

import { Compass, HeartPulse, NotebookPen, TriangleAlert } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AGES, type RegistrationDraft } from "@/lib/registration"
import { cn } from "@/lib/utils"

interface Props {
  draft: RegistrationDraft
  onChange: (patch: Partial<RegistrationDraft>) => void
  errors: Record<string, string>
}

function Req() {
  return <span className="text-destructive"> *</span>
}

export function ChildSection({ draft, onChange, errors }: Props) {
  return (
    <Card className="scroll-mt-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Compass className="size-5" />
          </span>
          <div>
            <CardTitle className="font-serif text-xl">About the little adventurer</CardTitle>
            <CardDescription>Tell us who is joining the crew today.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field data-invalid={!!errors.firstName || undefined}>
            <FieldLabel htmlFor="firstName">
              First name<Req />
            </FieldLabel>
            <Input
              id="firstName"
              autoFocus
              autoComplete="off"
              placeholder="e.g., Emma"
              value={draft.firstName}
              aria-invalid={!!errors.firstName || undefined}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              onChange={(e) => onChange({ firstName: e.target.value })}
            />
            {errors.firstName && <FieldError id="firstName-error">{errors.firstName}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.lastName || undefined}>
            <FieldLabel htmlFor="lastName">
              Last name<Req />
            </FieldLabel>
            <Input
              id="lastName"
              autoComplete="off"
              placeholder="e.g., Thompson"
              value={draft.lastName}
              aria-invalid={!!errors.lastName || undefined}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              onChange={(e) => onChange({ lastName: e.target.value })}
            />
            {errors.lastName && <FieldError id="lastName-error">{errors.lastName}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.age || undefined}>
            <FieldLabel htmlFor="age">
              Age<Req />
            </FieldLabel>
            <Select
              value={draft.age === "" ? null : draft.age}
              onValueChange={(value) => onChange({ age: (value as string) ?? "" })}
            >
              <SelectTrigger
                id="age"
                className="w-full"
                aria-invalid={!!errors.age || undefined}
                aria-describedby={errors.age ? "age-error" : undefined}
              >
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {AGES.map((age) => (
                    <SelectItem key={age} value={String(age)}>
                      {age} years
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {draft.age && !errors.age ? (
              <FieldDescription>{draft.age} years young</FieldDescription>
            ) : null}
            {errors.age && <FieldError id="age-error">{errors.age}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.room || undefined}>
            <FieldLabel htmlFor="room">
              Room number<Req />
            </FieldLabel>
            <Input
              id="room"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g., 214"
              value={draft.room}
              aria-invalid={!!errors.room || undefined}
              aria-describedby={errors.room ? "room-error" : undefined}
              onChange={(e) => onChange({ room: e.target.value })}
            />
            {errors.room && <FieldError id="room-error">{errors.room}</FieldError>}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="allergies" className="gap-1.5">
            <TriangleAlert className="size-4 text-warning" />
            Allergies
          </FieldLabel>
          <Textarea
            id="allergies"
            placeholder="e.g., nuts, dairy, none"
            value={draft.allergies}
            onChange={(e) => onChange({ allergies: e.target.value })}
            className={cn(
              draft.allergies.trim() &&
                "border-warning/60 bg-warning/10 focus-visible:border-warning focus-visible:ring-warning/20",
            )}
          />
          {draft.allergies.trim() ? (
            <FieldDescription className="flex items-center gap-1.5 text-warning-foreground">
              <TriangleAlert className="size-3.5 text-warning" />
              Important info captured — staff will be alerted.
            </FieldDescription>
          ) : (
            <FieldDescription>Optional, but please note anything the crew should watch for.</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="medical" className="gap-1.5">
            <HeartPulse className="size-4 text-warning" />
            Illness or disability
          </FieldLabel>
          <Textarea
            id="medical"
            placeholder="e.g., mild asthma (inhaler at reception), none"
            value={draft.medical}
            onChange={(e) => onChange({ medical: e.target.value })}
            className={cn(
              draft.medical.trim() &&
                "border-warning/60 bg-warning/10 focus-visible:border-warning focus-visible:ring-warning/20",
            )}
          />
          {draft.medical.trim() ? (
            <FieldDescription className="flex items-center gap-1.5 text-warning-foreground">
              <HeartPulse className="size-3.5 text-warning" />
              Important info captured — staff will be alerted.
            </FieldDescription>
          ) : (
            <FieldDescription>Optional. Include anything affecting participation or care.</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="notes" className="gap-1.5">
            <NotebookPen className="size-4 text-muted-foreground" />
            Special notes for staff
          </FieldLabel>
          <Textarea
            id="notes"
            placeholder="e.g., shy at first, loves drawing"
            value={draft.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            className="min-h-12"
          />
        </Field>
      </CardContent>
    </Card>
  )
}
