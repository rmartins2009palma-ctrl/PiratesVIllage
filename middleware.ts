import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth"

const PUBLIC_PATHS = new Set(["/login"])

export function middleware(request: NextRequest) {
  const signedIn = request.cookies.get(SESSION_COOKIE)?.value === "1"
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.has(pathname)

  if (!signedIn && !isPublic) {
    const url = new URL("/login", request.url)
    // Remember where they were headed so sign-in can return them there.
    if (pathname !== "/") url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }
  if (signedIn && isPublic) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  return NextResponse.next()
}

export const config = {
  // Everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:png|jpg|jpeg|svg|ico|webp)$).*)"],
}
