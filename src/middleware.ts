import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const SEGMENT_COOKIE = "personalisation-segment";
export const USER_ID_COOKIE = "personalisation-user-id";

export function middleware(request: NextRequest) {
  // Scenario 3: Rewrite to segment-specific path for segment-based static pages
  const segment = request.cookies.get(SEGMENT_COOKIE)?.value ?? "A";
  const pathname = request.nextUrl.pathname;

  // Only rewrite segment-scoped routes (Scenario 3 page)
  if (pathname === "/scenario-3" || pathname === "/scenario-3/") {
    const url = request.nextUrl.clone();
    url.pathname = `/scenario-3/${segment}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/scenario-3", "/scenario-3/"],
};
