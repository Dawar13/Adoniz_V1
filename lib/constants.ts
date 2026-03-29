// ─── Nav ──────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Product",      href: "#product" },
  { label: "Features",     href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing",      href: "#pricing" },
];

// ─── Hero ─────────────────────────────────────────────────────────────────
export const HERO_BADGE_TEXT = "The first AI-native VoC platform";

export const HERO_SUBHEADLINE =
  "Adoniz ingests your customer conversations, strips PII automatically, and lets you ask questions in plain English.";

// ─── Device showcase ──────────────────────────────────────────────────────
export const DEVICE_QUOTE =
  "2,000 conversations. One question. Instant clarity.";

// ─── Marquee ──────────────────────────────────────────────────────────────
export const MARQUEE_ITEMS = [
  "Customer Intelligence",
  "Sentiment Analysis",
  "Theme Extraction",
  "PII Sanitization",
  "Conversational Q&A",
  "Smart Categorization",
  "One-Line Summaries",
];

// ─── Integrations (only logos present in /public/logos/) ──────────────────
// Inner ring — 7 logos, ~140px from center
export const INTEGRATIONS_INNER = [
  { name: "Intercom",    file: "Intercom.png" },
  { name: "Slack",       file: "Slack.png" },
  { name: "Gmail",       file: "Gmail.png" },
  { name: "Zendesk",     file: "Zendesk.png" },
  { name: "Mixpanel",    file: "Mixpanel.png" },
  { name: "HubSpot",     file: "Hubspot.png" },
  { name: "Salesforce",  file: "Salesforce.png" },
];

// Outer ring — 7 logos, ~260px from center
export const INTEGRATIONS_OUTER = [
  { name: "Amplitude",   file: "Amplitude.png" },
  { name: "Discord",     file: "Discord.png" },
  { name: "Gorgias",     file: "Gorgias.png" },
  { name: "Jira",        file: "Jira.png" },
  { name: "Linear",      file: "Linear.png" },
  { name: "MS Teams",    file: "ms-teams.png" },
  { name: "Notion",      file: "Notion.png" },
];

// All integrations flat list
export const INTEGRATIONS_ALL = [
  ...INTEGRATIONS_INNER,
  ...INTEGRATIONS_OUTER,
];

// ─── Features ─────────────────────────────────────────────────────────────
export const FEATURES = [
  {
    id: "ingestion",
    overline: "Data Ingestion",
    title: "Multi-Source Ingestion",
    description:
      "Conversations from Intercom, Slack, Gmail, Zendesk, and Mixpanel — or upload CSV, JSON, TXT, PDF directly.",
    span: "col-span-2",
    dark: false,
    logos: [
      { name: "Intercom",   file: "Intercom.png" },
      { name: "Slack",      file: "Slack.png" },
      { name: "Gmail",      file: "Gmail.png" },
      { name: "Zendesk",    file: "Zendesk.png" },
      { name: "Mixpanel",   file: "Mixpanel.png" },
    ],
  },
  {
    id: "pii",
    overline: "Privacy",
    title: "Auto PII Sanitization",
    description:
      "Emails, URLs, names, IDs — stripped automatically before any AI touches your data.",
    span: "col-span-1",
    dark: false,
    muted: true,
  },
  {
    id: "qa",
    overline: "Conversational",
    title: "Ask Your Data",
    description:
      "Natural language questions. Concrete, grounded answers — not graphs.",
    span: "col-span-1 row-span-2",
    dark: true,
  },
  {
    id: "sentiment",
    overline: "Analysis",
    title: "Sentiment Analysis",
    description:
      "Every conversation scored positive, neutral, or negative with confidence. Trend over time.",
    span: "col-span-2",
    dark: false,
  },
  {
    id: "themes",
    overline: "Discovery",
    title: "Theme Extraction",
    description:
      "AI surfaces what customers repeatedly talk about — before you have to look.",
    span: "col-span-1",
    dark: false,
  },
  {
    id: "summaries",
    overline: "Efficiency",
    title: "Smart Summaries",
    description:
      "One-line per conversation. Category-level and time-period summaries too.",
    span: "col-span-1",
    dark: false,
  },
];

// ─── Filter categories ─────────────────────────────────────────────────────
export const FILTER_CATEGORIES = [
  { label: "Error / Bug",       active: true },
  { label: "Feature Request",   active: true },
  { label: "Escalation",        active: false },
  { label: "Billing",           active: false },
];

export const MOCK_CONVERSATIONS = [
  {
    sentiment: "negative",
    category: "Error / Bug",
    summary:
      "Checkout flow breaks on mobile Safari when using Apple Pay — reproducible across 3 accounts.",
  },
  {
    sentiment: "positive",
    category: "Feature Request",
    summary:
      "Requesting bulk export of order history to CSV — needed for accounting integrations.",
  },
  {
    sentiment: "negative",
    category: "Error / Bug",
    summary:
      "Subscription widget shows incorrect renewal date after plan upgrade. Customer charged twice.",
  },
  {
    sentiment: "neutral",
    category: "Feature Request",
    summary:
      "Want the ability to schedule product availability windows — goes live and expires automatically.",
  },
];
