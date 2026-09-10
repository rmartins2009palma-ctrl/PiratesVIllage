"use client"

import { Anchor } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Field, FieldError } from "@/components/ui/field"
import { CONSENT_TEXT, CONSENT_VERSION } from "@/lib/registration"
import { SignaturePad } from "@/components/register/signature-pad"
import { cn } from "@/lib/utils"

interface Props {
  consent: boolean
  onConsentChange: (value: boolean) => void
  onSignatureChange: (hasSignature: boolean) => void
  errors: Record<string, string>
}

export function ConsentSection({ consent, onConsentChange, onSignatureChange, errors }: Props) {
  return (
    <Card className="scroll-mt-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Anchor className="size-5" />
          </span>
          <div>
            <CardTitle className="font-serif text-xl">Set sail — parental consent</CardTitle>
            <CardDescription>Please read carefully before signing.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="relative">
          <ScrollArea className="h-56 rounded-xl border border-border bg-secondary/30 p-4 pr-6">
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
              {CONSENT_TEXT.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </ScrollArea>
          <span className="absolute right-3 top-3 rounded-full bg-card px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground ring-1 ring-border">
            {CONSENT_VERSION}
          </span>
        </div>

        <Field
          data-invalid={!!errors.consent || undefined}
          orientation="horizontal"
          className="items-start rounded-xl border border-border bg-card p-4"
        >
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => onConsentChange(checked === true)}
            aria-invalid={!!errors.consent || undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <label
            htmlFor="consent"
            className={cn(
              "cursor-pointer text-sm leading-relaxed text-foreground",
              errors.consent && "text-destructive",
            )}
          >
            I confirm I am the parent or legal guardian of this child and I have read and accepted the terms above.
          </label>
        </Field>
        {errors.consent && <FieldError id="consent-error">{errors.consent}</FieldError>}

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">Guardian signature<span className="text-destructive"> *</span></p>
          <SignaturePad onSignatureChange={onSignatureChange} />
          {errors.signature && <FieldError>{errors.signature}</FieldError>}
        </div>
      </CardContent>
    </Card>
  )
}
