export type Segment = "A" | "B";

/** User profile (email is the unique identifier; segment comes from Salesforce only). */
export interface User {
  email: string;
  name: string;
}

/** Component IDs that can be personalised (used by Salesforce to drive which blocks to personalise). */
export const PERSONALISED_COMPONENT_IDS = [
  "scenario-1-block",
  "scenario-2-block",
  "scenario-3-block",
  "scenario-4-block",
  "scenario-5-block",
  "scenario-6-block",
  "scenario-7-block",
  "scenario-8-block",
] as const;

export type PersonalisedComponentId = (typeof PERSONALISED_COMPONENT_IDS)[number];

/** Rule for middleware: which pages get which component replacement (Scenario 9). */
export interface PersonalisationRule {
  pageUrls: string[];
  componentName: string;
  componentReplacementName: string;
}

/** Session payload stored in cookie for Scenario 9 (middleware reads this). */
export interface PersonalisationSession {
  segment: Segment;
  personalisationRules: PersonalisationRule[];
}

/** User context as returned by Salesforce (mock or real). Source of truth for segment and which components to personalise. */
export interface SalesforceUserContext {
  userEmail: string;
  segment: Segment;
  personalisedComponentIds: PersonalisedComponentId[];
  /** Per-page component replacement rules for middleware (Scenario 9). */
  personalisationRules?: PersonalisationRule[];
  /** User profile from Salesforce (or mock). */
  user: {
    email: string;
    name: string;
    segment: Segment;
  };
}
