# Lot 10 — Unity Foundation

## Objective
Establish the final Unity client foundation without changing the Supabase production backend and without merging the migration prematurely.

## Locked architecture
- Unity = final mobile game client.
- Supabase = authoritative backend.
- GitHub = source control.
- React client = functional/reference prototype during migration.

## Scope of this lot
1. Define Unity project conventions.
2. Define runtime/editor/test boundaries.
3. Define mobile build targets.
4. Define bootstrap and service boundaries.
5. Keep gameplay migration incremental.

## Server trust boundary
Unity never becomes authoritative for balances, rewards, chest RNG, purchases, level completion rewards, or progression writes. Server APIs remain the source of truth.

## Validation policy
Every Unity lot must pass compile/build checks and relevant automated tests before the next gameplay subsystem is migrated. A real device test remains required before release claims.

## CI note
Unity supports command-line/batch execution suitable for automated testing and builds. CI integration will be added only after the local Unity project foundation is established and the required free Unity tooling/licensing flow is confirmed.

## Release gates
- No production backend changes from this lot.
- No billing activation.
- No character-chest activation.
- No claim that mobile builds are release-ready until device validation exists.
