/**
 * Maps legacy component param values to current names so old session cookies
 * still show the new labels in URLs and on the scenario-9 page.
 */
const LEGACY_TO_CURRENT: Record<string, string> = {
  "duplexcomponentv2-22222222222222": "Sample Component V2-Sample Component V2 Replaced with new component",
  "duplexcomponentv3-3333333333333": "Sample Component V3-Sample Component V3 Replaced with new component",
};

export function normaliseComponentParam(value: string): string {
  return LEGACY_TO_CURRENT[value] ?? value;
}
