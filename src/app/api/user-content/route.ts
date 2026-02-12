import { getCurrentUserEmail } from "@/lib/cookies";
import { getSalesforceUserContext } from "@/lib/salesforce";

export async function GET() {
  const email = await getCurrentUserEmail();
  if (!email) {
    const res = Response.json({ user: null, greeting: null });
    return res;
  }
  const context = await getSalesforceUserContext(email);
  if (!context) {
    const res = Response.json({ user: null, greeting: null });
    return res;
  }
  const data = {
    user: context.user,
    greeting: `Hello ${context.user.name}`,
  };
  const res = Response.json(data);
  res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res;
}
