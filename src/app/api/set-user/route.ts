import { NextResponse } from "next/server";
import { getUserById } from "@/lib/users";
import { getSalesforceUserContext } from "@/lib/salesforce";
import { USER_ID_COOKIE, SEGMENT_COOKIE } from "@/lib/cookies";

export async function POST(request: Request) {
  const { userId } = (await request.json()) as { userId?: string };
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // Segment comes from Salesforce (mock); keeps middleware and client in sync with SF.
  const sfContext = await getSalesforceUserContext(userId);
  const segment = sfContext?.segment ?? user.segment;

  const res = NextResponse.json({ ok: true });
  const cookieOpts = { path: "/", maxAge: 60 * 60 * 24 * 7, httpOnly: false };
  res.cookies.set(USER_ID_COOKIE, user.id, cookieOpts);
  res.cookies.set(SEGMENT_COOKIE, segment, cookieOpts);
  return res;
}
