import Link from "next/link";
import { Suspense } from "react";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { StreamedPersonalisedBlock } from "./StreamedPersonalisedBlock";

function Placeholder() {
  return (
    <div className="mt-3 rounded-lg border border-dashed border-zinc-600 p-4 text-zinc-500">
      Loading personalised content…
    </div>
  );
}

export default function Scenario5Page() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 5: Streaming + partial personalization
        </h1>
        <p className="mt-1 text-zinc-400">
          The static shell of this page streams first. The personalised section below streams in
          when the server has finished resolving it (RSC streaming). You may see the placeholder
          briefly.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Streamed personalised block
        </h2>
        <Suspense fallback={<Placeholder />}>
          <StreamedPersonalisedBlock />
        </Suspense>
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={false}
        contentServedFromCdn={false}
        contentServedFromCdnNote="streamed from server, not CDN-cached"
        secondRequestFromCache={false}
        secondRequestFromCacheNote="response streamed from server each time; not CDN-cached"
        steps={[
          "Request hits the server. No middleware is used for personalisation on this route.",
          "The page shell (including static content and the Suspense fallback) streams to the client first so the user sees content immediately.",
          "Meanwhile, the server resolves the async personalised block (StreamedPersonalisedBlock): reads cookies, looks up user, chooses variant.",
          "When the personalised block is ready, it is streamed as the next RSC chunk and replaces the Suspense fallback.",
          "User sees static shell first, then personalised content when ready—reducing perceived latency while still personalising server-side.",
          "RSC streaming allows partial personalisation without blocking the whole page on server work.",
          "Second request (same user/segment): No — the page and streamed block are rendered on the server again. The response is not CDN-cached. (Next.js data cache could reduce backend calls but would not make the response CDN-cached.)",
        ]}
        vercelUsage={[
          "Every page view = 1 Serverless Function invocation (streaming SSR; function may stay open until stream completes).",
          "No Edge Middleware invocations for this route.",
          "Bandwidth: streamed response from origin each time.",
          "Usage similar to Scenario 1; streaming can mean slightly longer function duration per request.",
        ]}
      />
    </div>
  );
}
