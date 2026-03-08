import cachedContentMock from "@/data/cached-content-mock.json";

/**
 * Mock API: returns shared content for Scenario 12 (Cache Components).
 * Same response for all users; suitable for use cache.
 */
export async function GET() {
  return Response.json(cachedContentMock);
}
