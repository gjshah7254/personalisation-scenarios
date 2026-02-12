import { getCurrentUserEmail } from "@/lib/cookies";
import { getSalesforceUserContext } from "@/lib/salesforce";

export async function GET() {
  const email = await getCurrentUserEmail();
  if (!email) {
    return Response.json({ user: null });
  }
  const context = await getSalesforceUserContext(email);
  return Response.json({ user: context?.user ?? null });
}
