# Frontend Adoption Matrix

Date: 2026-04-05
Purpose: Map backend hardening deltas to ownership, capability impact, and execution state.

Status values:
- `BLOCKED` (waiting on BR answer)
- `READY_TO_SPEC`
- `READY_TO_IMPLEMENT`
- `IN_PROGRESS`
- `DONE`

| backend_change | impacted_capability | owner | related_requests | status | target_sprint_day | notes |
|---|---|---|---|---|---|---|
| Auth strategy / JWT vs Clerk | auth-access, platform-shared | Mau | BR-011, BR-012, BR-013, BR-014, BR-022 | BLOCKED | Day 2-5 | Must not implement auth migration before decision. |
| Standard response wrapper | guest-menu, smartorder-ai | Mau | BR-015, BR-021, BR-023 | IN_PROGRESS | Day 1-3 | Contract adapter rollout started with compatibility fallback. |
| Standard response wrapper | orders, tables-tickets | Ian | BR-015, BR-021, BR-023 | IN_PROGRESS | Day 1-3 | Parser migration started for orders/tickets/tables + websocket. |
| Standard response wrapper | inventory-menu-mgmt, staff, kpis | Oscar | BR-015, BR-021, BR-023 | IN_PROGRESS | Day 1-4 | Shared parser adoption started in inventory/staff; KPI pending. |
| Pagination (`skip`,`limit`,`meta`) | inventory-menu-mgmt, staff, kpis | Oscar | BR-016, BR-023 | READY_TO_SPEC | Day 4 | Validate table/grid assumptions and defaults. |
| Pagination (`skip`,`limit`,`meta`) | orders, tables-tickets | Ian | BR-016, BR-023 | READY_TO_SPEC | Day 4 | Integrate with data table controls. |
| Websocket auth requirement | orders | Ian | BR-017, BR-018, BR-022 | BLOCKED | Day 4 | Current docs conflict on token requirement. |
| Websocket ping handling | orders | Ian | BR-018 | IN_PROGRESS | Day 1-2 | Implemented via contract parser; schema validation still pending BR-018. |
| OTP expiry handling (`OTP_EXPIRED`) | guest-menu, legacy-orphans | Mau | BR-019 | READY_TO_SPEC | Day 5 | Define UX branch and copy once contract confirmed. |
| `get-non-active-tables` contract change | tables-tickets | Ian | BR-020, BR-023 | READY_TO_SPEC | Day 5 | Need final path/method confirmation. |
| Unified error model mapping | all data capabilities | Oscar | BR-021, BR-023 | READY_TO_SPEC | Day 5 | Shared error adapter + per-feature UX mapping. |
| `/health` deployment smoke integration | platform-shared | Mau | BR-023 | READY_TO_SPEC | Day 6 | Optional but useful for operational checks. |

## Owner Breakdown By Lane
- Mau: auth decision path + guest/smartorder wrapper/OTP strategy.
- Ian: websocket + orders/tickets/tables contract alignment.
- Oscar: pagination/wrapper/error normalization for inventory/staff/kpis and shared adapters.

## Check Snapshot (2026-04-05)
- Shared contract adapter introduced and in active use.
- Core response-wrapper adoption moved to `IN_PROGRESS` across all 3 owners.
- Auth-specific migration remains blocked until BR-011..BR-014.

## Entry Criteria For Implementation
A row can move from `READY_TO_SPEC` to `READY_TO_IMPLEMENT` only when:
1. All related BR requests are `ANSWERED` or `WAIVED`.
2. Contract examples are linked in `01-open-questions.md`.
3. Affected capability doc has `Backend Hardening Impact` section updated.

