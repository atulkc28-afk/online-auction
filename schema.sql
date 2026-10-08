-- ============================================
-- ONLINE AUCTION SYSTEM - Supabase schema
-- Paste this whole file into Supabase > SQL Editor > Run
-- ============================================

-- 1) PRODUCTS
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null default 'Other',
  image_url text,
  seller_name text not null,
  created_at timestamptz not null default now()
);

-- 2) AUCTIONS (one product -> one auction)
create table auctions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  starting_price numeric not null check (starting_price > 0),
  current_price numeric not null check (current_price > 0),
  minimum_increment numeric not null check (minimum_increment > 0),
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'live' check (status in ('live', 'completed')),
  winner_name text,
  check (end_time > start_time)
);

-- 3) BIDS (one auction -> many bids)
create table bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references auctions(id) on delete cascade,
  bidder_name text not null,
  amount numeric not null check (amount > 0),
  created_at timestamptz not null default now()
);

-- ============================================
-- Row Level Security (no login, so policies are open)
-- ============================================
alter table products enable row level security;
alter table auctions enable row level security;
alter table bids enable row level security;

create policy "anyone can read products"  on products for select using (true);
create policy "anyone can add products"   on products for insert with check (true);

create policy "anyone can read auctions"  on auctions for select using (true);
create policy "anyone can add auctions"   on auctions for insert with check (true);
create policy "anyone can update auctions" on auctions for update using (true);

create policy "anyone can read bids"      on bids for select using (true);
create policy "anyone can add bids"       on bids for insert with check (true);

-- ============================================
-- Realtime (live bid updates)
-- ============================================
alter publication supabase_realtime add table auctions;
alter publication supabase_realtime add table bids;

-- ============================================
-- Optional sample data so the site is not empty
-- ============================================
with p as (
  insert into products (name, description, category, image_url, seller_name) values
  ('iPhone 16 Pro', '256GB, Natural Titanium, barely used with box and charger.', 'Electronics', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', 'Rahul'),
  ('Sony Mirrorless Camera', 'Sony Alpha with 28-70mm lens. Great for travel photography.', 'Electronics', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600', 'Vijay'),
  ('Vintage Wrist Watch', 'Classic 1980s mechanical watch in working condition.', 'Collectibles', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', 'Meera')
  returning id, name
)
insert into auctions (product_id, starting_price, current_price, minimum_increment, start_time, end_time)
select id,
  case name when 'iPhone 16 Pro' then 50000 when 'Sony Mirrorless Camera' then 40000 else 15000 end,
  case name when 'iPhone 16 Pro' then 50000 when 'Sony Mirrorless Camera' then 40000 else 15000 end,
  case name when 'iPhone 16 Pro' then 1000 when 'Sony Mirrorless Camera' then 1000 else 500 end,
  now() - interval '1 hour',
  now() + interval '2 days'
from p;
