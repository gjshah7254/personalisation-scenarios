import { unstable_cache } from "next/cache";
import { getUserByEmail } from "@/lib/users";
import type {
  SalesforceUserContext,
  PersonalisedComponentId,
  PersonalisationRule,
} from "@/lib/types";
import type { Segment } from "@/lib/types";
import { getMockApiBaseUrl } from "@/lib/mock-api-base-url";
import salesforceMockFallback from "@/data/salesforce-mock.json";
import segmentPersonalisedComponentsFallback from "@/data/segment-personalised-components.json";

type SalesforceMock = {
  userSegments?: Record<string, Segment>;
  personalisationRulesBySegment?: Record<Segment, PersonalisationRule[]>;
};

const fallbackMock = salesforceMockFallback as SalesforceMock;
const fallbackPersonalised = segmentPersonalisedComponentsFallback as Record<Segment, string[]>;

type PerUserSegmentConfig = {
  segment: Segment;
  personalisedComponentIds: string[];
  personalisationRules: PersonalisationRule[];
};

/**
 * Fetches segment config for a single user (by email) from the mock Salesforce API (per-user).
 * API returns only segment + personalisationRules; personalisedComponentIds are merged from segment-personalised-components (for other scenarios).
 */
async function getSegmentConfigForUser(email: string): Promise<PerUserSegmentConfig | null> {
  try {
    const base = getMockApiBaseUrl();
    const res = await fetch(`${base}/api/mock/salesforce/segment-config?email=${encodeURIComponent(email)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { segment: Segment; personalisationRules: PersonalisationRule[] };
    const { segment, personalisationRules } = data;
    return {
      segment,
      personalisedComponentIds: fallbackPersonalised[segment] ?? [],
      personalisationRules,
    };
  } catch {
    const segment = fallbackMock.userSegments?.[email];
    if (segment === undefined) return null;
    return {
      segment,
      personalisedComponentIds: fallbackPersonalised[segment] ?? [],
      personalisationRules: fallbackMock.personalisationRulesBySegment?.[segment] ?? [],
    };
  }
}

/**
 * Mock Salesforce API: returns user context (segment, which components to personalise).
 * Email is the unique identifier.
 */
export async function getSalesforceUserContext(
  email: string
): Promise<SalesforceUserContext | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const config = await getSegmentConfigForUser(email);
  if (!config) return null;

  const { segment, personalisedComponentIds, personalisationRules } = config;

  return {
    userEmail: user.email,
    segment,
    personalisedComponentIds: personalisedComponentIds as PersonalisedComponentId[],
    personalisationRules,
    user: {
      email: user.email,
      name: user.name,
      segment,
    },
  };
}

/** Cached version for scenario 8 (unstable_cache by email). */
export async function getSalesforceUserContextCached(
  email: string
): Promise<SalesforceUserContext | null> {
  return unstable_cache(
    async () => getSalesforceUserContext(email),
    ["salesforce-user-context", email],
    { revalidate: 60 }
  )();
}
