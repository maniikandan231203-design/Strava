create table public.runs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  distance numeric not null,
  avg_pace text not null,
  moving_time text not null,
  elevation_gain integer not null default 0,
  type text not null default 'Run',
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.runs enable row level security;

-- Create policy to allow all access (since auth is not set up yet)
-- Note: In a production app, you should restrict this to authenticated users
create policy "Enable full access to runs"
  on public.runs
  for all
  using (true)
  with check (true);
