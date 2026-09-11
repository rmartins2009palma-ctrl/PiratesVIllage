"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  LogIn,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Anchor,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HOTEL } from "@/lib/mock-data"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
  label: string
  icon: typeof LayoutDashboard
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Kids", icon: Users, href: "/kids" },
  { label: "Check-in", icon: LogIn, href: "/checkin" },
  { label: "Statistics", icon: BarChart3, href: "/statistics" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const asideRef = useRef<HTMLElement>(null)

  // Working space wins: any press outside the rail folds it away, and pressing
  // the rail brings it back. Listening on pointerdown (capture) so it settles
  // before the click lands on whatever was pressed.
  useEffect(() => {
    const handle = (event: PointerEvent) => {
      if (asideRef.current?.contains(event.target as Node)) return
      setCollapsed(true)
    }
    document.addEventListener("pointerdown", handle, true)
    return () => document.removeEventListener("pointerdown", handle, true)
  }, [])

  return (
    <aside
      ref={asideRef}
      onPointerDown={() => setCollapsed(false)}
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[76px]" : "w-64",
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-20 items-center gap-3 border-b border-sidebar-border px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Anchor className="size-6" strokeWidth={2.25} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-serif text-base font-semibold leading-tight text-sidebar-foreground">
              {HOTEL.name}
            </p>
            <p className="truncate text-xs uppercase tracking-[0.18em] text-sidebar-foreground/75">
              {HOTEL.club}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1.5 p-3" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const link = (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={isActive ? 2.4 : 2} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )

          return collapsed ? (
            <Tooltip key={item.label}>
              <TooltipTrigger render={link} />
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            link
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="size-5 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
