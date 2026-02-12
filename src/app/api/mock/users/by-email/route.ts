import usersData from "@/data/users.json";
import type { User } from "@/lib/types";

const users = usersData.users as User[];

/**
 * Mock user-by-email API: returns a single user (from users.json).
 * Email is the unique identifier.
 */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email) {
    return Response.json({ error: "email required (query param: ?email=...)" }, { status: 400 });
  }
  const user = users.find((u) => u.email === email);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return Response.json({ user });
}
