import { getUserIdFromCookie } from "@/lib/cookies";
import { getSalesforceUserContext } from "@/lib/salesforce";

/**
 * Mock Salesforce user-context API.
 * Reads userId from cookie, returns segment and which components to personalise (as Salesforce would).
 * Replace with real Salesforce API call when client/secret or API key is available.
 * Cache-Control allows CDN caching per user when cache key includes cookie (e.g. Vercel).
 */
export async function GET() {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return Response.json({ context: null });
  }
  const context = await getSalesforceUserContext(userId);
  const res = Response.json({ context });
  res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res;
}
