import { Suspense } from "react";
import { Scenario9Content } from "./Scenario9Content";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function Placeholder() {
  return (
    <div className="space-y-8">
      <div className="h-24 rounded border border-dashed border-zinc-600 bg-zinc-900/30 animate-pulse" />
      <div className="h-64 rounded border border-dashed border-zinc-600 bg-zinc-900/30 animate-pulse" />
    </div>
  );
}

export default function Scenario9Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<Placeholder />}>
      <Scenario9Content searchParams={searchParams} />
    </Suspense>
  );
}
