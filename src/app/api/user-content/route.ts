import { getUserIdFromCookie } from "@/lib/cookies";
import { getUserById } from "@/lib/users";

export async function GET() {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    const res = Response.json({ user: null, greeting: null, recommendations: [] });
    return res;
  }
  const user = getUserById(userId);
  if (!user) {
    const res = Response.json({ user: null, greeting: null, recommendations: [] });
    return res;
  }
  const recommendations =
    user.segment === "A"
      ? ["24/7 support", "Dedicated account manager", "Custom SLA"]
      : ["Self-serve docs", "Community forum", "Quick start guide"];
  const data = {
    user: { id: user.id, name: user.name, email: user.email, segment: user.segment },
    greeting: `Hello ${user.name}`,
    recommendations,
  };
  const res = Response.json(data);
  res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res;
}
