import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { Statistics } from "@/components/statistics/statistics"

export const metadata: Metadata = {
  title: "Ship's Log · Pirates Village Kids Club",
}

export default function StatisticsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <Statistics />
      </div>
    </div>
  )
}
