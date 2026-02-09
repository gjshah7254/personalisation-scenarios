import Link from "next/link";
import { getUserIdFromCookie } from "@/lib/cookies";
import { getUserById } from "@/lib/users";
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
    </div>
  );
}
