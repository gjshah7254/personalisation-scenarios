import type { User, Segment } from "@/lib/types";
import usersData from "@/data/users.json";
import { getMockApiBaseUrl } from "@/lib/mock-api-base-url";

const usersFallback: User[] = usersData.users as User[];

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
 * Fetches a single user from the mock users API (or falls back to JSON when API is unavailable).
 */
export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const base = getMockApiBaseUrl();
    const res = await fetch(`${base}/api/mock/users/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { user: User };
    return data.user;
  } catch {
    return usersFallback.find((u) => u.id === id);
  }
}

export async function getUsersBySegment(segment: Segment): Promise<User[]> {
  const users = await getUsers();
  return users.filter((u) => u.segment === segment);
}

export async function getSegmentUsers(): Promise<{
  segmentA: User[];
  segmentB: User[];
}> {
  const users = await getUsers();
  return {
    segmentA: users.filter((u) => u.segment === "A"),
    segmentB: users.filter((u) => u.segment === "B"),
  };
}
