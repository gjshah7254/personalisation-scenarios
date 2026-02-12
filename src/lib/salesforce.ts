import { unstable_cache } from "next/cache";
import { getUserById } from "@/lib/users";
import type {
  SalesforceUserContext,
  PersonalisedComponentId,
} from "@/lib/types";
import type { Segment } from "@/lib/types";
import { getMockApiBaseUrl } from "@/lib/mock-api-base-url";
import salesforceMockFallback from "@/data/salesforce-mock.json";

const segmentComponentsFallback = salesforceMockFallback.segmentPersonalisedComponents as Record<
  Segment,
  string[]
>;

/**
 * Fetches segment → personalised component IDs from the mock Salesforce segment-config API
 * (or falls back to salesforce-mock.json when API is unavailable, e.g. at build time).
 */
async function getSegmentPersonalisedComponents(): Promise<Record<Segment, string[]>> {
  try {
    const base = getMockApiBaseUrl();
    const res = await fetch(`${base}/api/mock/salesforce/segment-config`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Segment config API not ok");
    const data = (await res.json()) as { segmentPersonalisedComponents: Record<Segment, string[]> };
    return data.segmentPersonalisedComponents;
  } catch {
    return segmentComponentsFallback;
  }
}

/**
 * Mock Salesforce API: returns user context (segment, which components to personalise).
 * Fetches user from mock users API and segment config from mock Salesforce segment-config API;
 * falls back to JSON when APIs are unavailable.
 */
export async function getSalesforceUserContext(
  userId: string
): Promise<SalesforceUserContext | null> {
  const user = await getUserById(userId);
  if (!user) return null;

  const segment = user.segment;
  const segmentComponents = await getSegmentPersonalisedComponents();
  const personalisedComponentIds = (segmentComponents[segment] ?? []) as PersonalisedComponentId[];

  return {
    userId: user.id,
    segment,
    personalisedComponentIds,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      segment: user.segment,
    },
  };
}

/** Cached version for scenario 8 (unstable_cache by userId). */
export async function getSalesforceUserContextCached(
  userId: string
): Promise<SalesforceUserContext | null> {
  return unstable_cache(
    async () => getSalesforceUserContext(userId),
    ["salesforce-user-context", userId],
    { revalidate: 60 }
  )();
}
