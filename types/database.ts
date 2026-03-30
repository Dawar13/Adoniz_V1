export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SourceType =
  | "intercom"
  | "slack"
  | "gmail"
  | "zendesk"
  | "gorgias"
  | "hubspot"
  | "salesforce"
  | "csv"
  | "json"
  | "text"
  | "pdf"
  | "api";

export type SentimentLabel = "positive" | "negative" | "neutral";

export type CategoryLabel =
  | "error_bug"
  | "feature_request"
  | "escalation"
  | "billing"
  | "onboarding"
  | "praise"
  | "general"
  | "other";

export type BatchStatus = "pending" | "processing" | "done" | "error";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          org_name: string | null;
          plan: "free" | "pro" | "enterprise";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      batches: {
        Row: {
          id: string;
          user_id: string;
          source: SourceType;
          filename: string | null;
          status: BatchStatus;
          total_conversations: number;
          processed_conversations: number;
          error_message: string | null;
          tags: string[];
          date_from: string | null;
          date_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["batches"]["Row"],
          "id" | "created_at" | "updated_at" | "total_conversations" | "processed_conversations"
        >;
        Update: Partial<Database["public"]["Tables"]["batches"]["Insert"]>;
      };
      conversations: {
        Row: {
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
          embedding: number[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["conversations"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
      };
      themes: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          description: string | null;
          conversation_count: number;
          severity: "low" | "medium" | "high" | "critical";
          trend: "rising" | "stable" | "falling";
          example_conversation_ids: string[];
          first_seen_at: string;
          last_seen_at: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["themes"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["themes"]["Insert"]>;
      };
      analytics_cache: {
        Row: {
          id: string;
          user_id: string;
          cache_key: string;
          data: Json;
          computed_at: string;
          expires_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["analytics_cache"]["Row"],
          "id" | "computed_at"
        >;
        Update: Partial<Database["public"]["Tables"]["analytics_cache"]["Insert"]>;
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          role: "user" | "assistant";
          content: string;
          sources: Json;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["chat_messages"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
      };
    };
    Functions: {
      match_conversations: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
          filter_user_id: string;
        };
        Returns: Array<{
          id: string;
          sanitized_text: string | null;
          summary: string | null;
          sentiment: SentimentLabel | null;
          category: CategoryLabel | null;
          occurred_at: string | null;
          similarity: number;
        }>;
      };
    };
  };
}
