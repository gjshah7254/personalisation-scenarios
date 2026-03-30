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
import playerIdMappingFallback from "@/data/player-id-mock.json";

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
  const fromFallback = (): PerUserSegmentConfig | null => {
    const segment = fallbackMock.userSegments?.[email];
    if (segment === undefined) return null;
    return {
      segment,
      personalisedComponentIds: fallbackPersonalised[segment] ?? [],
      personalisationRules: fallbackMock.personalisationRulesBySegment?.[segment] ?? [],
    };
  };
  try {
    const base = getMockApiBaseUrl();
    const res = await fetch(`${base}/api/mock/salesforce/segment-config?email=${encodeURIComponent(email)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fromFallback();
    const data = (await res.json()) as { segment: Segment; personalisationRules: PersonalisationRule[] };
    const { segment, personalisationRules } = data;
    return {
      segment,
      personalisedComponentIds: fallbackPersonalised[segment] ?? [],
      personalisationRules,
    };
  } catch {
    return fromFallback();
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

const playerIdToEmail = playerIdMappingFallback as Record<string, string>;

/** Resolve email from playerId (mock mapping for mobile BFF /api/personalised-content). */
export function getEmailByPlayerId(playerId: string): string | null {
  return playerIdToEmail[playerId] ?? null;
}

/** User context by playerId (for mobile API). Uses playerId→email mapping then SF context. */
export async function getSalesforceUserContextByPlayerId(
  playerId: string
): Promise<SalesforceUserContext | null> {
  const email = getEmailByPlayerId(playerId);
  if (!email) return null;
  return getSalesforceUserContext(email);
}

/**
 * Cached user context by playerId. Module-level unstable_cache so repeat requests hit the Data Cache
 * (wrapping unstable_cache inside an async helper on each call prevents HITs).
 */
const getSalesforceUserContextByPlayerIdCachedFn = unstable_cache(
  async (playerId: string) => getSalesforceUserContextByPlayerId(playerId),
  ["salesforce-user-context-by-player"],
  { revalidate: 60, tags: ["personalised-content"] }
);

export async function getSalesforceUserContextByPlayerIdCached(
  playerId: string
): Promise<SalesforceUserContext | null> {
  return getSalesforceUserContextByPlayerIdCachedFn(playerId);
}
