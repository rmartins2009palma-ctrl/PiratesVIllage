import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { KidsRegistry } from "@/components/kids/kids-registry"

export default function KidsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <KidsRegistry />
      </div>
    </div>
  )
}
