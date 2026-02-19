import { getCurrentUserEmail } from "@/lib/cookies";
import { getSalesforceUserContext } from "@/lib/salesforce";

/**
 * Mock Salesforce user-context API.
 * Reads user email from cookie, returns segment and which components to personalise (as Salesforce would).
 * Replace with real Salesforce API call when client/secret or API key is available.
 * Response is private and not cached by CDN so each request gets the correct user from the cookie.
 */
export async function GET() {
  const email = await getCurrentUserEmail();
  if (!email) {
    const res = Response.json({ context: null });
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }
  const context = await getSalesforceUserContext(email);
  const res = Response.json({ context });
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
