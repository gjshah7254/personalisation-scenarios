import { cacheLife } from "next/cache";
import { CACHED_PAGE_CONTENT } from "./cached-page-content-mock";

/**
 * Large block of content read from cache. use cache + cacheLife so the result
 * is cached; first request runs and caches, later requests read from cache.
 */
export async function CachedRichContent() {
  "use cache";
  cacheLife("minutes");

  const { title, intro, paragraphs, bullets } = CACHED_PAGE_CONTENT;

  return (
    <div className="rounded-xl border border-cyan-800/50 bg-cyan-950/30 p-6">
      <h2 className="text-sm font-medium uppercase tracking-wider text-cyan-400/90">
        {title}
      </h2>
      <p className="mt-3 text-sm text-zinc-300">{intro}</p>
      <div className="mt-4 space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-zinc-400">
            {p}
          </p>
        ))}
      </div>
      <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-400">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-cyan-400/70">
        This block uses use cache + cacheLife(&quot;minutes&quot;). Content is read from cache after the first request.
      </p>
    </div>
  );
}
