import Link from "next/link"
import { Compass, Users } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { buttonVariants } from "@/components/ui/button"

export default function ChildNotFound() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-6">
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Compass className="size-8" />
            </span>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                This adventurer is off the charts
              </h1>
              <p className="mt-1 text-muted-foreground">
                We could not find a child with that reference. They may have been removed from the
                registry, or the link is out of date.
              </p>
            </div>
            <Link href="/kids" className={buttonVariants()}>
              <Users data-icon="inline-start" />
              Back to the crew registry
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
