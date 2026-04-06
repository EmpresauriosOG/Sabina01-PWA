# Agent Work Queue

This queue is optimized for parallel agent execution with minimal overlap.
Each lane assumes capability-first ownership and strict boundary discipline.
Current sprint rule: contract safety first (API envelope compatibility) before deeper feature refactors.

## Contract-First Packets (Priority 0)

### Shared Contract Layer (all lanes consume)
- Packet CF0: create and adopt `src/shared/contracts/api.ts` as the only response-shape parsing boundary.
- Packet CF1: migrate core hooks/utils to compatibility parsing (`envelope` + `legacy`) with stable UI-facing return shapes.

### Owner split for contract-first pass
- Mau (A + D): `getMenu`, guest-menu + smartorder parse paths, auth remains HOLD.
- Ian (C): orders/tickets/tables response + websocket parser (`ping` ignored, update payload validated).
- Oscar (B + E): inventory/staff/kpis list parsing + pagination/meta normalization.

### Contract-first completion criteria
- No direct `response.data.<domainKey>` parsing in UI containers/components.
- All touched endpoints parse via shared contract helpers.
- Compatibility mode supports both legacy shape and envelope shape.
- Any unresolved endpoint ambiguity is tracked as BR item in `06-backend-integration/01-open-questions.md`.

### Contract-first live status (2026-04-05)
- CF0: `DONE`
- CF1: `IN_PROGRESS` (core hooks/utils migrated; remaining capability edge-cases continue per lane)

## Workstream Lanes

| Lane | Primary Capability Ownership | Dependencies | Suggested Sequence |
|---|---|---|---|
| A | auth-access + platform-shared | none | start first |
| B | inventory-menu-mgmt + staff + kpis | auth user context stable | start after lane A kickoff |
| C | tables-tickets + orders | auth user context stable | start after lane A kickoff |
| D | guest-menu + smartorder-ai | auth + order payload contracts | start after lane A and C baseline |
| E | legacy-orphans | none | run in parallel with all lanes |

## Capability Work Packets

### auth-access
- Packet A1: unify auth provider boundary.
- Packet A2: centralize route and sidebar role policy map.
- Packet A3: normalize user-profile hydration and sign-out behavior.

### platform-shared
- Packet A4: clarify `/sidebar` route role (keep or retire).
- Packet A5: separate shared primitives from domain logic.

### inventory-menu-mgmt
- Packet B1: split dish modal into composable sections.
- Packet B2: unify menu mutation APIs.
- Packet B3: replace global submit flags with query invalidation.

### staff
- Packet B4: isolate staff service and table mutation side-effects.

### kpis
- Packet B5: normalize KPI hook transport and response mapping.

### tables-tickets
- Packet C1: remove duplicate table transport module.
- Packet C2: implement close-ticket path from table UI.
- Packet C3: tighten table mutation argument contract.

### orders
- Packet C4: add websocket reconcile strategy and status transition policy.
- Packet C5: align shared order upload payload strategy.

### guest-menu
- Packet D1: split `Menu.tsx` monolith.
- Packet D2: wire route params for tenant context.
- Packet D3: extract chat adapter and remove invalid URL path.

### smartorder-ai
- Packet D4: remove hardcoded IDs and ticket assumptions.
- Packet D5: split chat/cart/catalog orchestration modules.

### legacy-orphans
- Packet E1: apply keep/refactor/archive decisions.
- Packet E2: remove hardcoded credentials and stale imports.

## Definition Of Ready For Any Agent Packet
- Capability owner is named.
- Input files and output files are listed.
- Contract and acceptance criteria are copied from capability doc.
- Dependencies and merge conflict risks are noted.

## Definition Of Done For Any Agent Packet
- All acceptance criteria in target capability doc are met.
- Lint and type checks pass for touched files.
- No new hardcoded secrets, IDs, or endpoint hosts introduced.
- Changes update corresponding architecture docs if boundaries shifted.

## Coordination Rules
- Do not modify another lane's ownership files without explicit handoff.
- If shared file edits are unavoidable, declare expected conflict in advance.
- Keep each packet small enough for review in one PR.

## Suggested First Sprint Cut
1. CF0 + CF1 (shared contract helpers + first migration wave)
2. C1 + C2 (table-ticket integrity) after contract adapters are merged
3. D4 (smart-order hardcoded value removal) with contract-safe submit path
4. B3 (form submission signal cleanup) and pagination normalization
5. A1 + A2 + E2 (auth stabilization and secret removal) after BR-011/012/013 clarity
