import { Suspense } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import { CompassRose } from "@/components/compass-rose"
import { LoginForm } from "@/components/auth/login-form"
import { HOTEL } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Sign in · Pirates Village Kids Club",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel — a full column on desktop, a compact banner above the
          form on narrower screens. */}
      <section className="relative flex shrink-0 flex-col overflow-hidden bg-primary p-6 text-primary-foreground max-lg:h-[120px] max-lg:justify-center sm:max-lg:h-[200px] lg:w-[60%] lg:p-10">
        <CompassRose
          className="pointer-events-none absolute -right-20 top-1/2 hidden size-[420px] -translate-y-1/2 opacity-[0.06] lg:block"
        />

        <div className="relative flex items-center gap-4">
          {/* The real mark, framed rather than pasted: the source is a JPEG with
              no transparency, so a cream medallion makes its white ground read
              as deliberate instead of as a stray rectangle. */}
          <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary p-1 shadow-card sm:size-20">
            <Image
              src="/logo.jpeg"
              alt=""
              width={160}
              height={160}
              priority
              className="size-full rounded-xl object-contain"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate font-serif text-xl font-bold leading-tight sm:text-2xl">
              {HOTEL.name}
            </p>
            <p className="truncate text-sm uppercase tracking-[0.18em] text-primary-foreground/75">
              Kids Club Manager
            </p>
          </div>
        </div>

        <p className="relative mt-auto hidden font-serif text-4xl font-bold leading-tight lg:block">
          Ready when you are.
        </p>

        <p className="relative mt-6 hidden text-sm text-primary-foreground/60 lg:block">v1.0</p>
      </section>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center bg-background px-6 py-10 lg:w-[40%]">
        <Suspense fallback={<div className="h-[520px] w-full max-w-sm" />}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  )
}
