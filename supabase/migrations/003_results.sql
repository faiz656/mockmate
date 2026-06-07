-- Question bank
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  type text check (type in ('technical', 'behavioral', 'pressure', 'pakistan_context', 'icebreaker')),
  role text not null,
  experience text not null,
  content text not null,
  company_type text default 'any',
  created_at timestamp with time zone default timezone('utc', now())
);

-- Public read access for question bank
alter table public.questions enable row level security;
create policy "Anyone can read questions"
  on questions for select using (true);

create index questions_role_exp_idx on questions(role, experience);
