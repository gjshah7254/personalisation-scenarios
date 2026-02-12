import segmentConfig from "@/data/salesforce-mock.json";
import type { Segment } from "@/lib/types";
import type { PersonalisationRule } from "@/lib/types";

type SalesforceMock = {
  userSegments?: Record<string, Segment>;
  personalisationRulesBySegment?: Record<Segment, PersonalisationRule[]>;
};

const config = segmentConfig as SalesforceMock;

/**
 * Mock Salesforce segment-config API: personalised per user.
 * Requires ?email=... Returns only that user's segment and personalisation rules (no scenario block list).
 */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email) {
    return Response.json(
      { error: "email required (query param: ?email=...)" },
      { status: 400 }
    );
  }

  const segment = config.userSegments?.[email];
  if (segment === undefined) {
    return Response.json({ error: "User segment not found" }, { status: 404 });
  }

  const personalisationRules = config.personalisationRulesBySegment?.[segment] ?? [];

  return Response.json({
    segment,
    personalisationRules,
  });
}
