import { unstable_cache } from "next/cache";
import { getUserById } from "@/lib/users";
import type {
  SalesforceUserContext,
  PersonalisedComponentId,
} from "@/lib/types";
import type { Segment } from "@/lib/types";
import salesforceMock from "@/data/salesforce-mock.json";

const segmentComponents = salesforceMock.segmentPersonalisedComponents as Record<
  Segment,
  string[]
>;

/**
 * Mock Salesforce API: returns user context (segment, which components to personalise).
 * Segment → personalised component IDs are read from src/data/salesforce-mock.json.
 * In production this would call Salesforce APIs (REST or server-side SDK) with client/secret or API key.
 */
export async function getSalesforceUserContext(
  userId: string
): Promise<SalesforceUserContext | null> {
  const user = getUserById(userId);
  if (!user) return null;

  const segment = user.segment;
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
