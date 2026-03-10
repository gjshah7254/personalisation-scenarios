import Link from "next/link";
import { Suspense } from "react";
import { StaticBlock1 } from "./StaticBlock1";
import { StaticBlock2 } from "./StaticBlock2";
import { CachedRichContent } from "./CachedRichContent";
import { PersonalisedBlock } from "./PersonalisedBlock";

/** Default/placeholder shown in shell until the personalised component streams in. Taller so streaming transition is visible. */
function PersonalisedFallback({ id }: { id: number }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-600 bg-zinc-800/30 p-5 text-zinc-500 animate-pulse">
      <div className="h-6 w-3/4 rounded bg-zinc-600/50" />
      <div className="mt-3 h-4 w-full rounded bg-zinc-600/40" />
      <div className="mt-2 h-4 w-5/6 rounded bg-zinc-600/40" />
      <div className="mt-4 h-4 w-full rounded bg-zinc-600/30" />
      <div className="mt-2 h-4 w-4/5 rounded bg-zinc-600/30" />
      <div className="mt-2 h-4 w-2/3 rounded bg-zinc-600/30" />
      <div className="mt-4 flex gap-2">
        <div className="h-3 w-16 rounded bg-zinc-600/30" />
        <div className="h-3 w-20 rounded bg-zinc-600/30" />
      </div>
      <p className="mt-3 text-xs text-zinc-500">Component {id} — loading…</p>
    </div>
  );
}

/**
 * Scenario 12 demo: 10 components — 2 static, 8 personalised.
 * Static blocks are in the shell; personalised blocks stream in as they become ready (each has its own Suspense).
 */
export default function Scenario12DemoPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/scenario-12" className="text-sm text-indigo-400 hover:underline">
          ← Scenario 12
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Scenario 12 demo: 10 components
        </h1>
        <p className="mt-1 text-zinc-400">
          2 static (shell) + 1 cached content block + 8 personalised (streamed, content from cache per segment). No artificial delay; personalised blocks read from cache via use cache.
        </p>
      </div>

      {/* --- Static (2) --- */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Static (shell)
        </h2>
        <StaticBlock1 />
        <StaticBlock2 />
      </section>

      {/* --- More content (from cache) --- */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          More content (from cache)
        </h2>
        <CachedRichContent />
      </section>

      {/* --- Personalised (8), each in Suspense with default fallback --- */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Personalised (streamed)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Suspense fallback={<PersonalisedFallback id={1} />}>
            <PersonalisedBlock componentId={1} />
          </Suspense>
          <Suspense fallback={<PersonalisedFallback id={2} />}>
            <PersonalisedBlock componentId={2} />
          </Suspense>
          <Suspense fallback={<PersonalisedFallback id={3} />}>
            <PersonalisedBlock componentId={3} />
          </Suspense>
          <Suspense fallback={<PersonalisedFallback id={4} />}>
            <PersonalisedBlock componentId={4} />
          </Suspense>
          <Suspense fallback={<PersonalisedFallback id={5} />}>
            <PersonalisedBlock componentId={5} />
          </Suspense>
          <Suspense fallback={<PersonalisedFallback id={6} />}>
            <PersonalisedBlock componentId={6} />
          </Suspense>
          <Suspense fallback={<PersonalisedFallback id={7} />}>
            <PersonalisedBlock componentId={7} />
          </Suspense>
          <Suspense fallback={<PersonalisedFallback id={8} />}>
            <PersonalisedBlock componentId={8} />
          </Suspense>
        </div>
      </section>

      <p className="text-xs text-zinc-500">
        Use <strong>Login</strong> in the header to set segment A or B. Personalised blocks will show content for that segment once streamed.
      </p>
    </div>
  );
}
