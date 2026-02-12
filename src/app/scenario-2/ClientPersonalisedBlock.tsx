"use client";

import { useEffect, useState } from "react";
import type { SalesforceUserContext } from "@/lib/types";

const COMPONENT_ID = "scenario-2-block";

export function ClientPersonalisedBlock() {
  const [context, setContext] = useState<SalesforceUserContext | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/salesforce/user-context")
      .then((r) => r.json())
      .then((data: { context: SalesforceUserContext | null }) => setContext(data.context ?? null));
  }, []);

  if (context === undefined) {
    return <p className="mt-3 text-zinc-500">Loading...</p>;
  }

  if (!context) {
    return (
      <p className="mt-3 text-zinc-400">
        No user selected. Use &quot;View as&quot; in the header to pick a user.
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

  if (context.segment === "A") {
    return (
      <div className="mt-3 rounded-lg bg-indigo-500/10 p-4 text-indigo-200">
        <p className="font-medium">Variant for Segment A (client, segment from Salesforce)</p>
        <p className="mt-1 text-sm">
          Hello {context.user.name}. This block was rendered in the browser for Segment A.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-amber-500/10 p-4 text-amber-200">
      <p className="font-medium">Variant for Segment B (client, segment from Salesforce)</p>
      <p className="mt-1 text-sm">
        Hey {context.user.name}. This block was rendered in the browser for Segment B.
      </p>
    </div>
  );
}
