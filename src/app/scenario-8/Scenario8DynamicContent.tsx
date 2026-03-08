import { getCurrentUserEmail } from "@/lib/cookies";
import { getSalesforceUserContextCached } from "@/lib/salesforce";

const COMPONENT_ID = "scenario-8-block" as const;

/** Async content that reads cookies and fetches cached user context. Wrapped in Suspense for cacheComponents. */
export async function Scenario8DynamicContent() {
  const email = await getCurrentUserEmail();
  const sfContext = email ? await getSalesforceUserContextCached(email) : null;
  const shouldPersonalise = sfContext?.personalisedComponentIds.includes(COMPONENT_ID) ?? false;

  if (!sfContext) {
    return (
      <p className="mt-3 text-zinc-400">
        No user selected. Use &quot;Login&quot; in the header to pick a user.
      </p>
    );
  }
  if (!shouldPersonalise) {
    return (
      <p className="mt-3 text-zinc-500">
        This component is not personalised for your segment (Salesforce context).
      </p>
    );
  }
  return (
    <div className="mt-3 rounded-lg bg-amber-500/10 p-4 text-amber-200">
      <p className="font-medium">1:1 personalisation (data cache, Salesforce context)</p>
      <p className="mt-1 text-sm">Hello {sfContext.user.name}, here&apos;s your content.</p>
    </div>
  );
}
