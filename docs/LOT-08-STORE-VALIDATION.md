# Lot 08 — Store validation contract

## Trust boundary
The mobile client may provide only the store/provider proof. It must never provide the Gem quantity, resulting balance, ledger entry, or purchase status.

## Verification lifecycle
- `PENDING`: transaction recorded, no inventory grant.
- `PURCHASED`: provider proof verified; server grants the catalog quantity exactly once.
- `CONSUMED`: already granted; repeat delivery is a no-op.
- `VOIDED` / `REFUNDED`: purchase reconciled and any granted value is handled by the server economy policy.
- `DUPLICATE`: provider transaction belongs to another account or has already been consumed.
- `UNKNOWN`: provider could not be verified; no grant.

## Required invariants
1. Provider transaction identifiers are unique.
2. Product quantity comes from the server catalog, never the client.
3. Inventory and ledger changes are atomic.
4. Replaying the same transaction cannot create additional Gems.
5. Refund/void processing is server-authoritative.
6. Client UI remains disabled until a real Apple/Google receipt verifier is connected.

## Current implementation gate
`purchase-v1` is deployed with JWT protection. This repository client sends a verification request but does not attempt to fabricate a provider receipt. Store-specific receipt validation remains the release gate before enabling purchases.
