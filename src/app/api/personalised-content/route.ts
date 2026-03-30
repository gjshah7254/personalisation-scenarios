import { revalidateTag, unstable_cache } from "next/cache";
import type { Segment } from "@/lib/types";
import { getSalesforceUserContextByPlayerIdCached } from "@/lib/salesforce";
import contentfulComponentMock from "@/data/contentful-component-mock.json";

type ComponentContent = Record<string, unknown>;
type SegmentMap = Record<string, Record<string, ComponentContent>>;

const componentData = contentfulComponentMock as SegmentMap;

/** Full personalised screen — 8 components (cached per player + id). */
export const PERSONALISED_COMPONENT_IDS = [
  "hero",
  "promo",
  "banner",
  "featured",
  "navCta",
  "footerCta",
  "stats",
  "recommendations",
] as const;

function wantsNdjson(request: Request): boolean {
  const url = new URL(request.url);
  if (url.searchParams.get("format") === "ndjson") return true;
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("application/x-ndjson");
}

/**
 * Simulated CMS/generation latency per slot — only on unstable_cache MISS.
 * With Promise.all, total time is roughly max(ms) for this screen (~3.5s), not the sum.
 */
const COMPONENT_GENERATION_DELAY_MS_BY_ID: Record<string, number> = {
  hero: 1200,
  promo: 1500,
  banner: 1800,
  featured: 2100,
  navCta: 2400,
  footerCta: 2700,
  stats: 3000,
  recommendations: 3500,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function delayMsForComponent(componentId: string): number {
  return COMPONENT_GENERATION_DELAY_MS_BY_ID[componentId] ?? 3000;
}

/**
 * One module-level unstable_cache wrapper so the Data Cache key is stable across requests.
 * Invocation args (playerId, componentId) are part of the cache key (see Next.js unstable_cache).
 * Do not wrap unstable_cache inside a per-call helper — that breaks HITs on repeat requests.
 */
const getComponentContentCached = unstable_cache(
  async (playerId: string, componentId: string): Promise<ComponentContent | null> => {
    await delay(delayMsForComponent(componentId));
    const ctx = await getSalesforceUserContextByPlayerIdCached(playerId);
    if (!ctx) return null;
    const segment = ctx.segment as Segment;
    const segmentData = componentData[segment];
    if (!segmentData) return null;
    const content = segmentData[componentId];
    return content ? (content as ComponentContent) : null;
  },
  ["personalised-component"],
  { revalidate: 60, tags: ["personalised-content"] }
);

/**
 * Mobile BFF API — assembled personalised JSON (Scenario 5: bff-personalised-json).
 * Reads X-Player-Id, fetches Salesforce user context (cached by playerId),
 * returns JSON with per-component content (each cached per playerId + componentId).
 * Opt-in NDJSON: ?format=ndjson or Accept: application/x-ndjson — lines: order (componentIds), meta, component (×N), done.
 * Response is not CDN-cacheable (identity in header).
 */
export async function GET(request: Request) {
  const playerId = request.headers.get("x-player-id")?.trim() ?? request.headers.get("X-Player-Id")?.trim();
  if (!playerId) {
    return Response.json(
      { error: "X-Player-Id header required" },
      { status: 400 }
    );
  }

  const context = await getSalesforceUserContextByPlayerIdCached(playerId);
  if (!context) {
    return Response.json(
      {
        error:
          "User context not found for this playerId. Use player-1, player-2, player-3, or player-4.",
      },
      { status: 404 }
    );
  }

  const componentIds = PERSONALISED_COMPONENT_IDS;

  if (wantsNdjson(request)) {
    const enc = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            enc.encode(
              `${JSON.stringify({
                type: "order",
                componentIds: [...PERSONALISED_COMPONENT_IDS],
              })}\n`
            )
          );
          controller.enqueue(
            enc.encode(
              `${JSON.stringify({
                type: "meta",
                segment: context.segment,
                user: { name: context.user.name, email: context.user.email },
              })}\n`
            )
          );

          await Promise.all(
            componentIds.map(async (componentId) => {
              try {
                const content = await getComponentContentCached(playerId, componentId);
                controller.enqueue(
                  enc.encode(
                    `${JSON.stringify({ type: "component", id: componentId, content })}\n`
                  )
                );
              } catch (e) {
                const message = e instanceof Error ? e.message : "unknown error";
                controller.enqueue(
                  enc.encode(
                    `${JSON.stringify({
                      type: "error",
                      componentId,
                      message,
                    })}\n`
                  )
                );
              }
            })
          );

          controller.enqueue(enc.encode(`${JSON.stringify({ type: "done" })}\n`));
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    const res = new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "private, no-store",
      },
    });
    return res;
  }

  const componentEntries = await Promise.all(
    componentIds.map(async (componentId) => {
      try {
        const content = await getComponentContentCached(playerId, componentId);
        return [componentId, content] as const;
      } catch {
        return [componentId, null] as const;
      }
    })
  );

  const components = Object.fromEntries(componentEntries) as Record<
    string,
    ComponentContent | null
  >;

  const body = {
    segment: context.segment,
    user: { name: context.user.name, email: context.user.email },
    components,
  };

  const res = Response.json(body);
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

/**
 * Demo: invalidate Data Cache entries tagged for personalised-content (Salesforce-by-player + components).
 * Use `{ expire: 0 }` so entries are expired immediately. The `"max"` profile means expire: never, so tag
 * revalidation did not clear unstable_cache fetches and the next GET stayed fast.
 */
export async function POST() {
  revalidateTag("personalised-content", { expire: 0 });
  return Response.json({ revalidated: true, tag: "personalised-content" });
}
