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
