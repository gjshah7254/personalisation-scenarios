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
  res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  // CDN must vary by x-segment. Next/Vercel often set Vary to RSC/router values; include those and add x-segment
  // so the response that reaches the edge has x-segment in Vary for correct cache partitioning.
  const baseVary =
    "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch";
  res.headers.set("Vary", `${baseVary}, x-segment`);
  return res;
}
