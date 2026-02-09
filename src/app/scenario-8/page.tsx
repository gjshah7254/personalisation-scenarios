import Link from "next/link";
import { getUserIdFromCookie } from "@/lib/cookies";
import { getUserContentCached } from "@/lib/user-content";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";

export default async function Scenario8Page() {
  const userId = await getUserIdFromCookie();
  const content = userId ? await getUserContentCached(userId) : null;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 8: Server-side 1:1 with data cache (unstable_cache by userId)
        </h1>
        <p className="mt-1 text-zinc-400">
          Page is dynamic (RSC). Server reads userId from cookie and fetches user-specific content
          via a helper wrapped in unstable_cache keyed by userId. First request for a user runs the
          fetch and caches the result; second request reuses the cache (no refetch).
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Personalised content (1:1, RSC + data cache)
        </h2>
        {!content ? (
          <p className="mt-3 text-zinc-400">
            No user selected. Use &quot;View as&quot; in the header to pick a user.
          </p>
        ) : (
          <div className="mt-3 rounded-lg bg-amber-500/10 p-4 text-amber-200">
            <p className="font-medium">1:1 personalisation (data cache)</p>
            <p className="mt-1 text-sm">
              Hello {content.user.name}, your recommendations:
            </p>
            <ul className="mt-2 list-inside list-disc text-sm">
              {content.recommendations.map((rec) => (
                <li key={rec}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={false}
        contentServedFromCdn={false}
        contentServedFromCdnNote="server-rendered per request"
        secondRequestFromCache={false}
        secondRequestFromCacheNote="same user gets cached data (fewer backend calls); full response still from server"
        steps={[
          "Request hits the server. Page is an async RSC.",
          "Server reads userId from cookies (getUserIdFromCookie).",
          "Server calls getUserContentCached(userId), which uses unstable_cache(..., [userId], { revalidate: 60 }).",
          "First request for user X: cache miss — fetch runs (e.g. getUserById, build recommendations), result stored in Data Cache.",
          "Second request for user X: cache hit — cached result returned; no refetch. Page still server-rendered (1 serverless inv), but the expensive data step is cached.",
          "1 serverless invocation per view; data fetch cached per user so backend/DB usage stays under control.",
        ]}
        vercelUsage={[
          "Every page view = 1 Serverless Function invocation (RSC).",
          "Data fetch (user content) is cached per userId via unstable_cache; repeat visits by same user do not refetch.",
          "No Edge Middleware invocations.",
          "Backend/DB usage and cold-start impact reduced by data cache.",
        ]}
      />
    </div>
  );
}
