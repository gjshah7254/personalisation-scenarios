import Link from "next/link";
import { getUserIdFromCookie } from "@/lib/cookies";
import { getUserById } from "@/lib/users";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { PersonalisedBlock } from "./PersonalisedBlock";

export default async function Scenario1Page() {
  const userId = await getUserIdFromCookie();
  const user = userId ? getUserById(userId) : undefined;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Scenario 1: Server-side personalised component</h1>
        <p className="mt-1 text-zinc-400">
          This page is rendered on the server. We read the cookie, decide the variant, and stream the
          result as a Server Component. No client JS needed for the personalised block.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Personalised content (RSC)
        </h2>
        <PersonalisedBlock user={user} />
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={false}
        contentServedFromCdn={false}
        contentServedFromCdnNote="server-rendered per request"
        secondRequestFromCache={false}
        secondRequestFromCacheNote="each request is server-rendered; response not CDN-cached"
        steps={[
          "Request hits the Next.js server (no middleware runs for this route).",
          "Page is rendered as a Server Component (RSC).",
          "Server reads the user/segment from cookies (e.g. personalisation-user-id, personalisation-segment).",
          "Server looks up the user (e.g. from mock data) and chooses the variant (Segment A or B).",
          "Personalised block is rendered on the server with the chosen variant.",
          "Full HTML is streamed to the client. No client-side JS is needed for the personalised content.",
          "Second request (same user/segment): No — the page is dynamic; each request is re-rendered on the server. The response is not CDN-cached. (Next.js unstable_cache or segment-based data cache would only cache data on the server, not the response at CDN.)",
        ]}
        vercelUsage={[
          "Every page view = 1 Serverless Function invocation (full SSR).",
          "No Edge Middleware invocations for this route.",
          "Bandwidth: full HTML response from origin on every request (no CDN cache for this dynamic route by default).",
          "Usage scales with traffic: more visitors = more function invocations and higher cost.",
        ]}
      />
    </div>
  );
}
