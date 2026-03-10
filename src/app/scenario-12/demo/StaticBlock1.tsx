/**
 * Static component 1 — no async, no cookie. Same for all users. Part of shell.
 */
export function StaticBlock1() {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-6">
      <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
        Static block 1
      </h2>
      <p className="mt-3 text-sm text-zinc-300">
        This is static content. It is identical for every user and is sent in the initial shell. No cookies, no personalisation.
      </p>
      <p className="mt-3 text-sm text-zinc-400">
        Static blocks are ideal for headers, footers, navigation, and any content that does not depend on the user. They are cached at the CDN and delivered with the first paint, so the page feels fast while personalised sections stream in below.
      </p>
      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-400">
        <li>Same HTML for all users</li>
        <li>No request-time data</li>
        <li>Fully cacheable at the edge</li>
      </ul>
    </div>
  );
}
