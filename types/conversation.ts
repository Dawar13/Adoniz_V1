import type { SourceType, SentimentLabel, CategoryLabel } from "./database";

export interface Conversation {
  id: string;
  user_id: string;
  batch_id: string | null;
  raw_text: string;
  sanitized_text: string | null;
  summary: string | null;
  sentiment: SentimentLabel | null;
  sentiment_score: number | null;
  category: CategoryLabel | null;
  tags: string[];
  source: SourceType | null;
  external_id: string | null;
  customer_identifier: string | null;
  occurred_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationFilters {
  sentiment?: SentimentLabel[];
  category?: CategoryLabel[];
  source?: SourceType[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  batchId?: string;
}

export interface PaginatedConversations {
  data: Conversation[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface Batch {
  id: string;
  user_id: string;
  source: SourceType;
  filename: string | null;
  status: "pending" | "processing" | "done" | "error";
  total_conversations: number;
  processed_conversations: number;
  error_message: string | null;
  tags: string[];
  date_from: string | null;
  date_to: string | null;
  created_at: string;
  updated_at: string;
}
