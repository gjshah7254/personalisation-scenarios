import type { Segment } from "@/lib/types";

interface RouteParams {
  params: Promise<{ segment: string }>;
}

/**
 * Returns segment-specific content. Segment comes from the path (set by middleware
 * after reading x-segment header or segment query). No cookie or header read here
 * so the response is cacheable by URL per segment.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { segment } = await params;
  const seg: Segment = segment === "B" ? "B" : "A";

  const dashboard =
    seg === "A"
      ? {
          title: "Enterprise dashboard",
          highlights: ["Analytics", "Team management", "Billing"],
        }
      : {
          title: "Startup dashboard",
          highlights: ["Quick stats", "Growth metrics", "Resources"],
        };

  const data = {
    segment: seg,
    message: seg === "A" ? "Welcome, enterprise user." : "Welcome, startup user.",
    dashboard,
  };

  const res = Response.json(data);
  // Single URL + x-segment header: Vercel overwrites Vary so CDN would not partition by header.
  // Disable CDN cache so every request hits origin and returns the correct segment.
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
