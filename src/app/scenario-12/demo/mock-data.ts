/**
 * Mock Contentful-style content for 8 personalised components.
 * Each component has segment A and B variants (1:1 personalisation by segment).
 */
export type SegmentContent = { title: string; body: string };

export type PersonalisedMockItem = {
  id: number;
  segmentA: SegmentContent;
  segmentB: SegmentContent;
};

export const PERSONALISED_MOCK: PersonalisedMockItem[] = [
  {
    id: 1,
    segmentA: { title: "Hero for Segment A", body: "Welcome back! Here are your recommended picks." },
    segmentB: { title: "Hero for Segment B", body: "New here? Start with our most popular items." },
  },
  {
    id: 2,
    segmentA: { title: "Promo A", body: "20% off your next order. Code: SEGMENT-A." },
    segmentB: { title: "Promo B", body: "Free shipping on orders over $50." },
  },
  {
    id: 3,
    segmentA: { title: "Feature highlight A", body: "Premium analytics and custom reports." },
    segmentB: { title: "Feature highlight B", body: "Quick insights and simple dashboards." },
  },
  {
    id: 4,
    segmentA: { title: "Recommendation A", body: "Based on your history: Top 3 for you." },
    segmentB: { title: "Recommendation B", body: "Trending now: See what others are viewing." },
  },
  {
    id: 5,
    segmentA: { title: "CTA A", body: "Start your free trial — 14 days full access." },
    segmentB: { title: "CTA B", body: "Book a demo and we'll walk you through it." },
  },
  {
    id: 6,
    segmentA: { title: "Testimonial A", body: "Enterprise customers love our support." },
    segmentB: { title: "Testimonial B", body: "Small teams get up and running in minutes." },
  },
  {
    id: 7,
    segmentA: { title: "Newsletter A", body: "Get weekly tips for power users." },
    segmentB: { title: "Newsletter B", body: "Weekly digest: simple and concise." },
  },
  {
    id: 8,
    segmentA: { title: "Footer CTA A", body: "Contact sales for volume pricing." },
    segmentB: { title: "Footer CTA B", body: "Chat with us — we're here to help." },
  },
];
