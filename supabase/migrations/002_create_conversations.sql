-- Enum types
create type public.source_type as enum (
  'intercom', 'slack', 'gmail', 'zendesk', 'gorgias',
  'hubspot', 'salesforce', 'csv', 'json', 'text', 'pdf', 'api'
);

create type public.sentiment_label as enum ('positive', 'negative', 'neutral');

create type public.category_label as enum (
  'error_bug', 'feature_request', 'escalation', 'billing',
  'onboarding', 'praise', 'general', 'other'
);

-- Batches (groups of uploaded conversations)
create table public.batches (
  id                       uuid default uuid_generate_v4() primary key,
  user_id                  uuid references public.profiles(id) on delete cascade not null,
  source                   source_type not null,
  filename                 text,
  status                   text default 'pending'
                             check (status in ('pending', 'processing', 'done', 'error')),
  total_conversations      int default 0,
  processed_conversations  int default 0,
  error_message            text,
  tags                     text[] default '{}',
  date_from                date,
  date_to                  date,
  created_at               timestamptz default now() not null,
  updated_at               timestamptz default now() not null
);

alter table public.batches enable row level security;

create policy "Users can manage own batches"
  on public.batches for all
  using (auth.uid() = user_id);

create trigger set_batches_updated_at
  before update on public.batches
  for each row execute procedure public.set_updated_at();

-- Conversations
create table public.conversations (
  id                   uuid default uuid_generate_v4() primary key,
  user_id              uuid references public.profiles(id) on delete cascade not null,
  batch_id             uuid references public.batches(id) on delete set null,

  -- Content
  raw_text             text not null,
  sanitized_text       text,

  -- AI analysis outputs
  summary              text,
  sentiment            sentiment_label,
  sentiment_score      float check (sentiment_score between -1 and 1),
  category             category_label,
  tags                 text[] default '{}',

  -- Provenance
  source               source_type,
  external_id          text,           -- original ID from source system
  customer_identifier  text,           -- anonymised customer ref
  occurred_at          timestamptz,    -- when the conversation happened

  -- Vector embedding (populated by /api/process)
  embedding            vector(1536),

  created_at           timestamptz default now() not null,
  updated_at           timestamptz default now() not null
);

alter table public.conversations enable row level security;

create policy "Users can manage own conversations"
  on public.conversations for all
  using (auth.uid() = user_id);

create trigger set_conversations_updated_at
  before update on public.conversations
  for each row execute procedure public.set_updated_at();

-- Performance indexes
create index idx_conversations_user_time
  on public.conversations (user_id, created_at desc);
create index idx_conversations_user_sentiment
  on public.conversations (user_id, sentiment);
create index idx_conversations_user_category
  on public.conversations (user_id, category);
create index idx_conversations_batch
  on public.conversations (batch_id);
