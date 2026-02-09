import Link from "next/link";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { ClientSegmentReveal } from "./ClientSegmentReveal";

function EmbeddedVariantA() {
  return (
    <div className="mt-3 rounded-lg bg-indigo-500/10 p-4 text-indigo-200">
      <p className="font-medium">Variant for Segment A</p>
      <p className="mt-1 text-sm">
        This block was embedded at build time for Segment A. The client reveals it by reading the
        segment cookie. No API or server involved.
      </p>
    </div>
  );
}

function EmbeddedVariantB() {
  return (
    <div className="mt-3 rounded-lg bg-amber-500/10 p-4 text-amber-200">
      <p className="font-medium">Variant for Segment B</p>
      <p className="mt-1 text-sm">
        This block was embedded at build time for Segment B. The client reveals it by reading the
        segment cookie. No API or server involved.
      </p>
    </div>
  );
}

export default function Scenario6Page() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 6: SSG with embedded variants (client reveals one)
        </h1>
        <p className="mt-1 text-zinc-400">
          This page is fully static (SSG). Both segment variants are in the HTML at build time. A
          client component reads the segment cookie and shows only the matching variant. No
          middleware, no serverless, no API call for content.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Personalised content (embedded variants, client reveals one)
        </h2>
        <ClientSegmentReveal
          segmentA={<EmbeddedVariantA />}
          segmentB={<EmbeddedVariantB />}
        />
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={false}
        contentServedFromCdn={true}
        contentServedFromCdnNote="whole page is static, CDN-cached"
        secondRequestFromCache={true}
        secondRequestFromCacheNote="page from CDN cache; no API; client reveals variant from cookie"
        steps={[
          "Page is pre-rendered at build time (SSG). No cookies(), headers(), or async data — so it stays static.",
          "Both Segment A and Segment B content are embedded in the same HTML (two blocks in the page).",
          "Static HTML is served from CDN. No middleware runs; no serverless function for the page.",
          "Client hydrates. A client component (ClientSegmentReveal) reads the personalisation-segment cookie in the browser.",
          "The component shows only the block matching the segment (A or B); the other is not displayed.",
          "No API call and no server run for personalisation. Second request (same user/segment): full response from CDN; client again reveals the matching variant from cookie.",
        ]}
        vercelUsage={[
          "Page HTML/JS/assets: served from CDN only. No serverless function for the page.",
          "No API route invocations for personalisation (no /api/me or other content API).",
          "No Edge Middleware invocations.",
          "Minimal Vercel usage: CDN bandwidth only; zero function or middleware invocations for this route.",
        ]}
      />
    </div>
  );
}
