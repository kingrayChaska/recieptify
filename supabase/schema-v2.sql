-- ============================================
-- RECIEPTIFY v2 Schema — Run after schema.sql
-- ============================================

-- Receipts table (Phase 2)
create table if not exists public.receipts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  image_url text,
  merchant_name text,
  amount numeric(12,2),
  currency text not null default 'NGN',
  category text default 'Uncategorized',
  date timestamptz not null default now(),
  raw_text text,
  ocr_confidence numeric(5,2),
  bank_alert_raw text,
  source text default 'upload' check (source in ('upload', 'manual', 'bank_alert', 'api')),
  notes text,
  organization_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.receipts enable row level security;

create policy "Users can view own receipts"
  on public.receipts for select
  using (auth.uid() = user_id);

create policy "Users can insert own receipts"
  on public.receipts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own receipts"
  on public.receipts for update
  using (auth.uid() = user_id);

create policy "Users can delete own receipts"
  on public.receipts for delete
  using (auth.uid() = user_id);

-- Organizations (Phase 6)
do $$
begin
  if to_regclass('public.organizations') is not null then
    if exists (
      select 1
      from pg_constraint
      where conname = 'fk_org_owner'
        and conrelid = 'public.organizations'::regclass
    ) then
      alter table public.organizations drop constraint fk_org_owner;
    end if;
  end if;
end $$;

create table if not exists public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_id uuid not null,
  slug text unique,
  logo_url text,
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;

-- Organization members (Phase 6)
do $$
begin
  if to_regclass('public.organization_members') is not null then
    if exists (
      select 1
      from pg_constraint
      where conname = 'fk_org_member_user'
        and conrelid = 'public.organization_members'::regclass
    ) then
      alter table public.organization_members drop constraint fk_org_member_user;
    end if;

    if exists (
      select 1
      from pg_constraint
      where conname = 'fk_org_member_invited_by'
        and conrelid = 'public.organization_members'::regclass
    ) then
      alter table public.organization_members drop constraint fk_org_member_invited_by;
    end if;
  end if;
end $$;

create table if not exists public.organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  invited_by uuid,
  joined_at timestamptz not null default now(),
  unique(organization_id, user_id)
);

alter table public.organization_members enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'organizations'
      and policyname = 'Members can view their org'
  ) then
    create policy "Members can view their org"
      on public.organizations for select
      using (
        auth.uid() = owner_id or
        auth.uid() in (
          select user_id from public.organization_members where organization_id = id
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'organizations'
      and policyname = 'Owners can update org'
  ) then
    create policy "Owners can update org"
      on public.organizations for update
      using (auth.uid() = owner_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'organizations'
      and policyname = 'Users can create orgs'
  ) then
    create policy "Users can create orgs"
      on public.organizations for insert
      with check (auth.uid() = owner_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'organization_members'
      and policyname = 'Owners and admins can add members'
  ) then
    create policy "Owners and admins can add members"
      on public.organization_members for insert
      with check (
        auth.uid() = user_id
        or auth.uid() in (
          select o.owner_id
          from public.organizations o
          where o.id = organization_id
        )
        or auth.uid() in (
          select om.user_id
          from public.organization_members om
          where om.organization_id = public.organization_members.organization_id
            and om.role in ('owner', 'admin')
        )
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'organization_members'
      and policyname = 'Members can view org members'
  ) then
    create policy "Members can view org members"
      on public.organization_members for select
      using (auth.uid() = user_id or auth.uid() in (
        select user_id from public.organization_members om2
        where om2.organization_id = organization_id
      ));
  end if;
end $$;

-- API Keys (Phase 7)
create table if not exists public.api_keys (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  key_hash text not null unique,
  key_prefix text not null,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.api_keys enable row level security;

create policy "Users can manage own api keys"
  on public.api_keys for all
  using (auth.uid() = user_id);

-- Storage bucket for receipt images
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can upload receipt images'
  ) then
    create policy "Users can upload receipt images"
      on storage.objects for insert
      with check (bucket_id = 'receipts' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can view own receipt images'
  ) then
    create policy "Users can view own receipt images"
      on storage.objects for select
      using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can delete own receipt images'
  ) then
    create policy "Users can delete own receipt images"
      on storage.objects for delete
      using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;
end $$;

-- Updated at trigger for receipts
create trigger set_receipts_updated_at
  before update on public.receipts
  for each row execute procedure public.set_updated_at();
