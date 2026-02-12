import { headers } from "next/headers";

/**
 * Returns the current request's base URL (origin) from headers.
 * Use in Server Components so links use whatever domain the user is on.
 */
export async function getRequestBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host") || h.get("x-forwarded-host");
  if (!host) {
    return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
  }
  const proto = h.get("x-forwarded-proto");
  const protocol = host.includes("localhost") ? "http" : proto === "https" ? "https" : "http";
  return `${protocol}://${host}`;
}
