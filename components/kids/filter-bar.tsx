"use client"

import { Clock, LayoutGrid, List, Search, TriangleAlert, Users, X } from "lucide-react"
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
import { cn } from "@/lib/utils"

export type FilterType = "all" | "in" | "out" | "today" | "allergies"
export type SortBy = "recent" | "name" | "age" | "registered"
export type ViewMode = "grid" | "list"

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  activeFilters: Set<FilterType>
  onFilterToggle: (filter: FilterType) => void
  sortBy: SortBy
  onSortChange: (value: SortBy) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  counts: Record<FilterType, number>
}

const FILTER_CHIPS: { type: FilterType; label: string; icon?: typeof Clock; dotClass?: string }[] = [
  { type: "all", label: "All" },
  { type: "in", label: "In club", dotClass: "bg-success" },
  { type: "out", label: "Out", dotClass: "bg-muted-foreground/50" },
  { type: "today", label: "Registered today", icon: Clock },
  { type: "allergies", label: "With allergies", icon: TriangleAlert },
]

export function FilterBar({
  search,
  onSearchChange,
  activeFilters,
  onFilterToggle,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  counts,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 space-y-3 bg-background/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, room number, or guardian..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9 text-sm"
            aria-label="Search children"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="size-4" />
            </button>
          </div>

          <Select
            value={sortBy}
            onValueChange={(v) => onSortChange(v as SortBy)}
          >
            <SelectTrigger className="h-10 w-[180px] text-sm" aria-label="Sort by">
              <span className="text-muted-foreground">Sort:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="recent">Recent activity</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="age">Age</SelectItem>
                <SelectItem value="registered">Registration date</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilters.has(chip.type)
          const count = counts[chip.type] ?? 0
          const Icon = chip.icon
          return (
            <button
              key={chip.type}
              type="button"
              onClick={() => onFilterToggle(chip.type)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-accent hover:text-foreground",
              )}
            >
              {chip.dotClass && (
                <span className={cn("size-2 rounded-full", chip.dotClass)} />
              )}
              {Icon && <Icon className="size-3.5" />}
              {chip.label}
              <span className={cn("tabular-nums", isActive ? "text-primary-foreground/70" : "text-muted-foreground/60")}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
