import { getCurrentUserEmail } from "@/lib/cookies";
import { getSalesforceUserContext } from "@/lib/salesforce";
import { SegmentDataBlock } from "./SegmentDataBlock";

const COMPONENT_ID = "scenario-4-block" as const;

/** Async content that reads cookies and fetches user context. Wrapped in Suspense for cacheComponents. */
export async function Scenario4DynamicContent() {
  const email = await getCurrentUserEmail();
  const sfContext = email ? await getSalesforceUserContext(email) : null;
  const segment = sfContext?.segment;
  const shouldPersonalise = sfContext?.personalisedComponentIds.includes(COMPONENT_ID) ?? false;

  return (
    <SegmentDataBlock segment={segment} shouldPersonalise={shouldPersonalise} />
  );
}
