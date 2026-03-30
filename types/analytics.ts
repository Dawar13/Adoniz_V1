import type { SentimentLabel, CategoryLabel } from "./database";

export interface SentimentDistribution {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

export interface CategoryBreakdown {
  category: CategoryLabel;
  count: number;
  percentage: number;
  sentiment_breakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface TimelinePoint {
  date: string;          // ISO date string (YYYY-MM-DD)
  total: number;
  positive: number;
  negative: number;
  neutral: number;
}

export interface Theme {
  id: string;
  label: string;
  description: string | null;
  conversation_count: number;
  severity: "low" | "medium" | "high" | "critical";
  trend: "rising" | "stable" | "falling";
  example_conversation_ids: string[];
  first_seen_at: string;
  last_seen_at: string;
}

export interface DashboardStats {
  total_conversations: number;
  positive_percentage: number;
  themes_found: number;
  action_items: number;
  // Deltas vs previous period
  conversations_delta: number;
  positive_delta: number;
  themes_delta: number;
  action_items_delta: number;
}

export interface AnalyticsSummary {
  top_issues: string[];
  top_requests: string[];
  top_praise: string[];
  key_insight: string;
}
