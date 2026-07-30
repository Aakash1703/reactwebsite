-- Run this in Supabase Dashboard > SQL Editor

create table public.books (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  author_id bigint not null references public.authors (id),
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

-- Anyone (including the anon key used by the frontend) can read books.
create policy "Public can read books"
  on public.books
  for select
  to anon
  using (true);

-- Anyone (including the anon key used by the frontend) can add books.
-- NOTE: this form has no login/auth, so anyone with the site URL can insert.
-- Tighten this policy (e.g. require auth.uid()) once you add authentication.
create policy "Public can insert books"
  on public.books
  for insert
  to anon
  with check (true);

-- Anyone (including the anon key used by the frontend) can edit books.
-- Same caveat as insert above: no auth means anyone can update any row.
create policy "Public can update books"
  on public.books
  for update
  to anon
  using (true)
  with check (true);

-- Anyone (including the anon key used by the frontend) can delete books.
-- Same caveat as insert above: no auth means anyone can delete any row.
create policy "Public can delete books"
  on public.books
  for delete
  to anon
  using (true);


-- STEP 2 (run later, once main.py's /books endpoints are live): book writes
-- now go through the FastAPI backend (which uses the secret service-role key
-- and requires a valid login JWT), the same way /register and /login already
-- handle the users/sessions tables. Drop the anon write policies above so the
-- anon key -- still used by the frontend for reads -- can no longer insert,
-- update, or delete rows directly. Select stays public.
drop policy if exists "Public can insert books" on public.books;
drop policy if exists "Public can update books" on public.books;
drop policy if exists "Public can delete books" on public.books;
