/**
 * Mock content for the "More content (from cache)" section.
 * Read via use cache so the block is cached and reused.
 */
export const CACHED_PAGE_CONTENT = {
  title: "More about this approach",
  intro:
    "This section is rendered from cache. The first time you load the page, the server runs the cached component and stores the result. On subsequent loads (or for other users hitting the same cache key), the content is read from cache without re-running the logic.",
  paragraphs: [
    "Middleware routing with Cache Components gives you a static shell per variant, with personalised sections streamed in. The shell can include default or placeholder content for every component slot; only the components that need request-time data (e.g. cookie + Contentful) are streamed.",
    "Cache Components (use cache + cacheLife) let you cache the output of a component or function per serialisable input. Here, the personalised block content is cached per (segment, componentId), and this rich content block is cached with no inputs so it is shared across all users.",
    "On Vercel, the RSC cache lives on the origin (Serverless). The CDN caches the full response (e.g. per variant route after middleware rewrite). So you get edge caching for the shell and origin-level caching for component output.",
  ],
  bullets: [
    "Static shell: fast first paint, CDN-cached per variant.",
    "Streamed sections: only the boundaries that need personalisation.",
    "Cache per component: use cache keys by (segment, componentId) or static for shared content.",
    "One serverless invocation per page request; all stream chunks come from the same render.",
  ],
};
