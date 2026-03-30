export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ConversationSource[];
  created_at: string;
}

export interface ConversationSource {
  id: string;
  summary: string | null;
  sentiment: string | null;
  category: string | null;
  occurred_at: string | null;
  similarity?: number;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
}

export type QueryType = "aggregate" | "search" | "hybrid";

export interface ChatRequest {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  message: string;
  sources: ConversationSource[];
  query_type: QueryType;
}
