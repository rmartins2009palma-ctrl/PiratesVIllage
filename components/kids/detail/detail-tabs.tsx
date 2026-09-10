"use client"

import { useRef } from "react"
import { ClipboardList, FileText, History, UsersRound } from "lucide-react"
import { cn } from "@/lib/utils"

export type DetailTabId = "overview" | "visits" | "guardians" | "notes"

export interface DetailTab {
  id: DetailTabId
  label: string
  icon: typeof ClipboardList
  count?: number
}

export const DETAIL_TAB_ORDER: DetailTabId[] = ["overview", "visits", "guardians", "notes"]

export function tabPanelId(id: DetailTabId) {
  return `child-panel-${id}`
}

export function tabButtonId(id: DetailTabId) {
  return `child-tab-${id}`
}

export function buildTabs(counts: {
  visits: number
  guardians: number
  notes: number
}): DetailTab[] {
  return [
    { id: "overview", label: "Overview", icon: ClipboardList },
    { id: "visits", label: "Visit history", icon: History, count: counts.visits },
    { id: "guardians", label: "Guardians", icon: UsersRound, count: counts.guardians },
    { id: "notes", label: "Staff notes", icon: FileText, count: counts.notes },
  ]
}

interface DetailTabsProps {
  tabs: DetailTab[]
  active: DetailTabId
  onChange: (id: DetailTabId) => void
}

export function DetailTabs({ tabs, active, onChange }: DetailTabsProps) {
  const listRef = useRef<HTMLDivElement>(null)

  // Roving arrow-key navigation, as expected of a tablist.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"]
    if (!keys.includes(event.key)) return
    event.preventDefault()

    const index = tabs.findIndex((t) => t.id === active)
    let next = index
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === "ArrowRight") next = (index + 1) % tabs.length
    else if (event.key === "Home") next = 0
    else next = tabs.length - 1

    onChange(tabs[next].id)
    listRef.current
      ?.querySelector<HTMLButtonElement>(`#${tabButtonId(tabs[next].id)}`)
      ?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Child details"
      onKeyDown={handleKeyDown}
      className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-1.5 sm:grid-cols-4"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            id={tabButtonId(tab.id)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={tabPanelId(tab.id)}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "flex min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
