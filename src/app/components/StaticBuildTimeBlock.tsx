/**
 * Static component — built at build time. Same output for all users; no cookies, no request data.
 */
export function StaticBuildTimeBlock() {
  return (
    <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-6">
      <h2 className="text-sm font-medium uppercase tracking-wider text-emerald-400/90">
        Static content (build time)
      </h2>
      <p className="mt-3 text-sm text-zinc-300">
        This block is static. It was included at build time and is identical for every user. No
        cookies, no segment, no runtime data — ideal for CDN caching and fast delivery.
      </p>
      <p className="mt-2 text-xs text-zinc-500">
        Same on all scenario pages to contrast with the personalised sections.
      </p>
    </div>
  );
}
