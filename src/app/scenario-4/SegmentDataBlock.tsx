import type { Segment } from "@/lib/types";

// Simulates fetching segment-specific data (e.g. with fetch + cache per segment)
async function getSegmentData(segment: Segment | undefined) {
  if (!segment) return { title: "No segment", items: [] };
  if (segment === "A") {
    return {
      title: "Enterprise features (segment from Salesforce)",
      items: [],
    };
  }
  return {
    title: "Startup features (segment from Salesforce)",
    items: [],
  };
}

interface SegmentDataBlockProps {
  segment: Segment | undefined;
  shouldPersonalise?: boolean;
}

export async function SegmentDataBlock({ segment, shouldPersonalise = true }: SegmentDataBlockProps) {
  if (!shouldPersonalise) {
    return (
      <p className="mt-3 text-zinc-500">
        This component is not personalised for your segment (Salesforce context).
      </p>
    );
  }

  const data = await getSegmentData(segment);

  if (!segment) {
    return (
      <p className="mt-3 text-zinc-400">
        No segment. Use &quot;Login&quot; in the header to pick a user (Segment A or B).
      </p>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-zinc-800/50 p-4">
      <p className="font-medium text-white">{data.title}</p>
      <ul className="mt-2 list-inside list-disc text-sm text-zinc-300">
        {data.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
