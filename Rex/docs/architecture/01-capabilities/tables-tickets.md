# Capability: Tables And Tickets

## Capability Goal And Business Outcomes
- Manage dining spaces, tables, and ticket lifecycle for each location.
- Let staff create and close tickets from table interactions.
- Keep table status and ticket records synchronized and auditable.

## Entry Points

### Routes
- `/tables`
- `/tickets`

### Pages And Components
- `src/components/containers/RestaurantTables/RestaurantTablesContainer.tsx`
- `src/components/containers/RestaurantTables/RestaurantTables.tsx`
- `src/components/containers/RestaurantTables/Table.tsx`
- `src/components/containers/RestaurantTables/TableEditor.tsx`
- `src/components/containers/RestaurantTables/SpaceSelector.tsx`
- `src/components/containers/Tickets/TicketsContainer.tsx`

## Current Functions Hooks Utils Used

### Read Paths
- `useQueryTables(...)` from `src/hooks/tanstack/queryTables.ts`
- `fetchTables(...)` from `src/utils/tablesUtils.ts`
- `useTickets(...)` from `src/hooks/tanstack/useTickets.ts`
- `fetchTickets(...)` from `src/utils/ticketUtils.ts`
- Legacy duplicate: `src/utils/tableUtils.ts` also exports `fetchTables` but is unused

### Write Paths
- Table space and table mutations from `src/utils/tablesUtils.ts`:
  - `addRestaurantSpace`
  - `addRestaurantTable`
  - `updateRestaurantTable`
  - `deleteRestaurantTables`
  - `deleteRestaurantSpace`
  - `deleteRestaurantTable`
- Ticket mutations:
  - `createTicket`
  - `closeTicket`
  - `useCreateTicket`
  - `useCloseTicket`

### Realtime Paths
- None (all table/ticket updates currently request-response)

## Dependency Graph
- Upstream: Auth-access tenant context, shared table UI primitives.
- Internal dependencies: table editor, space selector, ticket data table.
- Downstream: order creation flow depends on ticket existence.
- External services:
  - Tables endpoints under `/tables/*`
  - Tickets endpoints under `/tickets/*`

## Volatility Map

### Temporal Volatility
- Table status rules and ticket-close behavior will evolve with operations.
- Space/table model fields may expand (reservations, waiter assignment, timing metadata).

### Spatial Volatility
- Venue layouts differ dramatically across customers (bar, terrace, events).
- Ticket model can differ by region or compliance requirements.

## Duplication And Coupling Hotspots
- Duplicate table transport modules (`tablesUtils.ts` and unused `tableUtils.ts`).
- Partial TODO flow for ticket closing from table UI (`onCloseTicket` placeholder).
- Potential argument confusion between `space_id` and `space_name` in delete table call path.

## Refactor Target Architecture
- Consolidate table APIs into one canonical module with strict typed DTOs.
- Introduce `table-ticket-orchestrator` to coordinate create/close ticket events from table actions.
- Add explicit command objects for table mutation operations.
- Keep ticket table UI independent from table layout state.

## Estimate (days)
- Optimistic: 4
- Likely: 6
- Pessimistic: 9

## Agent Ready Task Slices
1. Remove duplicate table API module and update imports.
2. Complete close-ticket integration from table UI with backend mutation.
3. Validate and harden table delete/update argument mapping.
4. Add integration tests for table->ticket create/close workflow.

## Acceptance Criteria
- Exactly one table API module is used in runtime code.
- Table UI supports create and close ticket actions end-to-end.
- Ticket list updates correctly after close actions.
- No placeholder TODO remains in critical ticket lifecycle path.

## Backend Hardening Impact
- Source packet: docs/architecture/06-backend-integration/*
- Owner lane alignment:
  - Mau: auth decision + guest/smartorder wrapper strategy
  - Ian: websocket + orders/tables/tickets contracts
  - Oscar: pagination/wrapper/error normalization for data-heavy capabilities
- Current status:
  - Auth strategy remains HOLD pending BR-011/012/013/014.
  - Response wrapper and pagination are READY_TO_SPEC, blocked on BR-015/016/021/023.
- Rule: no implementation for blocked items until related BR requests are ANSWERED or WAIVED in 1-open-questions.md.

