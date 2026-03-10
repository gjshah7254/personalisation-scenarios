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
    </div>
  );
}
