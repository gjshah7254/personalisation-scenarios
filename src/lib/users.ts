import type { User, Segment } from "@/lib/types";
import usersData from "@/data/users.json";
import salesforceMock from "@/data/salesforce-mock.json";
import { getMockApiBaseUrl } from "@/lib/mock-api-base-url";

const usersFallback: User[] = usersData.users as User[];
const userSegmentsFallback = (salesforceMock as { userSegments?: Record<string, Segment> }).userSegments ?? {};

/**
 * Fetches all users from the mock users API (or falls back to JSON when API is unavailable, e.g. at build time).
 */
export async function getUsers(): Promise<User[]> {
  try {
    const base = getMockApiBaseUrl();
    const res = await fetch(`${base}/api/mock/users`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Users API not ok");
    const data = (await res.json()) as { users: User[] };
    return data.users;
  } catch {
    return usersFallback;
  }
}

/**
 * Fetches a single user by email from the mock users API (or falls back to JSON when API is unavailable).
 * On Vercel, internal fetch to own API can fail or return 404; we always fall back to in-process JSON so set-user works.
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const fromFallback = () => usersFallback.find((u) => u.email === email);
  try {
    const base = getMockApiBaseUrl();
    const res = await fetch(`${base}/api/mock/users/by-email?email=${encodeURIComponent(email)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fromFallback();
    const data = (await res.json()) as { user: User };
    return data.user ?? fromFallback();
  } catch {
    return fromFallback();
  }
}

/** Segment comes from Salesforce mock (userSegments keyed by email). */
export async function getUsersBySegment(segment: Segment): Promise<User[]> {
  const users = await getUsers();
  return users.filter((u) => userSegmentsFallback[u.email] === segment);
}

export async function getSegmentUsers(): Promise<{
  segmentA: User[];
  segmentB: User[];
}> {
  const users = await getUsers();
  return {
    segmentA: users.filter((u) => userSegmentsFallback[u.email] === "A"),
    segmentB: users.filter((u) => userSegmentsFallback[u.email] === "B"),
  };
}

/** Email → segment (from Salesforce mock). For layout/switcher display. */
export function getEmailToSegmentMap(): Record<string, Segment> {
  return { ...userSegmentsFallback };
}
