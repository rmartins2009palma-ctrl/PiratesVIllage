"use client"

import { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Mail,
  TriangleAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { DEMO_PASSWORD, MAX_ATTEMPTS, signIn, startSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

type FormState = "idle" | "loading" | "error" | "locked" | "success"

const LANGUAGES = ["EN", "ES", "DE", "FR"] as const

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") ?? "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [reveal, setReveal] = useState(false)
  const [state, setState] = useState<FormState>("idle")
  const [attempts, setAttempts] = useState(0)
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>("EN")
  const [langOpen, setLangOpen] = useState(false)

  const locked = state === "locked"
  const busy = state === "loading" || state === "success"

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      if (busy || locked) return
      setState("loading")

      setTimeout(() => {
        if (signIn(email, password)) {
          setState("success")
          startSession(remember)
          // Let the checkmark land before navigating.
          setTimeout(() => router.replace(next), 400)
          return
        }
        const used = attempts + 1
        setAttempts(used)
        setState(used >= MAX_ATTEMPTS ? "locked" : "error")
      }, 700)
    },
    [busy, locked, email, password, remember, attempts, router, next],
  )

  const describedBy = state === "error" || locked ? "login-error" : undefined

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-6" noValidate>
      <div>
        <h1 className="font-serif text-[1.75rem] font-bold leading-tight text-foreground">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue</p>
      </div>

      {state === "error" && (
        <p
          id="login-error"
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-3 py-2.5 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          Invalid email or password. Please try again.
        </p>
      )}

      {locked && (
        <p
          id="login-error"
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/8 px-3 py-2.5 text-sm text-warning-foreground"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          Account temporarily locked. Try again in 15 minutes.
        </p>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[1.0625rem] font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy || locked}
              aria-invalid={state === "error" || undefined}
              aria-describedby={describedBy}
              className="h-14 pl-10 pr-3.5 text-[1.0625rem]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[1.0625rem] font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="password"
              type={reveal ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy || locked}
              aria-invalid={state === "error" || undefined}
              aria-describedby={describedBy}
              className="h-14 pl-10 pr-12 text-[1.0625rem]"
            />
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              aria-label={reveal ? "Hide password" : "Show password"}
              aria-pressed={reveal}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="remember" className="flex items-center gap-2.5 text-sm text-foreground">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(v) => setRemember(v === true)}
            disabled={busy || locked}
          />
          Remember me on this tablet
        </label>
        <button
          type="button"
          className="rounded text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={busy || locked}
        className={cn(
          "h-14 w-full text-base font-semibold transition-colors",
          state === "success" ? "bg-success text-success-foreground" : "bg-primary",
        )}
      >
        {state === "loading" && (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Signing in...
          </>
        )}
        {state === "success" && (
          <>
            <Check className="size-5" strokeWidth={3} aria-hidden />
            Signed in
          </>
        )}
        {state !== "loading" && state !== "success" && "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Contact your kids club manager if you need access
      </p>

      {/* TEMPORARY: shown in production for the validation phase so the hotel
          can try the deployed app unaccompanied. Remove, or gate behind a build
          flag, before the real deployment to the hotel. */}
      <div className="rounded-xl border border-border bg-secondary/50 px-4 py-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Demo access
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Use any valid email with password:{" "}
          <span className="font-semibold text-foreground">{DEMO_PASSWORD}</span>
        </p>
      </div>

      <div className="relative flex justify-center">
        <button
          type="button"
          onClick={() => setLangOpen((o) => !o)}
          aria-expanded={langOpen}
          aria-haspopup="listbox"
          aria-label={`Language, currently ${language}`}
          className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Globe className="size-4" aria-hidden />
          {language}
          <ChevronDown className={cn("size-4 transition-transform", langOpen && "rotate-180")} />
        </button>
        {langOpen && (
          <ul
            role="listbox"
            aria-label="Language"
            className="absolute bottom-12 z-10 w-28 overflow-hidden rounded-xl border border-border bg-popover shadow-card-hover"
          >
            {LANGUAGES.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={code === language}
                  onClick={() => {
                    setLanguage(code)
                    setLangOpen(false)
                  }}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none"
                >
                  {code}
                  {code === language && <Check className="size-3.5 text-accent" aria-hidden />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  )
}
