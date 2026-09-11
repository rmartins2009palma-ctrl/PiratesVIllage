import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { Settings } from "@/components/settings/settings"

export const metadata: Metadata = {
  title: "Settings · Pirates Village Kids Club",
}

export default function SettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <Settings />
      </div>
    </div>
  )
}
