import Link from "next/link";
import { getSegmentFromCookie } from "@/lib/cookies";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { SegmentDataBlock } from "./SegmentDataBlock";

export default async function Scenario4Page() {
  const segment = await getSegmentFromCookie();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 4: Middleware + Server Component hybrid
        </h1>
        <p className="mt-1 text-zinc-400">
          Middleware could set the segment; this page is a static shell. The block below is a Server
          Component that reads the segment (cookie) and fetches segment-based data. Cache can be
          configured per segment.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Segment-based data (RSC, segment from cookie)
        </h2>
        <SegmentDataBlock segment={segment} />
      </div>
    </div>
  );
}
