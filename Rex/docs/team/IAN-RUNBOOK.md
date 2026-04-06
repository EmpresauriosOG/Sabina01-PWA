# IAN RUNBOOK

Owner: Ian
Lane ownership: C
Date baseline: 2026-04-01

## Goal And Capability Ownership
Ian owns operational integrity and realtime flow:
- tables-tickets
- orders

Reference docs:
- `docs/architecture/01-capabilities/tables-tickets.md`
- `docs/architecture/01-capabilities/orders.md`
- `docs/team/TEAM-3P-PLAYBOOK.md`

## In Scope
- Tables/tickets transport consolidation and lifecycle completion.
- Orders board websocket reconciliation and status policy stabilization.
- Payload contract alignment between tickets and orders.

## Out Of Scope
- Auth/runtime provider decisions (Mau).
- Guest menu and smart-order architecture decomposition (Mau).
- Inventory/staff/kpis and legacy cleanup (Oscar).

## File Ownership Boundaries
Primary files/directories Ian may edit freely:
- `src/components/containers/RestaurantTables/*`
- `src/components/containers/Tickets/*`
- `src/components/containers/Orders/*`
- `src/components/orders/*`
- `src/hooks/tanstack/queryTables.ts`
- `src/hooks/tanstack/useTickets.ts`
- `src/hooks/tanstack/queryOrders.ts`
- `src/utils/tablesUtils.ts`
- `src/utils/ticketUtils.ts`
- `src/utils/orderUtils.ts` (orders/tickets contract section)

Shared-risk files (handoff required if Mau/Oscar also touching):
- `src/utils/orderUtils.ts`
- `src/main.tsx`

## Packetized Tasks

### CF-IAN: Contract-First Kickoff (Day 1-2)
- Adopt shared parser boundary from `src/shared/contracts/api.ts` for orders/tickets/tables responses.
- Implement websocket message parsing through contract helper and ignore heartbeat `ping` safely.
- Keep websocket auth-token behavior behind BR-017/BR-018 confirmation (no irreversible cut).
- Link blockers: BR-015, BR-017, BR-018, BR-021.

#### CF-IAN Subtasks (completed 2026-04-05)
- [x] `tablesUtils.ts` uses `resolveObjectPayload`, `unwrapApiEnvelope`, `getApiErrorMessage` from contracts.
- [x] `ticketUtils.ts` uses `resolveObjectPayload`, `resolveArrayPayload`, `getApiErrorMessage` from contracts.
- [x] `orderUtils.ts` uses `resolveArrayPayload`, `unwrapApiEnvelope`, `getApiErrorMessage` from contracts.
- [x] `OrderBoard.tsx` uses `parseWsOrderMessage<Order>` + `isWsPingMessage` — heartbeat ignored safely.
- [x] No irreversible ws auth-token changes made — behavior kept behind BR-017/BR-018.

### C1: Remove Duplicate Table Transport Module
- Consolidate on one table API client path.
- Ensure no runtime imports use duplicate legacy table API module.

### C2: Complete Table To Ticket Close Flow
- Implement real close-ticket action from table UI.
- Remove placeholder TODO path.
- Link blocker: BR-005, BR-006.

### C3: Tighten Table Mutation Argument Contract
- Resolve `space_id` vs `space_name` ambiguity.
- Ensure delete/update paths target correct table records.
- Link blocker: BR-006.

### C4: Orders Websocket Reconciliation Stabilization
- Add deterministic event parsing and merge behavior.
- Handle reconnect and malformed payload scenarios.
- Link blocker: BR-007.

### C5: Align Shared Order Payload Contract
- Ensure order upload/update contracts align with tickets lifecycle invariants.
- Remove hidden hardcoded ticket assumptions in owned flow.
- Link blocker: BR-004, BR-005.

## Tests Required Before Handoff
- Tables:
  - create table
  - update table
  - delete table
- Tickets:
  - create ticket from table
  - close ticket from table and from ticket table UI
- Orders:
  - websocket message updates board state correctly
  - reconnect behavior does not duplicate or lose order cards
  - status transitions match allowed backend policy
- Contract consistency:
  - no mismatch between ticket/order payload assumptions
- Lint/build for touched files

## Handoff Checklist
- Packet ID completed and referenced in PR.
- Transport contract changes documented in PR notes.
- Test evidence includes happy path + one failure/recovery case.
- Any unresolved backend dependency references request ID.
- Capability docs updated when boundaries or assumptions changed.

## PR Checklist
- Title format: `Ian: <packet_id> <summary>`
- Include scope, files touched, tests, blockers, migration notes.
- If touching shared file, include handoff note from primary owner.

## Blocker Escalation Template
Use this exact template in PR or team thread:

`BLOCKER <request_id>`
- Owner: Ian
- Packet: <C1/C2/...>
- Needed by: <Day #>
- Capability blocked: <tables-tickets/orders>
- What is missing: <schema/event example/rule>
- Current workaround risk: <short risk>
- Decision needed: <specific contract decision>

## Contract Integrity Rules
- No status value assumptions without backend confirmation.
- No table/ticket mutation path should silently swallow API errors.
- Every write operation must have deterministic post-action refresh or state reconciliation.
