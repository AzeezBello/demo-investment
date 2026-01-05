-- Base schema for Demo Investment (Supabase/Postgres)
-- Creates all tables referenced in the application plus RLS policies.

-- Extensions
create extension if not exists "pgcrypto";

-- Generic trigger to maintain updated_at columns
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Core user profile information (mirrors auth.users id)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  username text unique,
  btc_address text,
  wallet_address text,
  role text not null default 'user' check (role in ('user', 'admin')),
  suspended boolean not null default false,
  balance numeric(14,2) not null default 0,
  total_deposits numeric(14,2) not null default 0,
  total_withdrawals numeric(14,2) not null default 0,
  earnings numeric(14,2) not null default 0,
  secret_question text,
  secret_answer text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Keep wallet_address in sync when only btc_address is provided
create or replace function public.sync_wallet_address()
returns trigger
language plpgsql
as $$
begin
  if new.wallet_address is null then
    new.wallet_address = new.btc_address;
  end if;
  return new;
end;
$$;

create trigger sync_wallet_address_before_write
before insert or update on public.profiles
for each row execute function public.sync_wallet_address();

-- Helper to gate admin-only policies
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.suspended = false
  );
$$;

-- Investment plans configured by admins
create table if not exists public.investment_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  roi numeric(6,2) not null,
  duration integer not null,
  min_amount numeric(14,2) not null,
  created_at timestamptz not null default timezone('utc', now())
);

-- User investments into a plan
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid references public.investment_plans(id) on delete set null,
  amount numeric(14,2) not null check (amount > 0),
  roi numeric(6,2),
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now())
);

-- Stamp ROI from the plan when not provided
create or replace function public.set_investment_roi()
returns trigger
language plpgsql
as $$
begin
  if new.roi is null then
    select ip.roi into new.roi from public.investment_plans ip where ip.id = new.plan_id;
  end if;
  return new;
end;
$$;

create trigger set_investment_roi_before_insert
before insert on public.investments
for each row execute function public.set_investment_roi();

-- Deposits submitted by users and approved by admins
create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  currency text not null default 'Bitcoin',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  transaction_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  approved_at timestamptz
);

-- Withdrawals requested by users and processed by admins
create table if not exists public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  currency text not null default 'Bitcoin',
  wallet_address text,
  status text not null default 'processing' check (status in ('processing', 'pending', 'approved', 'rejected')),
  created_at timestamptz not null default timezone('utc', now()),
  processed_at timestamptz
);

-- Support tickets opened by users
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default timezone('utc', now())
);

-- In-app notifications for users
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

-- Indexes for common access patterns
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(role);

create index if not exists idx_investments_user on public.investments(user_id);
create index if not exists idx_investments_plan on public.investments(plan_id);
create index if not exists idx_investments_created_at on public.investments(created_at);

create index if not exists idx_investment_plans_created_at on public.investment_plans(created_at);

create index if not exists idx_deposits_user on public.deposits(user_id);
create index if not exists idx_deposits_status on public.deposits(status);
create index if not exists idx_deposits_created_at on public.deposits(created_at);
create index if not exists idx_deposits_txn on public.deposits(transaction_id);

create index if not exists idx_withdrawals_user on public.withdrawals(user_id);
create index if not exists idx_withdrawals_status on public.withdrawals(status);
create index if not exists idx_withdrawals_created_at on public.withdrawals(created_at);

create index if not exists idx_support_tickets_user on public.support_tickets(user_id);
create index if not exists idx_support_tickets_status on public.support_tickets(status);
create index if not exists idx_support_tickets_created_at on public.support_tickets(created_at);

create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);
create index if not exists idx_notifications_created_at on public.notifications(created_at);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.investment_plans enable row level security;
alter table public.investments enable row level security;
alter table public.deposits enable row level security;
alter table public.withdrawals enable row level security;
alter table public.support_tickets enable row level security;
alter table public.notifications enable row level security;

-- Profiles: self-access plus admins
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy profiles_insert on public.profiles
  for insert with check (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
create policy profiles_delete on public.profiles
  for delete using (public.is_admin());

-- Investment plans: anyone authenticated can read, only admins mutate
create policy investment_plans_select on public.investment_plans
  for select using (auth.role() = 'authenticated' or public.is_admin());
create policy investment_plans_insert on public.investment_plans
  for insert with check (public.is_admin());
create policy investment_plans_update on public.investment_plans
  for update using (public.is_admin()) with check (public.is_admin());
create policy investment_plans_delete on public.investment_plans
  for delete using (public.is_admin());

-- Investments: owners can read/insert, admins can manage
create policy investments_select on public.investments
  for select using (user_id = auth.uid() or public.is_admin());
create policy investments_insert on public.investments
  for insert with check (user_id = auth.uid() or public.is_admin());
create policy investments_update on public.investments
  for update using (public.is_admin()) with check (public.is_admin());
create policy investments_delete on public.investments
  for delete using (public.is_admin());

-- Deposits: owners can create/read, admins approve
create policy deposits_select on public.deposits
  for select using (user_id = auth.uid() or public.is_admin());
create policy deposits_insert on public.deposits
  for insert with check (user_id = auth.uid() or public.is_admin());
create policy deposits_update on public.deposits
  for update using (public.is_admin()) with check (public.is_admin());
create policy deposits_delete on public.deposits
  for delete using (public.is_admin());

-- Withdrawals: owners can create/read, admins process
create policy withdrawals_select on public.withdrawals
  for select using (user_id = auth.uid() or public.is_admin());
create policy withdrawals_insert on public.withdrawals
  for insert with check (user_id = auth.uid() or public.is_admin());
create policy withdrawals_update on public.withdrawals
  for update using (public.is_admin()) with check (public.is_admin());
create policy withdrawals_delete on public.withdrawals
  for delete using (public.is_admin());

-- Support tickets: owners and admins
create policy support_tickets_select on public.support_tickets
  for select using (user_id = auth.uid() or public.is_admin());
create policy support_tickets_insert on public.support_tickets
  for insert with check (user_id = auth.uid() or public.is_admin());
create policy support_tickets_update on public.support_tickets
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy support_tickets_delete on public.support_tickets
  for delete using (public.is_admin());

-- Notifications: owners can read/update, admins can broadcast/manage
create policy notifications_select on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());
create policy notifications_insert on public.notifications
  for insert with check (user_id = auth.uid() or public.is_admin());
create policy notifications_update on public.notifications
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy notifications_delete on public.notifications
  for delete using (public.is_admin());
