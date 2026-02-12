import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/users";
import { getSalesforceUserContext } from "@/lib/salesforce";
import { USER_EMAIL_COOKIE, SEGMENT_COOKIE, SESSION_COOKIE } from "@/lib/cookie-names";

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email required (query param: ?email=...)" }, { status: 400 });
  }
  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // Call mock Salesforce and get user context (segment + personalisation rules for Scenario 9).
  const sfContext = await getSalesforceUserContext(email);
  const segment = sfContext?.segment ?? "A";
  const personalisationRules = sfContext?.personalisationRules ?? [];

  const res = NextResponse.json({ ok: true });
  const isSecure = new URL(request.url).protocol === "https:";
  const cookieOpts = {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
    secure: isSecure,
    sameSite: "lax" as const,
  };
  res.cookies.set(USER_EMAIL_COOKIE, user.email, cookieOpts);
  res.cookies.set(SEGMENT_COOKIE, segment, cookieOpts);
  // Scenario 9: store session (segment + page/component rules) for middleware
  res.cookies.set(
    SESSION_COOKIE,
    JSON.stringify({ segment, personalisationRules }),
    cookieOpts
  );
  return res;
}
