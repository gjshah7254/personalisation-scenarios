export type Segment = "A" | "B";

export interface User {
  id: string;
  email: string;
  name: string;
  segment: Segment;
}
