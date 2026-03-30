-- Enable pgvector
create extension if not exists vector;

-- IVFFlat index for approximate nearest-neighbour search
-- (run AFTER data is loaded — requires at least a few hundred rows to be effective)
create index idx_conversations_embedding
  on public.conversations using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Similarity search function used by the RAG pipeline
create or replace function match_conversations(
  query_embedding  vector(1536),
  match_threshold  float,
  match_count      int,
  filter_user_id   uuid
)
returns table (
  id               uuid,
  sanitized_text   text,
  summary          text,
  sentiment        sentiment_label,
  category         category_label,
  occurred_at      timestamptz,
  similarity       float
)
language sql stable
as $$
  select
    id,
    sanitized_text,
    summary,
    sentiment,
    category,
    occurred_at,
    1 - (embedding <=> query_embedding) as similarity
  from public.conversations
  where
    user_id = filter_user_id
    and embedding is not null
    and 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
