import usersData from "@/data/users.json";
import type { User } from "@/lib/types";

const users = usersData.users as User[];

interface RouteContext {
  params: Promise<{ userId: string }>;
}

/**
 * Mock user-by-id API: returns a single user (from users.json).
 * Mirrors what a real user lookup API would return.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { userId } = await context.params;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return Response.json({ user });
}
