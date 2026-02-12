import { getUserIdFromCookie } from "@/lib/cookies";
import { getUserById } from "@/lib/users";

export async function GET() {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return Response.json({ user: null });
  }
  const user = await getUserById(userId);
  return Response.json({ user: user ?? null });
}
