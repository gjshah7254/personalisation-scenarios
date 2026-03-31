# Personalisation Approach: Middleware Routing with Cache Components for 1:1 Personalisation

This document describes an architectural approach for personalisation using:

- Next.js (Vercel) for web
- Contentful as CMS
- Salesforce MCP for user context and personalisation
- Next.js 16 Cache Components (`use cache` + `cacheLife`) and streaming for server-rendered personalisation

---

## 1. Clarifications

These apply regardless of the approach and remain consistent with other personalisation options.

### 1.1 Salesforce calls

- Executed once at session start (login) to obtain user context; result is stored (e.g. in a cookie).
- Re-fetch of user context can happen on specific events (e.g. after purchase) to keep context up to date.
- Content is defined in Contentful; personalisation rules and user context come from Salesforce MCP. Salesforce indicates which components/content to show based on Contentful IDs or variant mapping.

### 1.2 Cookies vs headers

- Website personalisation context is stored in cookies (session). Vercel Edge Middleware integrates well with cookie-based context.
- Header-based context is preferred for mobile apps when they consume Vercel APIs.

---

## 2. Approach: Middleware Routing with Cache Components for 1:1 Personalisation

### Summary

- Web: Pages use a static shell (per variant) with Cache Components for shared/cached content and Suspense for personalised content. Edge Middleware runs before the CDN: it reads the personalisation cookie and rewrites the request to a variant-specific route (e.g. `/page--<variant>`). The CDN can cache responses per variant.
- Flow: Login → Salesforce once → set HttpOnly cookie (e.g. `userContext=ctxKey`). On page request: Browser → Edge Middleware → CDN → App. Middleware does routing only (rewrite to variant route); the Next.js app reads the cookie inside a dynamic Server Component and fetches Contentful by variant. No BFF: the app calls Contentful directly.
- Response: Either a static shell only (no dynamic components) or shell + streamed RSC/HTML chunks for personalised sections. Supports 1:1 personalisation for the streamed parts while keeping the shell CDN-cacheable by variant.
- Mobile: Can follow the same pattern (e.g. pass context via header; middleware rewrites; APIs return variant-specific data) or use a separate mobile design.

### Pros

- 1:1 personalisation for streamed sections, with CDN-cacheable static shell per variant (no full SSR for every request when shell is cached).
- Middleware stays simple: only reads cookie and rewrites URL; no personalisation logic in middleware.
- Cookie stays HttpOnly: personalisation context is server-only; app reads it via `cookies()` in Server Components.
- Good performance: variant routes enable edge cache for the shell; streaming keeps TTFB low and only personalised blocks are dynamic.
- Cache Components reduce duplicate work for shared content; dynamic parts are limited to components that need request-time data.
- Single place for personalisation logic: in the Next.js app (Server Components + Contentful), not split between middleware and client.

### Cons

- Variant cardinality: Shell caching is per variant route; too many variants can increase cache keys and build/revalidate surface.
- Streaming complexity: Requires correct use of Suspense, Cache Components, and caching strategy (RSC cache vs CDN).
- Two response modes: Static shell vs streamed response; behaviour depends on whether the page has dynamic components (documentation and testing need to cover both).
- No BFF: App talks to Contentful directly; any future mobile-specific aggregation would need a separate API layer if required.

---

## 3. Web flow (sequence diagram)

The following sequence diagram shows the web flow: login (Salesforce once, cookie set), then page request with Edge Middleware before CDN, static shell path vs stream path, and Contentful for both shell and personalised content.

Flow summary: Login → cookie. Page request → Edge Middleware (rewrite to `/page--<variant>`) → CDN (serve cached or fetch from App) → App (static shell from Contentful, or shell + streamed personalised sections using cookie + Contentful).

See the full diagram and step-by-step summary in [Scenario 12: Cache Components – Sequence diagram](./scenario-12-cache-components-sequence.md).

---

## 4. Table of comparison (positioning)

| Category | This approach (Middleware + Cache Components) |
|----------|-----------------------------------------------|
| 1:1 personalisation | Yes (streamed sections; shell is variant-based) |
| Build model | Static shell per variant + on-demand stream for dynamic components |
| Performance | Strong: CDN-cached shell per variant; streaming for personalised blocks only |
| Scalability under traffic | High: CDN absorbs shell traffic; compute only for cache MISS and streamed parts |
| Risk of cache explosion | Medium (bounded by number of variant routes) |
| Middleware processing | Routing only (rewrite by cookie); no personalisation logic |
| Solution complexity | Medium (Cache Components + Suspense + clear static vs stream behaviour) |
| Vercel cost | Medium (lower than full SSR; higher than pure static if many cache MISSes) |
| Best for | Variant-based shell + 1:1 personalisation in streamed sections; cookie-based web context |

---

## 5. Related docs

- [Scenario 12: Cache Components – Sequence diagram](./scenario-12-cache-components-sequence.md) — Full sequence diagram and step-by-step summary.
- [Next.js Cache Components](https://nextjs.org/docs/app/getting-started/cache-components) — Official docs for `use cache` and cache lifecycle.
