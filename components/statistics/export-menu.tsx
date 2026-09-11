"use client"

import { useEffect, useRef, useState } from "react"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Format picker only — the export itself is stubbed until there is a backend. */
export function ExportMenu() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={wrapRef} className="relative">
      <Button
        size="lg"
        className="h-11 bg-accent px-5 font-semibold text-accent-foreground hover:brightness-105"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Download data-icon="inline-start" />
        Export report
      </Button>

      {open && (
        <div
          role="menu"
          aria-label="Export format"
          className="absolute right-0 top-13 z-20 w-52 overflow-hidden rounded-xl border border-border bg-popover shadow-card-hover"
        >
          {[
            { icon: FileSpreadsheet, label: "Excel spreadsheet" },
            { icon: FileText, label: "PDF report" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-3 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none"
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
