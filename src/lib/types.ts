export type Segment = "A" | "B";

export interface User {
  id: string;
  email: string;
  name: string;
  segment: Segment;
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

/** User context as returned by Salesforce (mock or real). Source of truth for segment and which components to personalise. */
export interface SalesforceUserContext {
  userId: string;
  segment: Segment;
  personalisedComponentIds: PersonalisedComponentId[];
  /** User profile from Salesforce (or mock). */
  user: {
    id: string;
    name: string;
    email: string;
    segment: Segment;
  };
}
