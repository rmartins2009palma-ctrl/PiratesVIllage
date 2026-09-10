"use client"

import { useState } from "react"
import Image from "next/image"
import { Anchor, Eye } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { KidPresenceCard } from "./kid-presence-card"
import type { Kid } from "@/lib/mock-data"

export function PresencePanel({ kids }: { kids: Kid[] }) {
  const [previewEmpty, setPreviewEmpty] = useState(false)
  const present = previewEmpty ? [] : kids

  return (
    <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-card to-secondary/40">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Anchor className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Currently in club
            </p>
            <p className="font-serif text-3xl font-bold leading-none text-foreground">
              {present.length}{" "}
              <span className="font-sans text-base font-normal text-muted-foreground">
                {present.length === 1 ? "adventurer aboard" : "adventurers aboard"}
              </span>
            </p>
          </div>
        </div>

        {/* Demo affordance to preview the empty state */}
        <button
          type="button"
          onClick={() => setPreviewEmpty((v) => !v)}
          className="flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Eye className="size-3.5" />
          {previewEmpty ? "Show crew" : "Preview empty"}
        </button>
      </CardHeader>

      <CardContent className="pt-5">
        {present.length > 0 ? (
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 pb-3">
              {present.map((kid) => (
                <KidPresenceCard key={kid.id} kid={kid} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <Image
              src="/compass-rose.png"
              alt=""
              width={96}
              height={96}
              className="opacity-25"
            />
            <div>
              <p className="font-serif text-lg font-semibold text-foreground">
                The club is quiet
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                No adventurers on board right now. Start a registration or check in a child to set sail.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
