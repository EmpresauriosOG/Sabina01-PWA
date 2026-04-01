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

### Day 3: P0 Checkpoint
- Verify no hardcoded secrets/IDs in touched files.
- Verify auth direction and route protection decisions are converging.
- Confirm no unresolved critical blockers without request IDs.

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
