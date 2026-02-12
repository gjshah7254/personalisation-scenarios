import { unstable_cache } from "next/cache";
import { getUserById } from "@/lib/users";

export interface UserContentResult {
  user: { id: string; name: string; email: string; segment: string };
}

async function fetchUserContent(userId: string): Promise<UserContentResult | null> {
  const user = await getUserById(userId);
  if (!user) return null;
  return {
    user: { id: user.id, name: user.name, email: user.email, segment: user.segment },
  };
}

export async function getUserContentCached(userId: string): Promise<UserContentResult | null> {
  return unstable_cache(
    async () => fetchUserContent(userId),
    ["user-content", userId],
    { revalidate: 60 }
  )();
}
