import { getSegmentFromCookie } from "@/lib/cookies";
import type { Segment } from "@/lib/types";
import { getRequestMockApiBaseUrl } from "@/lib/mock-api-base-url";

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

  let entries: ContentfulEntry[] = [];
  try {
    const base = await getRequestMockApiBaseUrl();
    const res = await fetch(
      `${base}/api/mock/contentful/entries?segment=${encodeURIComponent(segment)}`,
    );
    if (!res.ok) throw new Error(`entries API ${res.status}`);
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) throw new Error("entries API not JSON");
    const data = (await res.json()) as { segment: Segment; entries: ContentfulEntry[] };
    entries = data.entries ?? [];
  } catch {
    return (
      <p className="text-sm text-red-400">
        Could not load personalised cards (mock Contentful entries). If you run the dev server on a
        non-default port, avoid relying on <code className="rounded bg-zinc-700 px-1">NEXT_PUBLIC_APP_URL</code>{" "}
        alone for server fetches — this component uses the request host instead.
      </p>
    );
  }

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
