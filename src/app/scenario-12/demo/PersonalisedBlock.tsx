import { getSegmentFromCookie } from "@/lib/cookies";
import { PERSONALISED_MOCK } from "./mock-data";

type Props = { componentId: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 };

/** Staggered delay so streaming is visible: component 1 = 0.3s, 2 = 0.6s, … 8 = 2.4s */
function delayForComponent(componentId: number) {
  return new Promise((r) => setTimeout(r, componentId * 300));
}

/**
 * One of 8 personalised components. Reads segment from cookie (set at login),
 * then renders mock Contentful content for that segment. Streams in when ready.
 */
export async function PersonalisedBlock({ componentId }: Props) {
  await delayForComponent(componentId);
  const segment = await getSegmentFromCookie();
  const item = PERSONALISED_MOCK.find((m) => m.id === componentId);
  const content = !item
    ? null
    : segment === "B"
      ? item.segmentB
      : item.segmentA; // default to A when no cookie (e.g. not logged in)

  if (!content) {
    return (
      <div className="rounded-lg border border-zinc-600 bg-zinc-800/50 p-4 text-zinc-500">
        <p className="font-medium">Component {componentId}</p>
        <p className="mt-1 text-sm">No mock data.</p>
      </div>
    );
  }

  const colors =
    componentId % 4 === 0
      ? "border-indigo-600/50 bg-indigo-500/10 text-indigo-200"
      : componentId % 4 === 1
        ? "border-amber-600/50 bg-amber-500/10 text-amber-200"
        : componentId % 4 === 2
          ? "border-emerald-600/50 bg-emerald-500/10 text-emerald-200"
          : "border-rose-600/50 bg-rose-500/10 text-rose-200";

  return (
    <div className={`rounded-lg border p-4 ${colors}`}>
      <p className="font-medium">{content.title}</p>
      <p className="mt-1 text-sm opacity-90">{content.body}</p>
      <p className="mt-2 text-xs opacity-70">
        {segment ? `Segment ${segment}` : "Default (no user)"} · Component {componentId} (streamed)
      </p>
    </div>
  );
}
