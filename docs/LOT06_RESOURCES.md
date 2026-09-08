# Lot 06 — Resources

The client reads the six economy resources from the authenticated player's `inventories` rows using Supabase RLS.

Resources: coins, gems, lives, boosters, stars, fragments.

The client performs no inventory writes. Economy mutations remain server-authoritative.
