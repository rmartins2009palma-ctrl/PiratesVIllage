"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CheckInModal, type CheckAction } from "@/components/kids/check-in-modal"
import { CURRENT_USER, type Guardian, type Kid, type StaffNote, fullName } from "@/lib/mock-data"
import { ChildHero } from "./child-hero"
import {
  DetailTabs,
  type DetailTabId,
  buildTabs,
  tabButtonId,
  tabPanelId,
} from "./detail-tabs"
import { TabGuardians } from "./tab-guardians"
import { TabNotes } from "./tab-notes"
import { TabOverview } from "./tab-overview"
import { TabVisits } from "./tab-visits"

function nowStamp(): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function ChildDetail({ kid }: { kid: Kid }) {
  const [activeTab, setActiveTab] = useState<DetailTabId>("overview")
  const [guardians, setGuardians] = useState<Guardian[]>(kid.guardians)
  const [notes, setNotes] = useState<StaffNote[]>(kid.staffNotes)
  const [modalOpen, setModalOpen] = useState(false)

  // The modal and the Overview cards read the live guardian list, not the frozen mock.
  const liveKid = useMemo<Kid>(() => ({ ...kid, guardians }), [kid, guardians])

  const tabs = useMemo(
    () =>
      buildTabs({
        visits: kid.history.length,
        guardians: guardians.length,
        notes: notes.length,
      }),
    [kid.history.length, guardians.length, notes.length],
  )

  const handleRemoveGuardian = useCallback((id: string) => {
    setGuardians((current) => current.filter((g) => g.id !== id))
  }, [])

  const handleAddNote = useCallback((text: string) => {
    setNotes((current) => [
      { id: `n-${Date.now()}`, author: CURRENT_USER.name, timestamp: nowStamp(), text },
      ...current,
    ])
  }, [])

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((current) => current.filter((n) => n.id !== id))
  }, [])

  const handleModalConfirm = useCallback(
    (_kid: Kid, _action: CheckAction, _guardianName: string, _time: string) => {
      // Frontend-only mock: the success animation closes the modal on its own.
    },
    [],
  )

  return (
    <main className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-6 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          <Link
            href="/kids"
            className="flex items-center gap-1.5 rounded font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft className="size-4" />
            Kids
          </Link>
          <span aria-hidden className="text-muted-foreground/50">
            /
          </span>
          <span className="truncate text-foreground" aria-current="page">
            {fullName(kid)}
          </span>
        </nav>

        <ChildHero kid={liveKid} onCheckAction={() => setModalOpen(true)} />

        <DetailTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        <div
          role="tabpanel"
          id={tabPanelId(activeTab)}
          aria-labelledby={tabButtonId(activeTab)}
          tabIndex={0}
          className="focus-visible:outline-none"
        >
          {activeTab === "overview" && <TabOverview kid={liveKid} />}
          {activeTab === "visits" && <TabVisits kid={liveKid} />}
          {activeTab === "guardians" && (
            <TabGuardians guardians={guardians} onRemove={handleRemoveGuardian} />
          )}
          {activeTab === "notes" && (
            <TabNotes notes={notes} onAdd={handleAddNote} onDelete={handleDeleteNote} />
          )}
        </div>
      </div>

      {modalOpen && (
        <CheckInModal
          kid={liveKid}
          action={kid.status === "in" ? "out" : "in"}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
        />
      )}
    </main>
  )
}
