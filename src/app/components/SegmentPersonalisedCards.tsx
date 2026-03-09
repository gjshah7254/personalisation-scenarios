import { getSegmentFromCookie } from "@/lib/cookies";
import type { Segment } from "@/lib/types";
import { getMockApiBaseUrl } from "@/lib/mock-api-base-url";

type ContentfulEntry = { id: string; title: string; body: string };

/**
 * Async component: reads ctxKey/segment from cookie (set at login, no Salesforce call on page),
 * then fetches personalised content from Contentful (mock) entries API.
 * Use inside Suspense on Scenario 11 and 12. Matches "cookie read in App" flow (no middleware).
 */
export async function SegmentPersonalisedCards() {
  const segment = await getSegmentFromCookie();

  if (segment === undefined) {
    return (
      <p className="text-zinc-400">
        No user selected. Use <strong>Login</strong> in the header to pick a user (Salesforce runs once at login, segment stored in cookie).
      </p>
    );
  }

  const base = getMockApiBaseUrl();
  const res = await fetch(`${base}/api/mock/contentful/entries?segment=${segment}`);
  const data = (await res.json()) as { segment: Segment; entries: ContentfulEntry[] };
  const entries = data.entries ?? [];

  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="rounded-lg border border-zinc-700 bg-zinc-800/80 p-4"
        >
          <p className="font-medium text-white">{entry.title}</p>
          <p className="mt-1 text-sm text-zinc-300">{entry.body}</p>
          <p className="mt-2 text-xs text-zinc-500">Segment {segment} (Contentful)</p>
        </div>
      ))}
    </div>
  );
}
