import Link from "next/link";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { ClientPersonalisedBlock } from "./ClientPersonalisedBlock";

export default function Scenario2Page() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 2: Client-side personalised component
        </h1>
        <p className="mt-1 text-zinc-400">
          This page is static and CDN-cached. The personalised block is a client component that
          fetches the current user and renders the right variant in the browser.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Personalised content (client)
        </h2>
        <ClientPersonalisedBlock />
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={false}
        contentServedFromCdn={false}
        contentServedFromCdnNote="client-rendered after hydration; page shell can be from CDN"
        secondRequestFromCache={true}
        secondRequestFromCacheNote="page HTML from CDN cache; personalised block filled client-side again"
        steps={[
          "Page is pre-rendered at build time (or served from CDN). No middleware runs.",
          "Static HTML is sent to the client; the page shell is identical for all users.",
          "Client-side JS hydrates the page. The personalised block is a Client Component.",
          "The client component runs in the browser and calls an API (e.g. GET /api/me) to get the current user/segment from cookies.",
          "Once the API returns, the component re-renders with the correct variant (Segment A or B).",
          "Personalisation happens entirely in the browser after the initial load.",
          "Second request (same user/segment): Yes for the page HTML — it is served from CDN cache (same static page for everyone). The personalised block is still filled in on the client after hydration; the API may be cached by the browser or CDN.",
        ]}
        vercelUsage={[
          "Page HTML/JS/assets: served from CDN (no serverless function for the page).",
          "Each page load triggers 1 API route invocation (GET /api/me) from the client.",
          "No Edge Middleware invocations.",
          "Lower function usage than Scenario 1: one light API call per view instead of full SSR.",
        ]}
      />
    </div>
  );
}
