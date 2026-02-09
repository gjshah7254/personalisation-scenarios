import { cookies } from "next/headers";

export const USER_ID_COOKIE = "personalisation-user-id";
export const SEGMENT_COOKIE = "personalisation-segment";

export async function getUserIdFromCookie(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(USER_ID_COOKIE)?.value;
}

export async function getSegmentFromCookie(): Promise<"A" | "B" | undefined> {
  const store = await cookies();
  const value = store.get(SEGMENT_COOKIE)?.value;
  if (value === "A" || value === "B") return value;
  return undefined;
}
