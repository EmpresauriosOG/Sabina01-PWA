# TEAM 3P PLAYBOOK

Date baseline: 2026-04-01
Sprint length: 2 weeks (10 working days)
Team: Mau, Ian, Oscar
Architecture mode: capability-first

## Purpose
This file is the single coordination source for the 3-person execution plan.
Use this together with:
- `docs/architecture/00-system-map.md`
- `docs/architecture/01-capabilities/*.md`
- `docs/architecture/04-agent-work-queue.md`
- `docs/architecture/03-quality/codebase-health.md`

## Ownership And Lanes

| Person | Lane | Capability Ownership | Priority |
|---|---|---|---|
| Mau | A + D | auth-access, platform-shared, guest-menu, smartorder-ai | Highest complexity |
| Ian | C | tables-tickets, orders | Realtime and contract integrity |
| Oscar | B + E | inventory-menu-mgmt, staff, kpis, legacy-orphans | Data-domain and cleanup stability |

## Sprint Cadence (2 Weeks)

### Day 1: Kickoff And Dependency Lock
- Review ownership and file boundaries.
- Confirm backend request table ownership and due dates.
- Freeze lane scope for Sprint 1.
- Start contract-first implementation packet (`CF0`, `CF1`) before deeper capability refactors.

### Day 3: P0 Checkpoint
- Verify no hardcoded secrets/IDs in touched files.
- Verify auth direction and route protection decisions are converging.
- Confirm no unresolved critical blockers without request IDs.
- Confirm shared contract parser adoption in touched lanes (no direct UI parsing).

### Day 5: Mid-sprint Integration Checkpoint
- Merge lane branches into integration branch (or equivalent integration flow).
- Run lane smoke checks and cross-lane route checks.
- Resolve shared-file conflicts with explicit owner tie-break.

### Day 8: Merge Freeze For Stabilization
- Stop new scope.
- Focus on bugfixes, lint/type/build stability, and regression checks.

### Day 10: Release Gate
- Validate release checklist.
- Record unresolved items with owner and target date.

## Shared Quality Gates (Mandatory)
- No hardcoded IDs, ticket IDs, tenant IDs, hosts, or secrets in runtime code.
- No cross-lane file edits without handoff note and approval in PR description.
- Lint and build must pass for touched areas before merge.
- If capability boundaries shift, update corresponding `docs/architecture/01-capabilities/*.md`.
- No TODO placeholders in critical runtime paths (auth, orders, ticket lifecycle).
- All backend payload parsing must go through `src/shared/contracts/api.ts` (or successor contract adapter).

## Contract-First Execution Policy
- Allowed immediately:
  - compatibility parser scaffolding (`ApiEnvelope` + legacy fallback)
  - websocket ping-safe parsing
  - UI-preserving return-shape normalization in hooks/utils
- Still blocked until BR answers:
  - auth strategy migration
  - endpoint protection assumptions
  - irreversible endpoint-specific payload cuts with no compatibility fallback
- Rule: endpoint migration can proceed only if the lane keeps backward-compatible parsing and links unresolved ambiguity to a BR request.

## Current Check Status (2026-04-05)
- [x] `CF0` shared contract parser created (`src/shared/contracts/api.ts`).
- [x] `CF1` first migration wave applied on core hooks/utils and websocket ping handling.
- [x] Local lint passes.
- [x] Local build passes.
- [ ] BR-015/BR-016/BR-021 confirmed by backend (still OPEN).
- [ ] Node runtime aligned to `20.19+` in all CI environments.

## Merge-Conflict Avoidance Matrix

| Shared Risk File | Primary Owner | Secondary Owner | Rule |
|---|---|---|---|
| `src/main.tsx` | Mau | Ian | Mau approves final route/provider merge |
| `src/hooks/tanstack/getMenu.ts` | Mau | Oscar | Mau controls API-shape changes |
| `src/utils/orderUtils.ts` | Ian | Mau | Ian controls status/ticket payload integrity |
| `src/shared/state/userState.ts` | Mau | Oscar | Mau controls auth/session contract |

## Backend And Data Requests (Blocker Tracker)

Use this table for all external dependencies.
Status values: `OPEN`, `IN_PROGRESS`, `ANSWERED`, `WAIVED`.

| request_id | domain | request | owner | needed_by_day | blocking_capability | impact_if_missing | status |
|---|---|---|---|---|---|---|---|
| BR-001 | Auth | Final runtime auth provider decision (Clerk only? migration path?) and role schema contract | Mau | Day 2 | auth-access | route protection and role policy cannot finalize | OPEN |
| BR-002 | User | User profile payload contract (`restaurant_id`, `location_id`, `roles`) with examples | Mau | Day 2 | auth-access, platform-shared | session hydration may drift | OPEN |
| BR-003 | Menu | Endpoint request/response examples for menu read/create/update/delete | Oscar | Day 3 | inventory-menu-mgmt, guest-menu, smartorder-ai | menu refactor may break payload mapping | OPEN |
| BR-004 | Orders | Order upload and status transition contract (required fields, allowed statuses) | Ian | Day 3 | orders, smartorder-ai | order flow and board consistency blocked | OPEN |
| BR-005 | Tickets | Ticket lifecycle invariants: create/close rules, required link to table/order | Ian | Day 3 | tables-tickets, orders | close/create flow remains partial | OPEN |
| BR-006 | Tables | Table/space mutation contract (`space_id` vs `space_name`) and delete semantics | Ian | Day 3 | tables-tickets | risk of destructive wrong-target mutation | OPEN |
| BR-007 | Realtime | WebSocket event schema for orders stream (event types, payload fields, ordering) | Ian | Day 4 | orders | websocket reconciliation unstable | OPEN |
| BR-008 | AI | AI recommendation endpoint contract for smart-order and guest menu (request, response, errors) | Mau | Day 4 | smartorder-ai, guest-menu | chat flow cannot be stabilized | OPEN |
| BR-009 | KPI | KPI endpoint schemas and location/tenant filtering rules | Oscar | Day 4 | kpis | chart normalization may drift | OPEN |
| BR-010 | DB | Schema excerpts for user/menu/ingredient/order/ticket/table entities | Oscar | Day 5 | all lanes | test fixtures and data contracts remain weak | OPEN |
| BR-011 | Auth | Final auth strategy decision by env (Clerk token verification vs custom JWT vs hybrid) + timeline | Mau | Day 2 | auth-access | cannot migrate auth safely | OPEN |
| BR-012 | Auth | Runtime status matrix for `/auth/login` and `/auth/register` (dev/staging/prod) | Mau | Day 2 | auth-access | prevents incorrect feature toggle behavior | OPEN |
| BR-013 | Auth | Exact `/auth/login` contract: request, success payload, token fields, error examples | Mau | Day 3 | auth-access, platform-shared | frontend cannot design stable auth adapter | OPEN |
| BR-014 | Security | Authoritative protected endpoint matrix for **current runtime now** | Mau | Day 2 | all lanes | ambiguity on what requires auth | OPEN |
| BR-015 | API Envelope | Confirm wrapper consistency `{ success, data, message, errors, meta }` and list exceptions | Oscar | Day 3 | B, C, D lanes | parsers may break on inconsistent shapes | OPEN |
| BR-016 | Pagination | Confirm pagination semantics (default sort/order, max limit, out-of-range behavior, exact `meta`) | Oscar | Day 3 | B, C, D lanes | list UIs cannot paginate predictably | OPEN |
| BR-017 | WebSocket | Confirm current websocket auth requirement and canonical URL format | Ian | Day 3 | orders | connection/auth behavior unclear | OPEN |
| BR-018 | WebSocket | Provide full websocket event schema (`ping`, order updates, reconnect/backfill expectations) | Ian | Day 4 | orders | parser and reconciliation unstable | OPEN |
| BR-019 | OTP | Exact OTP expiry contracts for both verification endpoints, including error code/body localization guarantees | Mau | Day 4 | guest-menu, legacy-orphans | OTP UX branch may mismatch backend | OPEN |
| BR-020 | Tables | Final `get-non-active-tables` method/path + request and response schema + compat window | Ian | Day 4 | tables-tickets | table parser/request mismatch risk | OPEN |
| BR-021 | Errors | Confirm uniform error model by status code and `errors` population rules | Oscar | Day 4 | all lanes | inconsistent error UX handling | OPEN |
| BR-022 | Rollout | Versioning plan and cutover/coexistence window for old vs new contracts | Mau | Day 5 | all lanes | sequencing and rollout risk | OPEN |
| BR-023 | Artifacts | OpenAPI/Swagger or Postman + sample payloads for menu/orders/tickets/tables/user/ingredients/kpis | Oscar | Day 5 | all lanes | contracts cannot be validated | OPEN |

## Cross-Lane Integration Checks
1. Authenticated user can navigate all protected routes.
2. Table/ticket actions remain consistent with order lifecycle.
3. Guest menu and smart-order do not rely on hardcoded tenant/ticket values.
4. Inventory/staff mutations reflect in UI without manual reload.
5. KPI dashboards read stable normalized shapes under same tenant context.

## Release Gate Checklist (Day 10)
- All `OPEN` blocker requests are either `ANSWERED` or explicitly `WAIVED` with rationale.
- P0 issues from `docs/architecture/03-quality/codebase-health.md` are closed or waived.
- No unresolved merge-risk file conflicts.
- All lanes provide handoff notes and test evidence.
- Notion summary updated in `docs/architecture/05-notion-share-summary.md` if estimates or risk changed.

## Handoff And PR Rules
- One PR per packet when possible.
- PR title format: `<owner>: <packet_id> <short description>`.
- PR description must include:
  - scope
  - files touched
  - tests run
  - blockers/request IDs
  - docs updated

## Decision Tie-Break
- Architecture tie-break: Mau.
- Contract tie-break for orders/tickets/tables: Ian.
- Contract tie-break for inventory/staff/kpis/data mapping: Oscar.
- If unresolved after tie-break, escalate to explicit `WAIVED`/`DEFERRED` decision note in this file.



