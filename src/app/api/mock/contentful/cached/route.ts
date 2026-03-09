import contentfulCachedMock from "@/data/contentful-cached-mock.json";

/**
 * Mock Contentful API: shared/cached content (non-personalised).
 * Used by CachedDataBlock (use cache) on Scenario 12.
 */
export async function GET() {
  return Response.json(contentfulCachedMock);
}
