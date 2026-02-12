import segmentConfig from "@/data/salesforce-mock.json";

/**
 * Mock Salesforce segment-config API: returns which component IDs
 * are personalised per segment (from salesforce-mock.json).
 * Mirrors what a real Salesforce config/Journey API would return.
 */
export async function GET() {
  return Response.json(segmentConfig);
}
