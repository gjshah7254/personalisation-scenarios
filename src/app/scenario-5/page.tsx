import Link from "next/link";
import { Suspense } from "react";
import { StaticBuildTimeBlock } from "@/app/components/StaticBuildTimeBlock";
import { StreamedPersonalisedBlock } from "./StreamedPersonalisedBlock";

function Placeholder() {
  return (
    <div className="mt-3 rounded-lg border border-dashed border-zinc-600 p-4 text-zinc-500">
      Loading personalised content…
    </div>
  );
}

export default function Scenario5Page() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 5: Streaming + partial personalization
        </h1>
        <p className="mt-1 text-zinc-400">
          The static shell of this page streams first. The personalised section below streams in
          when the server has finished resolving it (RSC streaming). You may see the placeholder
          briefly.
        </p>
      </div>

      <StaticBuildTimeBlock />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Streamed personalised block
        </h2>
        <Suspense fallback={<Placeholder />}>
          <StreamedPersonalisedBlock />
        </Suspense>
      </div>
    </div>
  );
}
