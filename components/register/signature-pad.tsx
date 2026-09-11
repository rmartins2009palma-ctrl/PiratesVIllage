"use client"

import { BRAND_INK } from "@/lib/brand-constants"
import { useCallback, useEffect, useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Check, Eraser, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const PAD_HEIGHT = 200

export function SignaturePad({
  onSignatureChange,
}: {
  onSignatureChange: (hasSignature: boolean) => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const padRef = useRef<SignatureCanvas>(null)
  const [width, setWidth] = useState(0)
  const [thick, setThick] = useState(false)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleEnd = useCallback(() => {
    const empty = padRef.current?.isEmpty() ?? true
    setSigned(!empty)
    onSignatureChange(!empty)
  }, [onSignatureChange])

  const handleClear = useCallback(() => {
    padRef.current?.clear()
    setSigned(false)
    onSignatureChange(false)
  }, [onSignatureChange])

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-xl border-2 border-dashed border-input bg-secondary/40"
        style={{ height: PAD_HEIGHT }}
      >
        {/* Guide line + placeholder, fades on interaction */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-10 bottom-16 flex flex-col items-center gap-3 transition-opacity duration-500",
            signed ? "opacity-0" : "opacity-100",
          )}
        >
          <span className="font-serif text-xl tracking-wide text-muted-foreground">Sign here</span>
          <div className="h-0.5 w-full animate-wave-drift rounded-full bg-[repeating-linear-gradient(90deg,var(--color-accent)_0_10px,transparent_10px_18px)] opacity-40" />
        </div>

        {width > 0 && (
          <SignatureCanvas
            ref={padRef}
            penColor={BRAND_INK}
            minWidth={thick ? 1.8 : 0.9}
            maxWidth={thick ? 3.8 : 2.2}
            dotSize={thick ? 2.4 : 1.4}
            clearOnResize={false}
            onEnd={handleEnd}
            canvasProps={{
              width,
              height: PAD_HEIGHT,
              className: "touch-none",
              role: "application",
              tabIndex: 0,
              "aria-label":
                "Signature pad. Draw the guardian's signature using touch, stylus, or mouse.",
            }}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleClear}>
            <Eraser data-icon="inline-start" />
            Clear signature
          </Button>
          <Button
            type="button"
            variant={thick ? "default" : "outline"}
            size="sm"
            onClick={() => setThick((t) => !t)}
            aria-pressed={thick}
          >
            <PenLine data-icon="inline-start" />
            {thick ? "Bold pen" : "Fine pen"}
          </Button>
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="cursor-help text-xs text-muted-foreground underline decoration-dotted underline-offset-4">
                  How do I sign?
                </span>
              }
            />
            <TooltipContent side="top">
              On a tablet, sign with a finger or stylus. With a mouse, click and drag inside the box.
            </TooltipContent>
          </Tooltip>
        </div>

        {signed && (
          <span className="flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-sm font-medium text-success">
            <Check className="size-4" />
            Signature captured
          </span>
        )}
      </div>
    </div>
  )
}
