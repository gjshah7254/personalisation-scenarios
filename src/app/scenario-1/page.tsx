import Link from "next/link";
import { getUserIdFromCookie } from "@/lib/cookies";
import { getSalesforceUserContext } from "@/lib/salesforce";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { PersonalisedBlock } from "./PersonalisedBlock";

const COMPONENT_ID = "scenario-1-block" as const;

export default async function Scenario1Page() {
  const userId = await getUserIdFromCookie();
  const sfContext = userId ? await getSalesforceUserContext(userId) : null;
  const shouldPersonalise = sfContext?.personalisedComponentIds.includes(COMPONENT_ID) ?? false;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Scenario 1: Server-side personalised component</h1>
        <p className="mt-1 text-zinc-400">
          This page is rendered on the server. User context (segment, personalised components) comes from
          Salesforce (mock). We decide the variant and stream the result as a Server Component.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Personalised content (RSC, segment from Salesforce)
        </h2>
        <PersonalisedBlock
          user={sfContext?.user}
          segment={sfContext?.segment}
          shouldPersonalise={shouldPersonalise}
        />
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
          "Server reads userId from cookies and fetches user context from Salesforce (mock API: segment, personalised component IDs).",
          "If this component is in the user's personalisedComponentIds, the server chooses the variant using the segment from Salesforce (A or B).",
          "Personalised block is rendered on the server with the chosen variant. Full HTML is streamed to the client.",
          "No client-side JS is needed for the personalised content.",
          "Second request (same user): No — the page is dynamic; each request is re-rendered. Response is not CDN-cached.",
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
