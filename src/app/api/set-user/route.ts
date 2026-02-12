import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/users";
import { getSalesforceUserContext } from "@/lib/salesforce";
import { USER_EMAIL_COOKIE, SEGMENT_COOKIE, SESSION_COOKIE } from "@/lib/cookie-names";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const redirectTo = url.searchParams.get("redirect") ?? "/";

  // Redirect to same-origin path so cookies are set on the redirect response — reliable on Vercel
  const origin = url.origin;
  const safePath = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
  const redirectUrl = new URL(safePath, origin);

  if (!email) {
    redirectUrl.searchParams.set("error", "email-required");
    return NextResponse.redirect(redirectUrl, 302);
  }
  const user = await getUserByEmail(email);
  if (!user) {
    redirectUrl.searchParams.set("error", "user-not-found");
    return NextResponse.redirect(redirectUrl, 302);
  }
  // Call mock Salesforce and get user context (segment + personalisation rules for Scenario 9).
  const sfContext = await getSalesforceUserContext(email);
  const segment = sfContext?.segment ?? "A";
  const personalisationRules = sfContext?.personalisationRules ?? [];

  const res = NextResponse.redirect(redirectUrl, 302);
  const isSecure = url.protocol === "https:";
  const cookieOpts = {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
    secure: isSecure,
    sameSite: "lax" as const,
  };
  res.cookies.set(USER_EMAIL_COOKIE, user.email, cookieOpts);
  res.cookies.set(SEGMENT_COOKIE, segment, cookieOpts);
  // Scenario 9: store session (segment + page/component rules) for middleware.
  const sessionPayload = encodeURIComponent(JSON.stringify({ segment, personalisationRules }));
  res.cookies.set(SESSION_COOKIE, sessionPayload, cookieOpts);
  return res;
}
