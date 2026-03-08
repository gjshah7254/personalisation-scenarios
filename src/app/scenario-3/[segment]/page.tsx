import Link from "next/link";
import type { Segment } from "@/lib/types";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";

interface PageProps {
  params: Promise<{ segment: string }>;
}

export async function generateStaticParams() {
  return [{ segment: "A" }, { segment: "B" }];
}

export default async function Scenario3SegmentPage({ params }: PageProps) {
  const { segment } = await params;
  const seg = segment === "B" ? "B" : "A";

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 3: Whole page at middleware by segment
        </h1>
        <p className="mt-1 text-zinc-400">
          Segment comes from Salesforce (set when you use &quot;Login&quot;). Middleware reads the
          segment cookie and rewrites to this segment-specific page. Pre-generated at build, CDN-cached per segment.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          You are viewing the page for Segment {seg}
        </h2>
        <SegmentContent segment={seg} />
      </div>

      <ScenarioExplanation
        title="How this scenario works"
        middlewareUsed={true}
        contentServedFromCdn={true}
        contentServedFromCdnNote="whole page is static per segment, CDN-cached"
        secondRequestFromCache={true}
        secondRequestFromCacheNote="same segment gets same static page from CDN cache"
        steps={[
          "Request hits Vercel edge; middleware runs before the page.",
          "Segment is sourced from Salesforce when the user is set (Login); the segment cookie is kept in sync with Salesforce.",
          "Middleware reads the segment from cookies (e.g. personalisation-segment). Defaults to A if missing.",
          "Middleware rewrites the URL: /scenario-3 → /scenario-3/A or /scenario-3/B (internal rewrite; browser URL stays /scenario-3).",
          "Next.js serves the matching static page from generateStaticParams (pre-built at build time for A and B).",
          "Response is served from CDN; each segment has its own cached static HTML. No server render at request time.",
          "Whole page is personalised by segment; no per-component logic—the entire page variant is static.",
          "Second request (same segment): Yes — the same segment gets the same pre-built static page from CDN cache. No server or edge run; response is fully cached per segment.",
        ]}
        vercelUsage={[
          "Every request: 1 Edge Middleware invocation (reads segment cookie—synced from Salesforce; rewrites URL; runs at the edge, low cost).",
          "Page response: served from CDN; no Serverless Function invocation for the page.",
          "Bandwidth: from CDN after first request per segment; origin not hit for cached responses.",
          "Lowest serverless usage: only middleware runs; page is static and CDN-cached.",
        ]}
      />
    </div>
  );
}

function SegmentContent({ segment }: { segment: Segment }) {
  if (segment === "A") {
    return (
      <div className="mt-3 rounded-lg bg-indigo-500/10 p-4 text-indigo-200">
        <p className="font-medium">Enterprise segment (A)</p>
        <p className="mt-1 text-sm">
          This entire page was served from a static file for Segment A. Fast and cacheable.
        </p>
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-lg bg-amber-500/10 p-4 text-amber-200">
      <p className="font-medium">Startup segment (B)</p>
      <p className="mt-1 text-sm">
        This entire page was served from a static file for Segment B. Fast and cacheable.
      </p>
    </div>
  );
}
