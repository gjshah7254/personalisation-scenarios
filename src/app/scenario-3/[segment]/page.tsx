import Link from "next/link";
import type { Segment } from "@/lib/types";

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
          Middleware read your segment cookie and rewrote the request to this segment-specific page.
          This page is pre-generated at build (generateStaticParams) and CDN-cached per segment.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          You are viewing the page for Segment {seg}
        </h2>
        <SegmentContent segment={seg} />
      </div>
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
