// Mock authentication. Replaced wholesale by Supabase in the next phase — the
// cookie name and the two helpers are the only contract the rest of the app
// depends on.

export const SESSION_COOKIE = "pv_session"

/** Credentials accepted by the stub. Any well-formed email pairs with this. */
export const DEMO_PASSWORD = "test1234"

export const MAX_ATTEMPTS = 3

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function signIn(email: string, password: string): boolean {
  return isValidEmail(email) && password === DEMO_PASSWORD
}

/** Session-scoped so a reload clears it, which keeps the locked state testable. */
export function startSession(remember: boolean) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 12
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${maxAge}; samesite=lax`
}

export function endSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`
}
