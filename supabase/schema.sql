-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Documents table
create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('invoice', 'receipt')),
  data jsonb not null default '{}',
  logo_url text,
  share_token text unique,
  template text not null default 'modern' check (template in ('minimal', 'modern', 'classic')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS Policies
alter table public.documents enable row level security;

create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update own documents"
  on public.documents for update
  using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

-- Allow public access to shared documents via share_token
create policy "Public can view shared documents"
  on public.documents for select
  using (share_token is not null);

-- Profiles table (extended user info)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  business_name text,
  theme_color text default '#22c55e',
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_documents_updated_at
  before update on public.documents
  for each row execute procedure public.set_updated_at();

-- Storage bucket for logos
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict do nothing;

create policy "Authenticated users can upload logos"
  on storage.objects for insert
  with check (bucket_id = 'logos' and auth.role() = 'authenticated');

create policy "Public can view logos"
  on storage.objects for select
  using (bucket_id = 'logos');

create policy "Users can delete own logos"
  on storage.objects for delete
  using (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);
