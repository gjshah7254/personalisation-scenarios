import { NextResponse } from "next/server";
import { USER_EMAIL_COOKIE, SEGMENT_COOKIE, SESSION_COOKIE } from "@/lib/cookie-names";

/**
 * Clears personalisation cookies and redirects to home so the user starts a new session.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const homeUrl = new URL("/", url.origin);
  const res = NextResponse.redirect(homeUrl, 302);
  const opts = {
    path: "/",
    maxAge: 0,
    secure: url.protocol === "https:",
    sameSite: "lax" as const,
  };
  res.cookies.set(USER_EMAIL_COOKIE, "", opts);
  res.cookies.set(SEGMENT_COOKIE, "", opts);
  res.cookies.set(SESSION_COOKIE, "", opts);
  return res;
}
