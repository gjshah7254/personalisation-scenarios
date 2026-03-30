import { headers } from "next/headers";

/**
 * Base URL for calling our own mock APIs from server-side code.
 * Enables "real" API-style calls instead of direct JSON imports.
 */
export function getMockApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Same-origin base URL from the incoming request (host + scheme).
 * Prefer this in Server Components when fetching this app's mock routes so the correct
 * port, preview host, and deployment are used — env defaults often return HTML instead of JSON.
 */
export async function getRequestMockApiBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const forwardedProto = h.get("x-forwarded-proto");
    const local =
      host.startsWith("localhost") ||
      host.startsWith("127.0.0.1") ||
      host.startsWith("[::1]");
    const proto = forwardedProto ?? (local ? "http" : "https");
    return `${proto}://${host}`;
  }
  return getMockApiBaseUrl();
}
