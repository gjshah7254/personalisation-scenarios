import { getCurrentUserEmail } from "@/lib/cookies";
import { getSalesforceUserContext } from "@/lib/salesforce";
import { PersonalisedBlock } from "./PersonalisedBlock";

const COMPONENT_ID = "scenario-1-block" as const;

/** Async content that reads cookies and fetches user context. Wrapped in Suspense for cacheComponents. */
export async function Scenario1DynamicContent() {
  const email = await getCurrentUserEmail();
  const sfContext = email ? await getSalesforceUserContext(email) : null;
  const shouldPersonalise = sfContext?.personalisedComponentIds.includes(COMPONENT_ID) ?? false;

  return (
    <PersonalisedBlock
      user={sfContext?.user}
      segment={sfContext?.segment}
      shouldPersonalise={shouldPersonalise}
    />
  );
}
