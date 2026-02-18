import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SEGMENT_COOKIE } from "@/lib/cookie-names";

/**
 * Redirects to /scenario-10 with segment from the segment cookie.
 * Acts like a small BFF: cookie is read here only; middleware for scenario-10 never reads cookies.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const segmentValue = cookieStore.get(SEGMENT_COOKIE)?.value ?? "A";
  const segment = segmentValue === "B" ? "B" : "A";
  const redirectUrl = new URL("/scenario-10", url.origin);
  redirectUrl.searchParams.set("segment", segment);
  return NextResponse.redirect(redirectUrl, 302);
}
