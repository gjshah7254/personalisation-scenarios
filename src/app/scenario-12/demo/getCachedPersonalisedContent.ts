import { cacheLife } from "next/cache";
import { PERSONALISED_MOCK } from "./mock-data";
import type { SegmentContent } from "./mock-data";

type Segment = "A" | "B";
type ComponentId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Returns personalised content for (segment, componentId). Cached per key with use cache.
 * First request fills the cache; subsequent requests with same segment + componentId read from cache.
 */
export async function getCachedPersonalisedContent(
  segment: Segment,
  componentId: ComponentId
): Promise<SegmentContent | null> {
  "use cache";
  cacheLife("minutes");

  const item = PERSONALISED_MOCK.find((m) => m.id === componentId);
  if (!item) return null;
  return segment === "B" ? item.segmentB : item.segmentA;
}
