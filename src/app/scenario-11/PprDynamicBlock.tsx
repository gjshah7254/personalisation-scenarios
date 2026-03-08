import { getCurrentUserEmail } from "@/lib/cookies";
import { getSalesforceUserContext } from "@/lib/salesforce";

const COMPONENT_ID = "scenario-5-block" as const;

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Dynamic block for PPR: uses cookies and fetch, so it runs at request time and streams in.
 */
export async function PprDynamicBlock() {
  await delay(600);
  const email = await getCurrentUserEmail();
  const sfContext = email ? await getSalesforceUserContext(email) : null;
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

  if (sfContext.segment === "A") {
    return (
      <div className="mt-3 rounded-lg bg-indigo-500/10 p-4 text-indigo-200">
        <p className="font-medium">PPR dynamic: Segment A</p>
        <p className="mt-1 text-sm">Hello {sfContext.user.name}. This block was rendered at request time and streamed in.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-amber-500/10 p-4 text-amber-200">
      <p className="font-medium">PPR dynamic: Segment B</p>
      <p className="mt-1 text-sm">Hey {sfContext.user.name}. This block was rendered at request time and streamed in.</p>
    </div>
  );
}
