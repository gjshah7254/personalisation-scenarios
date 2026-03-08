import { getCurrentUserEmail } from "@/lib/cookies";
import { getSalesforceUserContext } from "@/lib/salesforce";
import type { Segment } from "@/lib/types";
import segmentContentMock from "@/data/segment-content-mock.json";

type CardContent = { title: string; body: string };
type ComponentSpec = { id: string; segmentA: CardContent; segmentB: CardContent };

const components = segmentContentMock.components as ComponentSpec[];

/**
 * Async component: reads segment from cookies + Salesforce, renders 3 cards from mock data.
 * Use inside Suspense on Scenario 11 and 12.
 */
export async function SegmentPersonalisedCards() {
  const email = await getCurrentUserEmail();
  const sfContext = email ? await getSalesforceUserContext(email) : null;
  const segment: Segment = sfContext?.segment === "B" ? "B" : "A";

  if (!sfContext) {
    return (
      <p className="text-zinc-400">
        No user selected. Use <strong>Login</strong> in the header to pick a user and see segment-specific content.
      </p>
    );
  }

  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {components.map((spec) => {
        const content = segment === "B" ? spec.segmentB : spec.segmentA;
        return (
          <div
            key={spec.id}
            className="rounded-lg border border-zinc-700 bg-zinc-800/80 p-4"
          >
            <p className="font-medium text-white">{content.title}</p>
            <p className="mt-1 text-sm text-zinc-300">{content.body}</p>
            <p className="mt-2 text-xs text-zinc-500">Segment {segment}</p>
          </div>
        );
      })}
    </div>
  );
}
