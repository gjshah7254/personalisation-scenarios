import Link from "next/link";
import type { Segment } from "@/lib/types";
import { ScenarioExplanation } from "@/app/components/ScenarioExplanation";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";

interface PageProps {
  params: Promise<{ segment: string }>;
}

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{ segment: "A" }, { segment: "B" }];
}

export default async function Scenario10SegmentPage({ params }: PageProps) {
  const { segment } = await params;
  const seg = segment === "B" ? "B" : "A";

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 10: Whole page at middleware by segment (header-based)
        </h1>
        <p className="mt-1 text-zinc-400">
          Same flow as Scenario 3, but middleware reads the segment from the{" "}
          <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-indigo-300">x-segment</code>{" "}
          request header (or the <code className="rounded bg-zinc-700 px-1.5 py-0.5 text-indigo-300">segment</code> query
          param for demo). No cookie is read in middleware. In production, an API gateway or BFF
          would set the header when forwarding to Next.js. Pre-generated at build, CDN-cached per
          segment.
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
          "Middleware does not read any cookie. Segment is taken from the x-segment request header (when set by an upstream BFF/gateway), or from the segment query param for demo.",
          "Middleware rewrites the URL: /scenario-10 → /scenario-10/A or /scenario-10/B (internal rewrite; browser URL can stay /scenario-10 or include ?segment=B).",
          "Next.js serves the matching static page from generateStaticParams (pre-built at build time for A and B).",
          "Response is served from CDN; each segment has its own cached static HTML. No server render at request time.",
          "Whole page is personalised by segment; no per-component logic—the entire page variant is static.",
          "Second request (same segment): Yes — the same segment gets the same pre-built static page from CDN cache. No server or edge run; response is fully cached per segment.",
        ]}
        vercelUsage={[
          "Every request: 1 Edge Middleware invocation (reads x-segment header or segment query; rewrites URL; runs at the edge, low cost).",
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
