export type Source = 'intercom' | 'slack' | 'email' | 'call_transcript' | 'mixpanel' | 'other'

export type Sentiment = 'positive' | 'neutral' | 'negative'

export type Category =
  | 'bug'
  | 'feature_request'
  | 'escalation'
  | 'billing'
  | 'onboarding'
  | 'general'
  | 'praise'
  | 'churn_signal'

export type PipelineStatus = 'raw' | 'sanitized' | 'analyzed' | 'embedded' | 'complete' | 'failed'

export type BatchStatus =
  | 'uploading'
  | 'parsing'
  | 'sanitizing'
  | 'analyzing'
  | 'embedding'
  | 'extracting_themes'
  | 'completed'
  | 'failed'

export interface ParsedConversation {
  raw_text: string
  external_id?: string
  participants?: { role: string; name: string }[]
  conversation_date?: string
}

export interface ConversationRow {
  id: string
  user_id: string
  batch_id: string
  source: Source
  external_id?: string
  raw_text: string
  sanitized_text?: string
  participants: { role: string; name: string }[]
  conversation_date?: string
  word_count?: number
  sentiment?: Sentiment
  sentiment_score?: number
  category?: Category
  category_confidence?: number
  summary?: string
  themes: string[]
  pipeline_status: PipelineStatus
  pipeline_error?: string
  created_at: string
  updated_at: string
}

export interface BatchRow {
  id: string
  user_id: string
  source: Source
  file_name?: string
  status: BatchStatus
  total_conversations: number
  processed_count: number
  error_message?: string
  metadata: Record<string, unknown>
  created_at: string
  completed_at?: string
}
