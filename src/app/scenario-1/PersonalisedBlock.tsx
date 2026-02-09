import type { User } from "@/lib/types";

interface PersonalisedBlockProps {
  user?: User | null;
}

export function PersonalisedBlock({ user }: PersonalisedBlockProps) {
  if (!user) {
    return (
      <p className="mt-3 text-zinc-400">
        No user selected. Use &quot;View as&quot; in the header to pick a user.
      </p>
    );
  }

  if (user.segment === "A") {
    return (
      <div className="mt-3 rounded-lg bg-indigo-500/10 p-4 text-indigo-200">
        <p className="font-medium">Variant for Segment A</p>
        <p className="mt-1 text-sm">
          Hello {user.name}. This block was rendered on the server for Segment A.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-amber-500/10 p-4 text-amber-200">
      <p className="font-medium">Variant for Segment B</p>
      <p className="mt-1 text-sm">
        Hey {user.name}. This block was rendered on the server for Segment B.
      </p>
    </div>
  );
}
