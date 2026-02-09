import { getUserIdFromCookie } from "@/lib/cookies";
import { getUserById } from "@/lib/users";

// Simulate a delay (e.g. DB or API call) so streaming is visible
async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function StreamedPersonalisedBlock() {
  await delay(800);
  const userId = await getUserIdFromCookie();
  const user = userId ? getUserById(userId) : undefined;

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
        <p className="font-medium">Streamed: Segment A</p>
        <p className="mt-1 text-sm">Hello {user.name}. This block was streamed after the shell.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-amber-500/10 p-4 text-amber-200">
      <p className="font-medium">Streamed: Segment B</p>
      <p className="mt-1 text-sm">Hey {user.name}. This block was streamed after the shell.</p>
    </div>
  );
}
