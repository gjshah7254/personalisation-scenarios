/**
 * Static component 2 — no async, no cookie. Same for all users. Part of shell.
 */
export function StaticBlock2() {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-6">
      <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
        Static block 2
      </h2>
      <p className="mt-3 text-sm text-zinc-300">
        Another static block. Build-time or cached; no request-time data. Good for CDN and fast first paint.
      </p>
      <p className="mt-3 text-sm text-zinc-400">
        In this demo, the two static blocks appear immediately. The eight personalised blocks show a loading skeleton first, then each one is replaced by real content as the server finishes rendering it (staggered by component ID so you can see the stream order).
      </p>
      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-400">
        <li>Visible in initial HTML</li>
        <li>No waterfall for this content</li>
        <li>Contrast with streamed blocks below</li>
      </ul>
    </div>
  );
}
