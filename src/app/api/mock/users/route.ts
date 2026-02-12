import usersData from "@/data/users.json";
import type { User } from "@/lib/types";

const users = usersData.users as User[];

/**
 * Mock users API: returns all users (from users.json).
 * Mirrors what a real users/CRM API would return.
 */
export async function GET() {
  return Response.json({ users });
}
