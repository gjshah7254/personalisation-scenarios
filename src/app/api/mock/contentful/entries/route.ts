import segmentContentMock from "@/data/segment-content-mock.json";
import type { Segment } from "@/lib/types";

type CardContent = { title: string; body: string };
type ComponentSpec = { id: string; segmentA: CardContent; segmentB: CardContent };

const components = (segmentContentMock as { components: ComponentSpec[] }).components;

/**
 * Mock Contentful API: entries by segment (personalised content).
 * GET /api/mock/contentful/entries?segment=A|B
 * Used by personalised components on Scenario 12 (after segment from Salesforce).
 */
export async function GET(request: Request) {
  const segmentParam = new URL(request.url).searchParams.get("segment");
  const segment: Segment = segmentParam === "B" ? "B" : "A";

  const entries = components.map((spec) => {
    const content = segment === "B" ? spec.segmentB : spec.segmentA;
    return { id: spec.id, title: content.title, body: content.body };
  });

  return Response.json({ segment, entries });
}
