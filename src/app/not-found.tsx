import Link from "next/link";

/**
 * Static 404 page. Must not access cookies/headers so it can prerender with cacheComponents.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <h1 className="text-2xl font-bold text-white">404 – Page not found</h1>
      <p className="text-zinc-400">The page you’re looking for doesn’t exist.</p>
      <Link
        href="/"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Back to home
      </Link>
    </div>
  );
}
