create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  config jsonb not null,
  transcript jsonb default '[]',
  feedback jsonb default null,
  duration_seconds integer default 0,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.sessions enable row level security;

create policy "Users can view own sessions"
  on sessions for select using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on sessions for insert with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on sessions for update using (auth.uid() = user_id);

create index sessions_user_id_idx on sessions(user_id);
create index sessions_created_at_idx on sessions(created_at desc);
