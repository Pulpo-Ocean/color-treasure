# Lot 09 — Rewards & Chests

## Trust boundary
The client requests a chest opening with only `chest_code` and a unique `claim_key`. Reward type, amount, weight, balance and ledger data are selected and written by the server.

## Current server flow
`client -> rewards-v1 -> private.open_chest_server() -> reward_claims + inventory + ledger`

The operation is replay-safe: an existing `(user_id, claim_type=chest, claim_key)` returns the original reward without issuing a second grant.

## Current catalog
- `basic_chest`
- `premium_chest`
- `character_chest` (catalogued; character-specific reward pool remains a dedicated follow-up)

## Release gates
- Provider billing remains disabled until real Apple/Google verification exists.
- Character chest must receive a dedicated character/fragment pool before production use.
- Reward and chest catalogs are server-side and versioned.
