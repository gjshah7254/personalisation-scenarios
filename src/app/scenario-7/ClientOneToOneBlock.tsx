"use client";

import { useEffect, useState } from "react";
import type { PersonalisedComponentId, SalesforceUserContext } from "@/lib/types";

const COMPONENT_ID: PersonalisedComponentId = "scenario-7-block";

export function ClientOneToOneBlock() {
  const [context, setContext] = useState<SalesforceUserContext | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/salesforce/user-context")
      .then((r) => r.json())
      .then((data: { context: SalesforceUserContext | null }) => {
        setContext(data.context ?? null);
      });
  }, []);

  if (context === undefined) {
    return <p className="mt-3 text-zinc-500">Loading…</p>;
  }

  if (!context) {
    return (
      <p className="mt-3 text-zinc-400">
        No user selected. Use &quot;Login&quot; in the header to pick a user.
      </p>
    );
  }

  const shouldPersonalise = context.personalisedComponentIds.includes(COMPONENT_ID);
  if (!shouldPersonalise) {
    return (
      <p className="mt-3 text-zinc-500">
        This component is not personalised for your segment (Salesforce context).
      </p>
    );
  }

  const greeting = `Hello ${context.user.name}`;
  return (
    <div className="mt-3 rounded-lg bg-indigo-500/10 p-4 text-indigo-200">
      <p className="font-medium">1:1 personalisation (Salesforce context, cached API)</p>
      <p className="mt-1 text-sm">{greeting}, here&apos;s your content.</p>
    </div>
  );
}
