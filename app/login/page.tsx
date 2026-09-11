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
        {/* Centred behind the composition rather than floating off one edge,
            and a touch stronger: at 6% on the right it read as an accident. */}
        <CompassRose
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 hidden size-[560px] -translate-x-1/2 -translate-y-1/2 opacity-[0.09] lg:block"
        />

        {/* Compact banner: the wide screen gets the full composition below. */}
        <div className="relative flex items-center gap-3 lg:hidden">
          <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary p-0.5">
            <Image src="/logo.jpeg" alt="" width={96} height={96} priority className="size-full rounded-lg object-contain" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-serif text-lg font-bold leading-tight">{HOTEL.name}</p>
            <p className="truncate text-xs uppercase tracking-[0.18em] text-primary-foreground/75">
              Kids Club Manager
            </p>
          </div>
        </div>

        {/* The brand moment. Nobody is in a hurry on this screen, so it gets
            the middle of the panel instead of a corner. */}
        <div className="relative my-auto hidden flex-col items-center text-center lg:flex">
          <span className="flex size-40 items-center justify-center overflow-hidden rounded-3xl bg-secondary p-2 shadow-card-hover">
            <Image
              src="/logo.jpeg"
              alt=""
              width={320}
              height={320}
              priority
              className="size-full rounded-2xl object-contain"
            />
          </span>

          <h2 className="mt-7 text-balance font-serif text-5xl font-bold leading-tight">
            Pirates Village
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-primary-foreground/70">
            Kids Club Manager
          </p>

          <span
            aria-hidden
            className="mt-8 h-px w-24 bg-primary-foreground/25"
          />

          <p className="mt-8 font-serif text-2xl text-primary-foreground/85">
            Ready when you are.
          </p>
        </div>

        <p className="relative hidden text-sm text-primary-foreground/50 lg:block">v1.0</p>
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
