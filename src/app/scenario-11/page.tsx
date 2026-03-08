import Link from "next/link";
import { Suspense } from "react";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { SegmentPersonalisedCards } from "@/app/components/SegmentPersonalisedCards";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { PprDynamicBlock } from "./PprDynamicBlock";

function Fallback() {
  return (
    <div className="mt-3 rounded-lg border border-dashed border-zinc-600 p-4 text-zinc-500">
      Loading personalised content…
    </div>
  );
}

/**
 * Scenario 11: Partial Prerendering (PPR) pattern.
 * With Next.js canary and experimental.ppr: 'incremental', set experimental_ppr = true
 * to enable PPR; the static shell is then prerendered and the dynamic block streams in.
 * Without PPR, this page uses the same streaming pattern (static shell + Suspense).
 */
export default function Scenario11Page() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 11: Partial Prerendering (PPR)
        </h1>
        <p className="mt-1 text-zinc-400">
          This page demonstrates the PPR pattern: a static shell (heading, static block, fallback)
          plus a dynamic block inside Suspense that runs at request time and streams in. Enable
          <code className="mx-1 rounded bg-zinc-700 px-1">experimental.ppr: &quot;incremental&quot;</code>
          and <code className="rounded bg-zinc-700 px-1">experimental_ppr = true</code> (Next.js canary) for full PPR.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Dynamic block (request-time, streamed)
        </h2>
        <Suspense fallback={<Fallback />}>
          <PprDynamicBlock />
        </Suspense>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Three personalised components (mock data by segment)
        </h2>
        <Suspense fallback={<Fallback />}>
          <SegmentPersonalisedCards />
        </Suspense>
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={false}
        contentServedFromCdn={true}
        contentServedFromCdnNote="static shell can be CDN-cached; dynamic part streamed from server"
        secondRequestFromCache={true}
        secondRequestFromCacheNote="static shell from CDN; dynamic block re-rendered per request"
        steps={[
          "PPR is enabled via experimental.ppr: 'incremental' and experimental_ppr = true on this page.",
          "During prerender, Next.js builds the static shell: layout, static content, and the Suspense fallback.",
          "At request time, the shell is sent first (or from CDN). The dynamic block (cookies, Salesforce) runs on the server.",
          "When the dynamic block resolves, it streams as the next RSC chunk and replaces the fallback.",
          "Result: fast first paint (static shell) plus personalised content without blocking the shell.",
        ]}
        vercelUsage={[
          "Static shell: can be CDN-cached. Dynamic hole: 1 serverless invocation per request for the streamed part.",
          "PPR combines static speed with dynamic personalisation in one route.",
        ]}
      />
    </div>
  );
}
