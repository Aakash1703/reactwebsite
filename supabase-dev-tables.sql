-- Dev-only copies of the authors/books/users/sessions tables, kept
-- separate from prod's tables so local development never writes into
-- data production reads. Same Supabase project as prod (rrrfubglobkrbusteewr).
--
-- HOW TO RUN: Supabase Dashboard > SQL Editor. Run each STEP below ONE AT
-- A TIME (select just that step's SQL, click Run, confirm it says
-- "Success" before moving to the next step). Running the whole file at
-- once is what caused the earlier rollback/error.


-- STEP 1: authors_dev table
create table if not exists public.authors_dev (
  id bigint generated always as identity primary key,
  name text not null unique
);


-- STEP 2: books_dev table (references authors_dev, so must run after Step 1)
create table if not exists public.books_dev (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  author_id bigint not null references public.authors_dev (id),
  created_at timestamptz not null default now()
);


-- STEP 3: RLS + public policies on books_dev (mirrors prod's books table --
-- anon key can read/write, since the app has no per-user book ownership yet)
alter table public.books_dev enable row level security;

create policy "Public can read books_dev"
  on public.books_dev
  for select
  to anon
  using (true);

create policy "Public can insert books_dev"
  on public.books_dev
  for insert
  to anon
  with check (true);

create policy "Public can update books_dev"
  on public.books_dev
  for update
  to anon
  using (true)
  with check (true);

create policy "Public can delete books_dev"
  on public.books_dev
  for delete
  to anon
  using (true);


-- STEP 4: users_dev table
create table if not exists public.users_dev (
  id bigint generated always as identity primary key,
  username text not null unique,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);


-- STEP 5: sessions_dev table (references users_dev, so must run after Step 4)
create table if not exists public.sessions_dev (
  id bigint generated always as identity primary key,
  user_id bigint not null references public.users_dev (id) on delete cascade, 
  token text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);


-- STEP 6: lock down users_dev/sessions_dev -- they hold password hashes and
-- session tokens, so RLS is enabled with zero policies. Only the backend's
-- service-role key (which bypasses RLS) can touch them.
alter table public.users_dev enable row level security;
alter table public.sessions_dev enable row level security;


-- STEP 7 (verification): run this last to confirm all four tables exist.
-- Should return 4 rows: authors_dev, books_dev, sessions_dev, users_dev.
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('authors_dev', 'books_dev', 'users_dev', 'sessions_dev')
order by table_name;


-- STEP 8 (run later, once main.py's /books endpoints are live and db-dev has
-- BOOKS_TABLE=books_dev set): book writes now go through the FastAPI backend
-- (secret service-role key + a valid login JWT), same as users_dev/sessions_dev
-- already work. Drop the anon write policies from Step 3 so the anon key --
-- still used by the frontend for reads -- can no longer insert, update, or
-- delete rows directly. Select stays public.
drop policy if exists "Public can insert books_dev" on public.books_dev;
drop policy if exists "Public can update books_dev" on public.books_dev;
drop policy if exists "Public can delete books_dev" on public.books_dev;
