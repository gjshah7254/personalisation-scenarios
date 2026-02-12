import { getUserIdFromCookie } from "@/lib/cookies";
import { getSalesforceUserContext } from "@/lib/salesforce";

const COMPONENT_ID = "scenario-5-block" as const;

// Simulate a delay (e.g. DB or Salesforce API call) so streaming is visible
async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function StreamedPersonalisedBlock() {
  await delay(800);
  const userId = await getUserIdFromCookie();
  const sfContext = userId ? await getSalesforceUserContext(userId) : null;
  const shouldPersonalise = sfContext?.personalisedComponentIds.includes(COMPONENT_ID) ?? false;

  if (!sfContext) {
    return (
      <p className="mt-3 text-zinc-400">
        No user selected. Use &quot;View as&quot; in the header to pick a user.
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

  if (sfContext.segment === "A") {
    return (
      <div className="mt-3 rounded-lg bg-indigo-500/10 p-4 text-indigo-200">
        <p className="font-medium">Streamed: Segment A (from Salesforce)</p>
        <p className="mt-1 text-sm">Hello {sfContext.user.name}. This block was streamed after the shell.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-amber-500/10 p-4 text-amber-200">
      <p className="font-medium">Streamed: Segment B (from Salesforce)</p>
      <p className="mt-1 text-sm">Hey {sfContext.user.name}. This block was streamed after the shell.</p>
    </div>
  );
}
