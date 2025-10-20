-- ProofChain Supabase Setup (Consolidated)
-- Run this file in Supabase SQL editor (SQL page) top-to-bottom.
-- Safe to run multiple times; CREATE IF NOT EXISTS used where possible.

-- 1) Extensions
create extension if not exists pgcrypto;
create extension if not exists uuid-ossp;

-- 2) Tables
-- audit_requests
create table if not exists public.audit_requests (
  id uuid primary key default uuid_generate_v4(),
  project_name text not null,
  developer_wallet text not null,
  estimated_completion_date timestamptz,
  status text not null check (status in ('Available','In Progress','Completed','Cancelled')) default 'Available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- smart_contracts (per audit request)
create table if not exists public.smart_contracts (
  id uuid primary key default uuid_generate_v4(),
  audit_request_id uuid references public.audit_requests(id) on delete cascade,
  contract_address text not null,
  contract_type text,
  contract_name text,
  contract_symbol text,
  total_supply numeric,
  decimals integer,
  deployment_hash text,
  explorer_url text,
  created_at timestamptz not null default now()
);

-- audit_owners (auditor accepting jobs)
create table if not exists public.audit_owners (
  id uuid primary key default uuid_generate_v4(),
  audit_request_id uuid references public.audit_requests(id) on delete cascade,
  auditor_name text,
  auditor_wallet text not null,
  status text not null check (status in ('in_progress','completed','cancelled')) default 'in_progress',
  created_at timestamptz not null default now()
);

-- audit_findings (auditor findings)
create table if not exists public.audit_findings (
  id uuid primary key default uuid_generate_v4(),
  audit_request_id uuid references public.audit_requests(id) on delete cascade,
  auditor_wallet text not null,
  title text,
  description text,
  recommendation text,
  finding_category text,
  finding_priority text,
  finding_status text,
  external_references text,
  created_at timestamptz not null default now()
);

-- audit_results (final result + NFT + IPFS)
create table if not exists public.audit_results (
  id uuid primary key default uuid_generate_v4(),
  audit_request_id uuid references public.audit_requests(id) on delete cascade,
  status text not null check (status in ('completed','cancelled')) default 'completed',
  findings_count integer default 0,
  severity_breakdown jsonb,
  completion_date timestamptz default now(),
  evidence_file_hashes text,
  -- NFT fields (client-side mint)
  result_nft_address text,
  result_nft_transaction_hash text,
  result_nft_explorer_url text,
  result_nft_metadata_uri text,
  -- IPFS
  ipfs_hash text,
  created_at timestamptz not null default now()
);

-- 3) Indices
create index if not exists idx_audit_requests_status on public.audit_requests(status);
create index if not exists idx_smart_contracts_audit_request_id on public.smart_contracts(audit_request_id);
create index if not exists idx_audit_owners_audit_request_id on public.audit_owners(audit_request_id);
create index if not exists idx_audit_findings_audit_request_id on public.audit_findings(audit_request_id);
create index if not exists idx_audit_results_audit_request_id on public.audit_results(audit_request_id);
create index if not exists idx_audit_results_created_at on public.audit_results(created_at desc);

-- 4) Triggers (updated_at)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_audit_requests_updated_at on public.audit_requests;
create trigger trg_audit_requests_updated_at
before update on public.audit_requests
for each row execute procedure public.set_updated_at();

-- 5) RLS Policies (example permissive setup; tighten for prod)
alter table public.audit_requests enable row level security;
alter table public.smart_contracts enable row level security;
alter table public.audit_owners enable row level security;
alter table public.audit_findings enable row level security;
alter table public.audit_results enable row level security;

-- Basic read for all (adjust as needed)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'audit_requests' and policyname = 'Allow read all audit_requests'
  ) then
    create policy "Allow read all audit_requests" on public.audit_requests for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'smart_contracts' and policyname = 'Allow read all smart_contracts'
  ) then
    create policy "Allow read all smart_contracts" on public.smart_contracts for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'audit_owners' and policyname = 'Allow read all audit_owners'
  ) then
    create policy "Allow read all audit_owners" on public.audit_owners for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'audit_findings' and policyname = 'Allow insert findings'
  ) then
    create policy "Allow insert findings" on public.audit_findings for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'audit_findings' and policyname = 'Allow read findings'
  ) then
    create policy "Allow read findings" on public.audit_findings for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'audit_results' and policyname = 'Allow read results'
  ) then
    create policy "Allow read results" on public.audit_results for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'audit_results' and policyname = 'Allow insert results'
  ) then
    create policy "Allow insert results" on public.audit_results for insert with check (true);
  end if;
end $$;

-- 6) Seed helpers (optional)
-- insert into public.audit_requests (project_name, developer_wallet) values ('Sample Project', '0xYourWallet');

-- 7) Notes
-- - Owner NFT is not minted on acceptance in current release.
-- - Audit Result NFT is minted client-side; transaction details saved here.
-- - Verification uses audit_results.ipfs_hash to fetch IPFS metadata.
-- - Status casing: audit_requests: 'In Progress'/'Completed'; audit_owners/results: lowercase values.


