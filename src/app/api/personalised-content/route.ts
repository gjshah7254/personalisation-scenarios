import { unstable_cache } from "next/cache";
import type { Segment } from "@/lib/types";
import {
  getSalesforceUserContextByPlayerIdCached,
} from "@/lib/salesforce";
import contentfulComponentMock from "@/data/contentful-component-mock.json";

type ComponentContent = Record<string, unknown>;
type SegmentMap = Record<string, Record<string, ComponentContent>>;

const componentData = contentfulComponentMock as SegmentMap;

const PERSONALISED_COMPONENT_IDS = [
  "hero",
  "promo",
  "banner",
  "featured",
  "navCta",
  "footerCta",
  "stats",
  "recommendations",
] as const;

/** Cached content for one component for one player (by playerId + componentId). */
async function getComponentContentCached(
  playerId: string,
  componentId: string
): Promise<ComponentContent | null> {
  return unstable_cache(
    async () => {
      const ctx = await getSalesforceUserContextByPlayerIdCached(playerId);
      if (!ctx) return null;
      const segment = ctx.segment as Segment;
      const segmentData = componentData[segment];
      if (!segmentData) return null;
      const content = segmentData[componentId];
      return content ? (content as ComponentContent) : null;
    },
    ["personalised-component", playerId, componentId],
    { revalidate: 60 }
  )();
}

/**
 * Mobile Scenario 5: Player ID in header.
 * Reads X-Player-Id, fetches Salesforce user context (cached by playerId),
 * returns JSON with per-component content (each cached by playerId + componentId).
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
      { error: "User context not found for this playerId. Use player-1, player-2, player-3, or player-4." },
      { status: 404 }
    );
  }

  const components: Record<string, ComponentContent | null> = {};
  for (const componentId of PERSONALISED_COMPONENT_IDS) {
    components[componentId] = await getComponentContentCached(playerId, componentId);
  }

  const body = {
    segment: context.segment,
    user: { name: context.user.name, email: context.user.email },
    components,
  };

  const res = Response.json(body);
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
