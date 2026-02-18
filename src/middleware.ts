import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SEGMENT_COOKIE, SESSION_COOKIE } from "@/lib/cookie-names";
import { normaliseComponentParam } from "@/lib/normalise-component-param";
import type { PersonalisationSession } from "@/lib/types";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Scenario 3: Rewrite to segment-specific path for segment-based static pages
  if (pathname === "/scenario-3" || pathname === "/scenario-3/") {
    const segment = request.cookies.get(SEGMENT_COOKIE)?.value ?? "A";
    const url = request.nextUrl.clone();
    url.pathname = `/scenario-3/${segment}`;
    return NextResponse.rewrite(url);
  }

  // Scenario 10: Same as 3 but segment from header (or query for demo); no cookie
  if (pathname === "/scenario-10" || pathname === "/scenario-10/") {
    const raw =
      request.headers.get("x-segment") ??
      request.nextUrl.searchParams.get("segment") ??
      "A";
    const segment = raw === "B" ? "B" : "A";
    const url = request.nextUrl.clone();
    url.pathname = `/scenario-10/${segment}`;
    return NextResponse.rewrite(url);
  }

  // Mobile API: segment in header only; rewrite to segment-specific path for CDN cache
  if (pathname === "/api/mobile/content" || pathname === "/api/mobile/content/") {
    const raw = request.headers.get("x-segment") ?? "A";
    const segment = raw === "B" ? "B" : "A";
    const url = request.nextUrl.clone();
    url.pathname = `/api/mobile/content/${segment}`;
    return NextResponse.rewrite(url);
  }

  // Scenario 9: Read session cookie; add component query params for /scenario-9
  if (pathname === "/scenario-9" || pathname === "/scenario-9/") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
    if (!sessionCookie) return NextResponse.next();
    let session: PersonalisationSession;
    try {
      // New format: encoded. Old format: raw JSON (backward compat).
      try {
        session = JSON.parse(decodeURIComponent(sessionCookie)) as PersonalisationSession;
      } catch {
        session = JSON.parse(sessionCookie) as PersonalisationSession;
      }
    } catch {
      return NextResponse.next();
    }
    const { personalisationRules } = session;
    if (!personalisationRules?.length) return NextResponse.next();

    const url = request.nextUrl.clone();
    let added = false;
    for (const rule of personalisationRules) {
      const pageUrls = Array.isArray(rule.pageUrls) ? rule.pageUrls : [rule.pageUrls];
      if (pageUrls.some((p) => p === pathname || pathname.startsWith(p + "/"))) {
        const raw = `${rule.componentName}-${rule.componentReplacementName}`;
        const value = normaliseComponentParam(raw);
        url.searchParams.append("component", value);
        added = true;
      }
    }
    if (added) {
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/scenario-3",
    "/scenario-3/",
    "/scenario-10",
    "/scenario-10/",
    "/api/mobile/content",
    "/api/mobile/content/",
    "/scenario-9",
    "/scenario-9/",
  ],
};
