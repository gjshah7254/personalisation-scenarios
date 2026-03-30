import type { Segment } from "@/lib/types";
import contentfulComponentMock from "@/data/contentful-component-mock.json";

type ComponentContent = Record<string, unknown>;
type SegmentMap = Record<string, Record<string, ComponentContent>>;

const data = contentfulComponentMock as SegmentMap;

/**
 * Mock Contentful API: returns content for a component by segment (for mobile BFF personalised JSON).
 * Query: ?segment=A|B&componentId=hero|promo
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const segment = searchParams.get("segment") as Segment | null;
  const componentId = searchParams.get("componentId");

  if (!segment || (segment !== "A" && segment !== "B")) {
    return Response.json(
      { error: "segment required (query param: ?segment=A or segment=B)" },
      { status: 400 }
    );
  }
  if (!componentId) {
    return Response.json(
      { error: "componentId required (query param: ?componentId=...)" },
      { status: 400 }
    );
  }

  const segmentData = data[segment];
  if (!segmentData) {
    return Response.json({ error: "Segment not found" }, { status: 404 });
  }

  const content = segmentData[componentId];
  if (!content) {
    return Response.json(
      { error: `Component ${componentId} not found for segment ${segment}` },
      { status: 404 }
    );
  }

  return Response.json(content);
}
