# Capability: Orders Board

## Capability Goal And Business Outcomes
- Show live order state progression from incoming order to completed serving.
- Let staff update order status with immediate visual feedback.
- Keep order synchronization reliable under websocket and API updates.

## Entry Points

### Routes
- `/orders`

### Pages And Components
- `src/components/containers/Orders/OrderContainer.tsx`
- `src/components/containers/Orders/OrderBoard.tsx`
- `src/components/orders/OrderColumn.tsx`
- `src/components/orders/OrderCard.tsx`
- `src/components/orders/DropIndicator.tsx`
- `src/components/orders/BurnBarrel.tsx`
- `src/components/orders/AddCard.tsx`

## Current Functions Hooks Utils Used

### Read Paths
- `useQueryOrders(restaurant_id, location_id)` from `src/hooks/tanstack/queryOrders.ts`
- `fetchOrders(...)` from `src/utils/orderUtils.ts`
- Websocket stream from `wss://sabina01.onrender.com/ws/orders/:restaurant/:location`

### Write Paths
- `updateOrder(order_id, status)` from `src/utils/orderUtils.ts`
- `uploadOrder(order)` from `src/utils/orderUtils.ts` (shared with smart-order submission flow)

### Realtime Paths
- Orders websocket in `OrderBoard.tsx` updates card state in-place

## Dependency Graph
- Upstream: Tenant identity from `userState`, auth guard.
- Internal dependencies: drag/drop board components, order transport functions.
- Downstream: kitchen flow, ticket settlement, KPI metrics aggregation.
- External services:
  - Orders REST endpoints
  - Orders websocket endpoint

## Volatility Map

### Temporal Volatility
- Order status pipeline can change as operations mature.
- Queue management rules and retry/error policy are likely to evolve.
- Realtime transport strategy may shift (websocket reliability, fallback polling).

### Spatial Volatility
- Customers may have different status steps or preparation workflows.
- Some tenants may require role-based restrictions per status transition.

## Duplication And Coupling Hotspots
- Local board state and websocket state reconciliation are tightly coupled in one component.
- Shared `uploadOrder` logic is spread between smart-order and orders utility with partial hardcoded fields.

## Refactor Target Architecture
- Create `orders-domain` with:
  - status transition policy
  - websocket event adapter
  - board projection model
- Isolate `uploadOrder` payload resolution from UI/cart assumptions.
- Add robust error and reconnect handling for websocket lifecycle.

## Estimate (days)
- Optimistic: 3
- Likely: 4
- Pessimistic: 6

## Agent Ready Task Slices
1. Add typed websocket event parser and reconciliation strategy.
2. Move status transitions to a domain policy helper.
3. Unify order upload payload generation and remove hardcoded ticket usage.
4. Add tests for status transition and websocket update behavior.

## Acceptance Criteria
- Orders board remains stable under websocket reconnect and out-of-order events.
- Status updates are validated against one transition policy.
- Shared upload flow has no hidden hardcoded identifiers.
- Orders route has deterministic loading, error, and empty-state handling.

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

