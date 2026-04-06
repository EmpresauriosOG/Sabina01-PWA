# Capability: Guest Menu Experience

## Capability Goal And Business Outcomes
- Provide public menu browsing for guests by restaurant and location.
- Support search, filtering, and cart-style interaction for table-side ordering intent.
- Keep guest-facing UX independent from internal management dashboards.

## Entry Points

### Routes
- `/menu/:restaurantId/:locationId`

### Pages And Components
- `src/components/Menu.tsx`

## Current Functions Hooks Utils Used

### Read Paths
- `useMenu(restaurantId, locationId)` from `src/hooks/tanstack/getMenu.ts`
- Local filtering and category projection in `Menu.tsx`

### Write Paths
- Local cart state updates inside `Menu.tsx`
- Direct axios chat call from `Menu.tsx` to inline URL for recommendation flow

### Realtime Paths
- None

## Dependency Graph
- Upstream: Router params from route path (currently not consumed correctly in component logic).
- Internal dependencies: UI primitives (`card`, `tabs`, `drawer`, inputs), `useMenu`.
- Downstream: Intended handoff to ordering or checkout, currently not fully integrated.
- External services:
  - Backend menu API
  - Inline chat URL currently malformed and hardcoded

## Volatility Map

### Temporal Volatility
- Guest-facing layout and merchandising are likely to change often.
- Category semantics and menu metadata fields can evolve.
- Recommendation/chat UX for guests will change as AI model behavior is tuned.

### Spatial Volatility
- Customer-specific branding, promo banners, and category taxonomy will vary by restaurant.
- Localization and language variants may differ by deployment.

## Duplication And Coupling Hotspots
- `Menu.tsx` is a monolith (~1300 lines) with repeated tab card rendering blocks.
- Guest chat/cart behavior overlaps conceptually with smart-order dashboard.
- Route contains params, but component currently hardcodes IDs in active calls.

## Refactor Target Architecture
- Break `Menu.tsx` into:
  - route container (`guest-menu-page`)
  - product grid and category views
  - cart summary and quantity controls
  - guest chat/recommendation module
- Consume `restaurantId` and `locationId` from route params.
- Reuse shared catalog and cart domain logic with smart-order via explicit adapters.

## Estimate (days)
- Optimistic: 6
- Likely: 8
- Pessimistic: 12

## Agent Ready Task Slices
1. Extract route param parsing and remove all hardcoded tenant identifiers.
2. Decompose category tabs into reusable presentation components.
3. Isolate guest chat transport into hook/service boundary.
4. Add smoke tests for route loading, search, and cart quantity behavior.

## Acceptance Criteria
- Guest menu reads tenant context from route params only.
- No duplicate category-render logic remains in one giant component.
- Chat transport path is valid, configurable, and independently testable.
- Guest menu can render with mocked menu payload across multiple category combinations.

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

