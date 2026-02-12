import Link from "next/link";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { ClientOneToOneBlock } from "./ClientOneToOneBlock";

export default function Scenario7Page() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 7: Client-side 1:1 with cached API
        </h1>
        <p className="mt-1 text-zinc-400">
          Page is SSG. The client fetches user context from the Salesforce mock API (Cache-Control
          can be set for CDN caching). First request = 1 API invocation; repeat visits = CDN cache hit.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Personalised content (1:1, cached API)
        </h2>
        <ClientOneToOneBlock />
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={false}
        contentServedFromCdn={true}
        contentServedFromCdnNote="API response from CDN on cache hit (second request same user)"
        secondRequestFromCache={true}
        secondRequestFromCacheNote="page and API response from CDN cache when same user within TTL"
        steps={[
          "Page is pre-rendered at build time (SSG). No middleware runs.",
          "Static HTML is served from CDN. Client hydrates and calls GET /api/salesforce/user-context (userId from cookie).",
          "API returns user context from Salesforce (mock): segment, personalised component IDs, user profile. Response sets Cache-Control for CDN caching.",
          "If this component is in personalisedComponentIds, the client shows 1:1 content (greeting) from the Salesforce user context.",
          "CDN caches the API response per user when cache key includes user. First request for user X = 1 API invocation; repeat visits within TTL = CDN cache hit.",
          "Second request (same user): page from CDN; user-context API response from CDN cache if within TTL — no function invocation.",
        ]}
        vercelUsage={[
          "Page HTML/JS/assets: served from CDN (no serverless function for the page).",
          "API (GET /api/salesforce/user-context): 1 invocation per user per cache window; repeat visits by same user = CDN cache hit.",
          "No Edge Middleware invocations.",
          "Usage grows with unique users and cache hit rate, not total page views.",
        ]}
      />
    </div>
  );
}
