import Link from "next/link";
import { Suspense } from "react";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { Scenario8DynamicContent } from "./Scenario8DynamicContent";

function Placeholder() {
  return (
    <div className="mt-3 rounded-lg border border-dashed border-zinc-600 p-4 text-zinc-500">
      Loading…
    </div>
  );
}

export default function Scenario8Page() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 8: Server-side 1:1 with data cache (unstable_cache by email)
        </h1>
        <p className="mt-1 text-zinc-400">
          Page is dynamic (RSC). Server reads user email from cookie and fetches user context from
          Salesforce (mock) via unstable_cache. First request runs the fetch and caches the result;
          second request reuses the cache (no refetch).
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Personalised content (1:1, RSC + data cache, segment from Salesforce)
        </h2>
        <Suspense fallback={<Placeholder />}>
          <Scenario8DynamicContent />
        </Suspense>
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={false}
        contentServedFromCdn={false}
        contentServedFromCdnNote="server-rendered per request"
        secondRequestFromCache={false}
        secondRequestFromCacheNote="Next.js data cache (fewer backend calls); full response still from origin, not CDN-cached"
        steps={[
          "Request hits the server. Page is an async RSC.",
          "Server reads user email from cookies (getCurrentUserEmail).",
          "Server calls getSalesforceUserContextCached(email), which uses unstable_cache(..., [email], { revalidate: 60 }).",
          "First request for user X: cache miss — Salesforce user context is fetched (mock); result stored in Data Cache.",
          "Second request for user X: cache hit — cached context returned; no refetch. Page still server-rendered (1 serverless inv), but the data step is cached.",
          "1 serverless invocation per view; Salesforce context cached per user so backend/API usage stays under control.",
        ]}
        vercelUsage={[
          "Every page view = 1 Serverless Function invocation (RSC).",
          "Salesforce user context is cached per email via unstable_cache; repeat visits by same user do not refetch.",
          "No Edge Middleware invocations.",
          "Backend/API usage and cold-start impact reduced by data cache.",
        ]}
      />
    </div>
  );
}
