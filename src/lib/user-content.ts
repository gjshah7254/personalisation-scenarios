import { unstable_cache } from "next/cache";
import { getUserById } from "@/lib/users";

export interface UserContentResult {
  user: { id: string; name: string; email: string; segment: string };
  recommendations: string[];
}

async function fetchUserContent(userId: string): Promise<UserContentResult | null> {
  const user = getUserById(userId);
  if (!user) return null;
  const recommendations =
    user.segment === "A"
      ? ["24/7 support", "Dedicated account manager", "Custom SLA"]
      : ["Self-serve docs", "Community forum", "Quick start guide"];
  return {
    user: { id: user.id, name: user.name, email: user.email, segment: user.segment },
    recommendations,
  };
}

export async function getUserContentCached(userId: string): Promise<UserContentResult | null> {
  return unstable_cache(
    async () => fetchUserContent(userId),
    ["user-content", userId],
    { revalidate: 60 }
  )();
}
