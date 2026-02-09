import Link from "next/link";
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
    </div>
  );
}
