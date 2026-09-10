"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KIDS, type Kid } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { FilterBar, type FilterType, type SortBy, type ViewMode } from "./filter-bar"
import { KidGridCard } from "./kid-grid-card"
import { KidListRow } from "./kid-list-row"
import { KidsEmptyState } from "./kids-empty-state"
import { KidsSkeleton } from "./kids-skeleton"
import { CheckInModal, type CheckAction } from "./check-in-modal"

const TODAY_ISO = "2026-09-10"

function matchesSearch(kid: Kid, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const name = `${kid.firstName} ${kid.lastName}`.toLowerCase()
  if (name.includes(q)) return true
  if (kid.room.toLowerCase().includes(q)) return true
  return kid.guardians.some((g) => g.fullName.toLowerCase().includes(q))
}

function matchesFilters(kid: Kid, filters: Set<FilterType>): boolean {
  if (filters.size === 0 || filters.has("all")) return true
  let pass = true
  if (filters.has("in")) pass = pass && kid.status === "in"
  if (filters.has("out")) pass = pass && kid.status === "out"
  if (filters.has("today")) pass = pass && kid.registeredOn === TODAY_ISO
  if (filters.has("allergies")) pass = pass && Boolean(kid.allergies || kid.medical)
  return pass
}

function sortKids(kids: Kid[], sortBy: SortBy): Kid[] {
  const sorted = [...kids]
  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
    case "age":
      return sorted.sort((a, b) => a.age - b.age)
    case "registered":
      return sorted.sort((a, b) => b.registeredOn.localeCompare(a.registeredOn))
    case "recent":
    default:
      return sorted.sort((a, b) => b.lastVisit.localeCompare(a.lastVisit))
  }
}

export function KidsRegistry() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [activeFilters, setActiveFilters] = useState<Set<FilterType>>(new Set(["all"]))
  const [sortBy, setSortBy] = useState<SortBy>("recent")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [loading, setLoading] = useState(true)
  const [modalKid, setModalKid] = useState<Kid | null>(null)

  // Simulate initial load with skeleton
  useMemo(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  // Debounce search
  useMemo(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 200)
    return () => clearTimeout(t)
  }, [search])

  const counts = useMemo<Record<FilterType, number>>(() => ({
    all: KIDS.length,
    in: KIDS.filter((k) => k.status === "in").length,
    out: KIDS.filter((k) => k.status === "out").length,
    today: KIDS.filter((k) => k.registeredOn === TODAY_ISO).length,
    allergies: KIDS.filter((k) => k.allergies || k.medical).length,
  }), [])

  const filtered = useMemo(() => {
    const result = KIDS.filter(
      (k) => matchesSearch(k, debouncedSearch) && matchesFilters(k, activeFilters),
    )
    return sortKids(result, sortBy)
  }, [debouncedSearch, activeFilters, sortBy])

  const handleFilterToggle = useCallback((filter: FilterType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (filter === "all") {
        next.clear()
        next.add("all")
        return next
      }
      next.delete("all")
      if (next.has(filter)) {
        next.delete(filter)
      } else {
        next.add(filter)
      }
      if (next.size === 0) next.add("all")
      return next
    })
  }, [])

  const handleCheckAction = useCallback((kid: Kid) => {
    setModalKid(kid)
  }, [])

  const handleModalClose = useCallback(() => {
    setModalKid(null)
  }, [])

  const handleModalConfirm = useCallback(
    (_kid: Kid, _action: CheckAction, _guardianName: string, _time: string) => {
      // In a real app this would update the database; here we just close after the success animation
    },
    [],
  )

  return (
    <main className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Crew Registry</h1>
            <p className="text-sm text-muted-foreground">
              All registered adventurers this season
            </p>
          </div>
          <Button size="lg" render={<Link href="/register" />}>
            <UserPlus data-icon="inline-start" />
            New registration
          </Button>
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          counts={counts}
        />

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Loading..."
              : `${filtered.length} ${filtered.length === 1 ? "adventurer" : "adventurers"} found`}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <KidsSkeleton view={viewMode} />
        ) : filtered.length === 0 ? (
          <KidsEmptyState hasSearch={debouncedSearch.trim().length > 0} searchTerm={debouncedSearch} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((kid) => (
              <KidGridCard key={kid.id} kid={kid} onCheckAction={handleCheckAction} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-2">
            {/* Column headers */}
            <div className="hidden grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 border-b border-border px-4 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid">
              <span className="w-10" />
              <span>Name</span>
              <span>Room</span>
              <span>Status</span>
              <span>Last visit</span>
              <span className="text-right">Actions</span>
            </div>
            {filtered.map((kid) => (
              <KidListRow key={kid.id} kid={kid} onCheckAction={handleCheckAction} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Link
        href="/register"
        className={cn(
          "fixed bottom-6 right-6 z-30 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-all hover:brightness-110 hover:shadow-xl sm:hidden",
        )}
        aria-label="New registration"
      >
        <UserPlus className="size-6" />
      </Link>

      {/* Check-in/out modal */}
      {modalKid && (
        <CheckInModal
          kid={modalKid}
          action={modalKid.status === "in" ? "out" : "in"}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        />
      )}
    </main>
  )
}
