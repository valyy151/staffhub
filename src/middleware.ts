import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const month = new Date().toLocaleDateString("en-GB", {
  month: "2-digit",
  year: "numeric",
})
const [m, y] = month.split("/")

export function middleware(request: NextRequest): NextResponse | void {
  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    !request.nextUrl.searchParams.get("month")
  ) {
    return NextResponse.redirect(
      new URL(`/dashboard?page=${0}&month=${m}_${y}`, request.url),
    )
  }

  if (
    request.nextUrl.pathname.includes("/staff") &&
    request.nextUrl.pathname.includes("/schedule") &&
    !request.nextUrl.searchParams.get("month")
  ) {
    return NextResponse.redirect(new URL(`?month=${m}_${y}`, request.url))
  }
}

export const config = {
  matcher: ["/((?!api|static|favicon.ico).*)"],
}
