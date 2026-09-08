# Color Treasure — Lot 06

## Scope
- Server-read player resources on Home.
- Display Coins, Gems and Lives.
- Keep the full six-resource model available to the client.
- Refresh progression and resources together after a level win.

## Validation
- Branch: `lot-client-06-home-resources`
- Base: `lot-client-05-gameplay-ux`
- Branch comparison before this status file: 5 commits, 5 files changed.
- CI runtime result: pending verification for the current branch.
- Supabase runtime result: not claimed here.

## Rules
- Client never writes inventory balances.
- Missing resource rows render as zero.
- Server/RLS remains authoritative for balances.
