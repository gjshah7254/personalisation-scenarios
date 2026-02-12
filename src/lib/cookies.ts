import { cookies } from "next/headers";
import type { PersonalisationSession } from "@/lib/types";
import {
  USER_EMAIL_COOKIE,
  SEGMENT_COOKIE,
  SESSION_COOKIE,
} from "@/lib/cookie-names";

export { USER_EMAIL_COOKIE, SEGMENT_COOKIE, SESSION_COOKIE };

/** Returns the current user's email (unique identifier) from cookie. */
export async function getCurrentUserEmail(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(USER_EMAIL_COOKIE)?.value;
}

export async function getSegmentFromCookie(): Promise<"A" | "B" | undefined> {
  const store = await cookies();
  const value = store.get(SEGMENT_COOKIE)?.value;
  if (value === "A" || value === "B") return value;
  return undefined;
}

export async function getSessionFromCookie(): Promise<PersonalisationSession | null> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  try {
    return JSON.parse(value) as PersonalisationSession;
  } catch {
    return null;
  }
}
