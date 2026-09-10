import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { ChildDetail } from "@/components/kids/detail/child-detail"
import { KIDS, fullName } from "@/lib/mock-data"

interface ChildPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ChildPageProps): Promise<Metadata> {
  const { id } = await params
  const kid = KIDS.find((k) => k.id === id)
  return {
    title: kid ? `${fullName(kid)} · Pirates Village Kids Club` : "Child not found",
  }
}

export default async function ChildPage({ params }: ChildPageProps) {
  const { id } = await params
  const kid = KIDS.find((k) => k.id === id)

  if (!kid) notFound()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <ChildDetail kid={kid} />
      </div>
    </div>
  )
}
