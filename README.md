# Online Auction System (Auction Hub)

React + Vite + Supabase. No login, 6 pages: Home, Auctions, Auction Details, Sell, My Auctions, My Bids.

## Setup (4 steps)

1. **Create a Supabase project** at https://supabase.com (free plan is fine).
2. **Create the tables:** Supabase dashboard > SQL Editor > New query > paste everything from `schema.sql` > Run.
   This creates `products`, `auctions`, `bids`, turns on RLS and Realtime, and adds 3 sample auctions.
3. **Add your keys:** copy `.env.example` to `.env`, then fill in:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Both are in Supabase > Project Settings > API (use the *anon public* key).
4. **Run it:**
   ```
   npm install
   npm run dev
   ```
   Open the URL shown (usually http://localhost:5173).

## Test realtime
Open an auction in two browser windows. Place a bid in one; the other updates without refreshing.

## Notes
- Names are typed in (no login), so "My Auctions" / "My Bids" just search by the name you enter.
- An auction is marked completed (winner saved) when someone opens it after the end time.
