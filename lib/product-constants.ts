import type { CategoryLabel, SentimentLabel, SourceType } from "@/types/database";

export const CATEGORY_LABELS: Record<CategoryLabel, string> = {
  error_bug: "Error / Bug",
  feature_request: "Feature Request",
  escalation: "Escalation",
  billing: "Billing",
  onboarding: "Onboarding",
  praise: "Praise",
  general: "General",
  other: "Other",
};

export const SENTIMENT_LABELS: Record<SentimentLabel, string> = {
  positive: "Positive",
  negative: "Negative",
  neutral: "Neutral",
};

export const SENTIMENT_COLORS: Record<SentimentLabel, { dot: string; bg: string; text: string }> = {
  positive: { dot: "#22C55E", bg: "rgba(34,197,94,0.1)", text: "#16A34A" },
  negative: { dot: "#EF4444", bg: "rgba(239,68,68,0.1)", text: "#DC2626" },
  neutral: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#D97706" },
};

export const SOURCE_LABELS: Record<SourceType, string> = {
  intercom: "Intercom",
  slack: "Slack",
  gmail: "Gmail",
  zendesk: "Zendesk",
  gorgias: "Gorgias",
  hubspot: "HubSpot",
  salesforce: "Salesforce",
  csv: "CSV Upload",
  json: "JSON Upload",
  text: "Text Upload",
  pdf: "PDF Upload",
  api: "API",
};

export const SUGGESTED_QUERIES = [
  "What are the most common complaints this week?",
  "Show me all escalations from the past 30 days",
  "What features are users requesting most?",
  "Summarize the billing issues",
  "Which conversations have the most negative sentiment?",
  "What onboarding problems are users facing?",
  "Find conversations about performance issues",
  "What are users praising about the product?",
];

export const CATEGORY_COLORS: Record<CategoryLabel, string> = {
  error_bug: "#EF4444",
  feature_request: "#6366F1",
  escalation: "#F97316",
  billing: "#EAB308",
  onboarding: "#3B82F6",
  praise: "#22C55E",
  general: "#8B5CF6",
  other: "#6B7280",
};
