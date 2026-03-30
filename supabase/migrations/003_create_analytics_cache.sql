-- Themes (AI-extracted recurring patterns)
create table public.themes (
  id                       uuid default uuid_generate_v4() primary key,
  user_id                  uuid references public.profiles(id) on delete cascade not null,
  label                    text not null,
  description              text,
  conversation_count       int default 0,
  severity                 text default 'medium'
                             check (severity in ('low', 'medium', 'high', 'critical')),
  trend                    text default 'stable'
                             check (trend in ('rising', 'stable', 'falling')),
  example_conversation_ids uuid[] default '{}',
  first_seen_at            timestamptz default now(),
  last_seen_at             timestamptz default now(),
  created_at               timestamptz default now() not null
);

alter table public.themes enable row level security;

create policy "Users can manage own themes"
  on public.themes for all
  using (auth.uid() = user_id);

create index idx_themes_user on public.themes (user_id, conversation_count desc);

-- Analytics cache (precomputed aggregates refreshed on demand)
create table public.analytics_cache (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  cache_key    text not null,
  data         jsonb not null,
  computed_at  timestamptz default now() not null,
  expires_at   timestamptz not null,
  unique (user_id, cache_key)
);

alter table public.analytics_cache enable row level security;

create policy "Users can manage own analytics cache"
  on public.analytics_cache for all
  using (auth.uid() = user_id);

-- Chat messages
create table public.chat_messages (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  session_id  uuid not null,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null,
  sources     jsonb default '[]',
  created_at  timestamptz default now() not null
);

alter table public.chat_messages enable row level security;

create policy "Users can manage own chat messages"
  on public.chat_messages for all
  using (auth.uid() = user_id);

create index idx_chat_messages_session
  on public.chat_messages (user_id, session_id, created_at);
