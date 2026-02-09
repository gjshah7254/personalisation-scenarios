import Link from "next/link";
import { getSegmentFromCookie } from "@/lib/cookies";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { SegmentDataBlock } from "./SegmentDataBlock";

export default async function Scenario4Page() {
  const segment = await getSegmentFromCookie();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 4: Middleware + Server Component hybrid
        </h1>
        <p className="mt-1 text-zinc-400">
          Middleware could set the segment; this page is a static shell. The block below is a Server
          Component that reads the segment (cookie) and fetches segment-based data. Cache can be
          configured per segment.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Segment-based data (RSC, segment from cookie)
        </h2>
        <SegmentDataBlock segment={segment} />
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={true}
        contentServedFromCdn={false}
        contentServedFromCdnNote="RSC fetches per request unless you add per-segment caching"
        secondRequestFromCache={false}
        secondRequestFromCacheNote="each request is server-rendered unless you add per-segment cache"
        steps={[
          "Middleware can run first to set or read segment (e.g. from cookie or header); in this demo we read segment in the page.",
          "Page shell is static; the route is not rewritten. Middleware may set cookies used later.",
          "Page loads as a Server Component. It reads the segment from cookies (e.g. personalisation-segment).",
          "A Server Component (SegmentDataBlock) fetches or computes segment-specific data (e.g. different features per segment).",
          "Cache can be configured per segment (e.g. fetch with cache key or segment in revalidatePath) so each segment has its own cached response.",
          "Result: static shell plus server-rendered, segment-specific sections; good balance of cache and personalisation.",
          "Second request (same user/segment): No by default — the RSC runs again and fetches segment data per request. If you add per-segment caching (e.g. fetch cache or unstable_cache with segment key), the second request for the same segment can be served from cache.",
        ]}
      />
    </div>
  );
}
