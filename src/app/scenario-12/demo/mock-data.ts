/**
 * Mock Contentful-style content for 8 personalised components.
 * Each component has segment A and B variants (1:1 personalisation by segment).
 * Extra content (paragraph, bullets) so blocks are taller and streaming is visible.
 */
export type SegmentContent = {
  title: string;
  body: string;
  paragraph?: string;
  bullets?: string[];
};

export type PersonalisedMockItem = {
  id: number;
  segmentA: SegmentContent;
  segmentB: SegmentContent;
};

export const PERSONALISED_MOCK: PersonalisedMockItem[] = [
  {
    id: 1,
    segmentA: {
      title: "Hero for Segment A",
      body: "Welcome back! Here are your recommended picks based on your browsing and purchase history.",
      paragraph: "We've refreshed your feed with new items that match your preferences. Check back often for updates.",
      bullets: ["Personalised recommendations", "Recently viewed", "Saved for later"],
    },
    segmentB: {
      title: "Hero for Segment B",
      body: "New here? Start with our most popular items and bestsellers across the site.",
      paragraph: "Thousands of customers start here every day. You can filter by category or search for something specific.",
      bullets: ["Top sellers this week", "New arrivals", "Staff picks"],
    },
  },
  {
    id: 2,
    segmentA: {
      title: "Promo A",
      body: "20% off your next order. Use code SEGMENT-A at checkout. Valid on full-price items only.",
      paragraph: "This offer is exclusive to your segment. No minimum spend. Expires at the end of the month.",
      bullets: ["One use per account", "Excludes clearance", "Combine with loyalty points"],
    },
    segmentB: {
      title: "Promo B",
      body: "Free shipping on orders over $50. No code needed — we'll apply it automatically at checkout.",
      paragraph: "Standard delivery only. Express and international shipping may have different thresholds.",
      bullets: ["Continental US", "5–7 business days", "Track your order in account"],
    },
  },
  {
    id: 3,
    segmentA: {
      title: "Feature highlight A",
      body: "Premium analytics and custom reports. Build dashboards and export data for your team.",
      paragraph: "Enterprise plans include unlimited reports, scheduled emails, and API access for integrations.",
      bullets: ["Custom metrics", "Scheduled reports", "API access", "Dedicated support"],
    },
    segmentB: {
      title: "Feature highlight B",
      body: "Quick insights and simple dashboards. See your key numbers at a glance without the complexity.",
      paragraph: "Perfect for small teams. No setup required — we'll suggest a default dashboard based on your usage.",
      bullets: ["Pre-built templates", "One-click setup", "Email digest", "Help centre access"],
    },
  },
  {
    id: 4,
    segmentA: {
      title: "Recommendation A",
      body: "Based on your history: Top 3 for you. These items are selected using your past orders and saved items.",
      paragraph: "Our algorithm updates daily. The more you browse and purchase, the better the recommendations.",
      bullets: ["Frequently bought together", "Similar to your purchases", "Trending in your categories"],
    },
    segmentB: {
      title: "Recommendation B",
      body: "Trending now: See what others are viewing and buying. Popular picks across the site this week.",
      paragraph: "Great for discovery. These change often so there's always something new to explore.",
      bullets: ["Best sellers", "Most viewed", "Highly rated", "New and notable"],
    },
  },
  {
    id: 5,
    segmentA: {
      title: "CTA A",
      body: "Start your free trial — 14 days full access. No credit card required. Cancel anytime.",
      paragraph: "You'll get access to all features, including premium support. We'll send a reminder before the trial ends.",
      bullets: ["Full feature access", "No credit card", "Cancel anytime", "Email support"],
    },
    segmentB: {
      title: "CTA B",
      body: "Book a demo and we'll walk you through it. A 30-minute call with our team, tailored to your use case.",
      paragraph: "See the product in action and ask questions. We can also discuss pricing and implementation.",
      bullets: ["30 min call", "Live walkthrough", "Q&A", "Recording sent after"],
    },
  },
  {
    id: 6,
    segmentA: {
      title: "Testimonial A",
      body: "Enterprise customers love our support. Dedicated success managers and 24/7 technical support.",
      paragraph: "We work with teams from 500 to 50,000+ users. SLA-backed uptime and custom onboarding.",
      bullets: ["Dedicated CSM", "24/7 support", "SLA", "Custom onboarding"],
    },
    segmentB: {
      title: "Testimonial B",
      body: "Small teams get up and running in minutes. No lengthy setup or heavy training required.",
      paragraph: "Self-serve docs, video tutorials, and a friendly support team when you need help.",
      bullets: ["Quick start guide", "Video tutorials", "Community forum", "Email support"],
    },
  },
  {
    id: 7,
    segmentA: {
      title: "Newsletter A",
      body: "Get weekly tips for power users. Advanced features, shortcuts, and best practices from our team.",
      paragraph: "Includes early access to new features and invites to webinars and office hours.",
      bullets: ["Weekly digest", "Advanced tips", "Early access", "Webinar invites"],
    },
    segmentB: {
      title: "Newsletter B",
      body: "Weekly digest: simple and concise. One email per week with the highlights you need.",
      paragraph: "No spam, no long reads. Just the key updates and a few quick tips to get more value.",
      bullets: ["Once a week", "Short and clear", "Key updates only", "Unsubscribe anytime"],
    },
  },
  {
    id: 8,
    segmentA: {
      title: "Footer CTA A",
      body: "Contact sales for volume pricing. Custom quotes, multi-year discounts, and enterprise agreements.",
      paragraph: "Our team will respond within one business day. Include your company size and use case for a faster reply.",
      bullets: ["Volume discounts", "Custom terms", "Dedicated account", "POC support"],
    },
    segmentB: {
      title: "Footer CTA B",
      body: "Chat with us — we're here to help. Live chat during business hours or leave a message anytime.",
      paragraph: "Average response time under 2 hours. You can also search our help centre or submit a ticket.",
      bullets: ["Live chat", "Help centre", "Ticket support", "Community"],
    },
  },
];
