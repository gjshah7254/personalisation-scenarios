import Link from "next/link";
import { Suspense } from "react";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { SegmentPersonalisedCards } from "@/app/components/SegmentPersonalisedCards";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { CachedDataBlock } from "./CachedDataBlock";

function CardsFallback() {
  return (
    <div className="mt-3 rounded-lg border border-dashed border-zinc-600 p-4 text-zinc-500">
      Loading personalised cards…
    </div>
  );
}

/**
 * Scenario 12: Cache Components (Next.js 16).
 * Uses cacheComponents: true in next.config and 'use cache' + cacheLife in the component.
 */
export default function Scenario12Page() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 12: Cache Components
        </h1>
        <p className="mt-1 text-zinc-400">
          Next.js 16 Cache Components let you mark components or functions with{" "}
          <code className="rounded bg-zinc-700 px-1">use cache</code> so their return value is
          cached, with <code className="rounded bg-zinc-700 px-1">cacheLife</code> for revalidation.
          Enable <code className="rounded bg-zinc-700 px-1">cacheComponents: true</code> in{" "}
          <code className="rounded bg-zinc-700 px-1">next.config</code> (no experimental flag).
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Cached block (use cache + cacheLife)
        </h2>
        <CachedDataBlock />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Three personalised components (mock data by segment)
        </h2>
        <Suspense fallback={<CardsFallback />}>
          <SegmentPersonalisedCards />
        </Suspense>
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={false}
        contentServedFromCdn={true}
        contentServedFromCdnNote="cached block can be reused; static shell and cache are fast"
        secondRequestFromCache={true}
        secondRequestFromCacheNote="cached component output reused until cacheLife revalidation"
        steps={[
          "Enable cacheComponents: true in next.config (Next.js 16 stable).",
          "CachedDataBlock uses the 'use cache' directive and cacheLife('minutes') so its output is cached.",
          "The component fetches shared data from GET /api/mock/cached-content. First request runs the fetch and caches the result.",
          "Subsequent requests reuse the cached result until the cache profile triggers revalidation.",
          "Cache keys are derived from the function identity and serializable inputs; no request-only data (cookies/headers) inside use cache.",
        ]}
        vercelUsage={[
          "First request: component runs, fetch executes, result cached. Later requests: cached result served (no refetch until revalidate).",
          "Combine with PPR (Scenario 11) or dynamic routes for static shell + cached + dynamic content in one page.",
        ]}
      />
    </div>
  );
}
