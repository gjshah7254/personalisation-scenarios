export const mobileScenarioSlugs = [
  "user-in-url",
  "segment-in-url",
  "vary-header",
  "middleware-header",
] as const;
export type MobileScenarioSlug = (typeof mobileScenarioSlugs)[number];

export interface MobileScenarioDetail {
  slug: MobileScenarioSlug;
  title: string;
  subtitle: string;
  description: string;
  urlShape: string;
  urlExamples: string[];
  technicalSteps: string[];
  vercelUsage: string[];
}

export const mobileScenariosDetail: Record<MobileScenarioSlug, MobileScenarioDetail> = {
  "user-in-url": {
    slug: "user-in-url",
    title: "Scenario 1: User ID in the URL",
    subtitle: "1:1 personalisation, CDN cache per user",
    description:
      "Mobile sends user id in the path or query. The API returns JSON with Cache-Control. Each URL is a separate cache entry on Vercel; a second request from the same user gets a CDN HIT.",
    urlShape: "GET /api/mobile/users/[userId]/[resource]",
    urlExamples: [
      "GET /api/mobile/users/user-1/dashboard",
      "GET /api/mobile/users/user-1/profile",
      "GET /api/mobile/users/user-2/dashboard",
    ],
    technicalSteps: [
      "User context (segment, personalised component IDs) is always sourced from Salesforce. Mobile can call GET /api/salesforce/user-context (or equivalent Salesforce API) with userId to get segment and which components to personalise.",
      "Mobile app resolves the current user (e.g. from auth) and has a stable user id.",
      "Every API request includes the user id in the path, e.g. /api/mobile/users/{userId}/dashboard.",
      "Next.js API route reads userId from the path (params or searchParams); do not use cookies() or headers() for identity so the route stays cacheable.",
      "Route fetches user-specific data (segment and content can be derived from Salesforce user context) and returns JSON with Cache-Control: public, s-maxage=60, stale-while-revalidate=300 (or your chosen TTL).",
      "Vercel CDN caches the response keyed by the full URL. Each distinct userId in the path gets a separate cache entry.",
      "Second request from the same user (same URL) is served from the CDN (HIT); no serverless invocation.",
    ],
    vercelUsage: [
      "One cache entry per (userId, resource). First request per user per resource = 1 serverless invocation; subsequent requests within TTL = CDN HIT.",
      "No Edge Middleware required for caching.",
      "Scales with unique users and cache hit rate.",
    ],
  },
  "segment-in-url": {
    slug: "segment-in-url",
    title: "Scenario 2: Segment in the URL",
    subtitle: "Segment-level personalisation, two cache keys",
    description:
      "The URL includes the segment. One cached response per segment; all users in that segment share it.",
    urlShape: "GET /api/mobile/segment/[segment]/[resource]",
    urlExamples: [
      "GET /api/mobile/segment/A/dashboard",
      "GET /api/mobile/segment/B/dashboard",
    ],
    technicalSteps: [
      "User context (segment, personalised component IDs) is always sourced from Salesforce. Mobile calls GET /api/salesforce/user-context (or equivalent Salesforce API) with userId to get the user's segment (A or B) and which components to personalise.",
      "Mobile app uses the segment from Salesforce for subsequent API requests.",
      "API request uses the segment in the path, e.g. /api/mobile/segment/A/dashboard.",
      "Next.js API route reads segment from the path; do not use cookies() so the response is cacheable.",
      "Route returns segment-specific JSON with Cache-Control.",
      "Vercel CDN caches by URL; only two cache entries per resource (one for A, one for B).",
      "All users in segment A share the same cached response; same for segment B.",
    ],
    vercelUsage: [
      "Two cache entries per resource (segment A and B). Very high cache hit rate. Vercel CDN hit for even first time visit.",
      "Minimal serverless invocations after initial cache fill.",
      "No Edge Middleware required.",
    ],
  },
  "vary-header": {
    slug: "vary-header",
    title: "Scenario 3: User in header + Vary",
    subtitle: "Per-user cache if CDN supports Vary",
    description:
      "Single URL; mobile sends user identity in a header. The response sets Vary and Cache-Control. Cache behaviour depends on the CDN respecting Vary.",
    urlShape: "GET /api/mobile/dashboard (header: X-User-Id or Authorization)",
    urlExamples: [
      "GET /api/mobile/dashboard with header X-User-Id: user-1",
      "GET /api/mobile/dashboard with header X-User-Id: user-2",
    ],
    technicalSteps: [
      "User context (segment, personalised component IDs) is always sourced from Salesforce. Mobile can call the user-context API (or Salesforce) with userId to get segment and which components to personalise before or in parallel with this request.",
      "Mobile sends a single URL (e.g. GET /api/mobile/dashboard) with user identity in a header (e.g. X-User-Id: user-1 or Authorization: Bearer <token>).",
      "API route reads the header, fetches user-specific data (e.g. from Salesforce or cached context), returns JSON.",
      "Response includes Vary: X-User-Id (or the header you use) and Cache-Control: public, s-maxage=60, ...",
      "The CDN is supposed to treat different values of the Vary header as different cache keys. If Vercel does this, each user gets a separate cached response.",
      "Verify on Vercel that the edge cache keys on the Vary header; otherwise all users may get the same cached response (wrong).",
    ],
    vercelUsage: [
      "Depends on CDN: if Vary is part of the cache key, one entry per user; if not, only one entry (not suitable for personalisation).",
      "Recommend verifying Vercel behaviour before relying on this for production.",
    ],
  },
  "middleware-header": {
    slug: "middleware-header",
    title: "Scenario 4: Segment in header, middleware rewrite",
    subtitle: "Single URL, header drives segment; CDN cache per segment",
    description:
      "Mobile sends one URL with the x-segment header. Middleware rewrites to a segment-specific path; the API returns personalised JSON. Response cached by URL per segment.",
    urlShape: "GET /api/mobile/content (header: x-segment)",
    urlExamples: [
      "GET /api/mobile/content with header x-segment: A",
      "GET /api/mobile/content with header x-segment: B",
    ],
    technicalSteps: [
      "Mobile sends a single URL (GET /api/mobile/content) with segment in the x-segment header (e.g. x-segment: A or x-segment: B).",
      "Edge middleware runs before the request hits the API. Middleware does not read any cookie.",
      "Middleware reads the x-segment header, normalises to A or B (default A if missing), and rewrites the path to /api/mobile/content/A or /api/mobile/content/B.",
      "The API route at /api/mobile/content/[segment] receives the segment from the path and returns segment-specific JSON with Cache-Control: public, s-maxage=60, stale-while-revalidate=300.",
      "Vercel CDN caches the response by URL. Each segment gets a separate cache entry (two entries per resource: A and B).",
      "Second request with the same segment (same effective URL after rewrite) is served from the CDN (HIT); API route runs only on cache miss.",
    ],
    vercelUsage: [
      "One cache entry per segment per resource. First request per segment = 1 Edge Middleware + 1 serverless invocation; subsequent requests within TTL = CDN HIT (middleware may still run at edge).",
      "Middleware runs at edge; API route runs only on cache miss.",
    ],
  },
};
