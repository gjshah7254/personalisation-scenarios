import { getSalesforceUserContextByPlayerId } from "@/lib/salesforce";

/**
 * Mock Salesforce API: returns user context by playerId (for mobile BFF /api/personalised-content).
 * Used by GET /api/personalised-content; mobile does not call this directly.
 */
export async function GET(request: Request) {
  const playerId = new URL(request.url).searchParams.get("playerId");
  if (!playerId) {
    return Response.json(
      { error: "playerId required (query param: ?playerId=...)" },
      { status: 400 }
    );
  }

  const context = await getSalesforceUserContextByPlayerId(playerId);
  if (!context) {
    return Response.json({ error: "User context not found for this playerId" }, { status: 404 });
  }

  return Response.json({ context });
}
