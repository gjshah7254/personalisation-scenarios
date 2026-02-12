import { unstable_cache } from "next/cache";
import { getSalesforceUserContext } from "@/lib/salesforce";

export interface UserContentResult {
  user: { email: string; name: string; segment: string };
}

async function fetchUserContent(email: string): Promise<UserContentResult | null> {
  const context = await getSalesforceUserContext(email);
  if (!context) return null;
  return { user: context.user };
}

export async function getUserContentCached(email: string): Promise<UserContentResult | null> {
  return unstable_cache(
    async () => fetchUserContent(email),
    ["user-content", email],
    { revalidate: 60 }
  )();
}
