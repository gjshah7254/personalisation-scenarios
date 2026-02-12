"use client";

import { useEffect, useState } from "react";
import type { PersonalisedComponentId, SalesforceUserContext } from "@/lib/types";

interface ClientSegmentRevealProps {
  componentId?: PersonalisedComponentId;
  segmentA: React.ReactNode;
  segmentB: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientSegmentReveal({
  componentId = "scenario-6-block",
  segmentA,
  segmentB,
  fallback,
}: ClientSegmentRevealProps) {
  const [context, setContext] = useState<SalesforceUserContext | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/salesforce/user-context")
      .then((r) => r.json())
      .then((data: { context: SalesforceUserContext | null }) => {
        setContext(data.context ?? null);
      });
  }, []);

  if (context === undefined) {
    return <>{fallback ?? <p className="mt-3 text-zinc-500">Loading…</p>}</>;
  }

  if (!context) {
    return (
      <>{fallback ?? <p className="mt-3 text-zinc-400">No user. Use &quot;Login&quot; in the header to pick a user.</p>}</>
    );
  }

  const shouldPersonalise = context.personalisedComponentIds.includes(componentId);
  if (!shouldPersonalise) {
    return (
      <p className="mt-3 text-zinc-500">
        This component is not personalised for your segment (Salesforce context).
      </p>
    );
  }

  if (context.segment === "A") return <>{segmentA}</>;
  if (context.segment === "B") return <>{segmentB}</>;
  return <>{fallback ?? <p className="mt-3 text-zinc-400">No segment.</p>}</>;
}
