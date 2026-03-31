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
  | "email"
  | "call_transcript"
  | "mixpanel"
  | "other";

export type SentimentLabel = "positive" | "negative" | "neutral";

export type CategoryLabel =
  | "bug"
  | "feature_request"
  | "escalation"
  | "billing"
  | "onboarding"
  | "general"
  | "praise"
  | "churn_signal";

export type BatchStatus =
  | "uploading"
  | "parsing"
  | "sanitizing"
  | "analyzing"
  | "embedding"
  | "extracting_themes"
  | "completed"
  | "failed";

export type PipelineStatus = "raw" | "sanitized" | "analyzed" | "embedded" | "complete" | "failed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      ingestion_batches: {
        Row: {
          id: string;
          user_id: string;
          source: SourceType;
          file_name: string | null;
          status: BatchStatus;
          total_conversations: number;
          processed_count: number;
          error_message: string | null;
          metadata: Json;
          created_at: string;
          completed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["ingestion_batches"]["Row"],
          "id" | "created_at" | "total_conversations" | "processed_count"
        >;
        Update: Partial<Database["public"]["Tables"]["ingestion_batches"]["Insert"]>;
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          batch_id: string | null;
          source: SourceType;
          external_id: string | null;
          raw_text: string;
          sanitized_text: string | null;
          participants: Json;
          conversation_date: string | null;
          word_count: number | null;
          sentiment: SentimentLabel | null;
          sentiment_score: number | null;
          category: CategoryLabel | null;
          category_confidence: number | null;
          summary: string | null;
          themes: string[];
          embedding: number[] | null;
          pipeline_status: PipelineStatus;
          pipeline_error: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["conversations"]["Row"],
          "id" | "created_at" | "updated_at" | "themes" | "participants" | "metadata" | "pipeline_status"
        >;
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
      };
      themes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          conversation_count: number;
          severity: "critical" | "moderate" | "low" | null;
          dominant_sentiment: string | null;
          avg_sentiment_score: number | null;
          sample_conversation_ids: string[];
          sample_summaries: string[];
          first_seen: string | null;
          last_seen: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["themes"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["themes"]["Insert"]>;
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          role: "user" | "assistant";
          content: string;
          query_type: "aggregate" | "search" | "hybrid" | null;
          source_conversation_ids: string[];
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["chat_messages"]["Row"],
          "id" | "created_at" | "source_conversation_ids" | "metadata"
        >;
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
      };
    };
    Functions: {
      get_sentiment_distribution: {
        Args: { p_user_id: string; p_days?: number; p_source?: string };
        Returns: Array<{ sentiment: string; count: number }>;
      };
      get_category_breakdown: {
        Args: { p_user_id: string; p_days?: number };
        Returns: Array<{ category: string; count: number; avg_sentiment: number }>;
      };
      match_conversations: {
        Args: {
          p_user_id: string;
          query_embedding: number[];
          match_threshold?: number;
          match_count?: number;
        };
        Returns: Array<{
          id: string;
          sanitized_text: string | null;
          summary: string | null;
          sentiment: string | null;
          category: string | null;
          conversation_date: string | null;
          similarity: number;
        }>;
      };
    };
  };
}
