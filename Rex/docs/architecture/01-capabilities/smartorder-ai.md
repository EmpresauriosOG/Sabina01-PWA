# Capability: Smart Order And AI Assistant

## Capability Goal And Business Outcomes
- Enable a fast, assistant-driven ordering experience for restaurant guests and staff.
- Convert menu discovery to cart actions and order submission with minimal friction.
- Keep AI recommendation behavior isolated from core ordering transactions.

## Entry Points

### Routes
- `/`
- `/open-menu`

### Pages And Components
- `src/components/containers/SmartOrder/SmartOrder.tsx`
- `src/components/containers/AdminDashboard.tsx`
- `src/components/smartOrders/ChatInterface.tsx`
- `src/components/smartOrders/ShoppingCardModal.tsx`
- `src/components/smartOrders/ShoppingCardbutton.tsx`
- `src/components/smartOrders/SmartOrderTabs.tsx`

## Current Functions Hooks Utils Used

### Read Paths
- `useMenu(restaurantId, locationId)` from `src/hooks/tanstack/getMenu.ts`
- `fetchChat(locationId, chatInput)` from `src/hooks/tanstack/fetchChat.ts`
- User tenancy context from `useUserStore().user`

### Write Paths
- `uploadOrder(order)` from `src/utils/orderUtils.ts` via `ShoppingCardModal`
- Local cart mutations in `AdminDashboard` and smart-order components

### Realtime Paths
- None (chat and ordering currently request-response)

## Dependency Graph
- Upstream: Auth-access (user tenant context), router shell.
- Internal dependencies: `getMenu.ts`, `fetchChat.ts`, `orderUtils.ts`, smart order UI components.
- Downstream: order creation lifecycle and kitchen workflows.
- External services:
  - Backend menu API at `sabina01.onrender.com`
  - AI endpoint `aiapi-production-fbc0.up.railway.app`
  - Orders API upload endpoint

## Volatility Map

### Temporal Volatility
- Recommendation prompt patterns and AI payload shape will evolve frequently.
- Cart and checkout rules are likely to change with promotions, modifiers, and ticket policies.
- Mobile-first interaction behavior and component hierarchy will evolve as UX matures.

### Spatial Volatility
- Different restaurants may need custom recommendation logic or menu visibility filters.
- Ticket assignment and order routing may differ per customer workflow.

## Duplication And Coupling Hotspots
- Hardcoded `restaurantId`, `locationId`, and `ticket_id` values in active ordering paths.
- Chat and cart concerns mixed inside large UI containers.
- Duplicate conceptual flow with guest `Menu.tsx` capability (search, cart, chat card rendering).

## Refactor Target Architecture
- Split into four bounded modules:
  - `smartorder-catalog` (menu read and filtering)
  - `smartorder-cart` (cart state and mutation rules)
  - `smartorder-chat` (AI request/response adapter + message rendering strategy)
  - `smartorder-submit` (order payload mapping and submission)
- Move tenant and ticket resolution into explicit dependencies passed from route/session context.
- Remove all hardcoded operational identifiers from UI code.

## Estimate (days)
- Optimistic: 4
- Likely: 6
- Pessimistic: 9

## Agent Ready Task Slices
1. Replace hardcoded IDs with runtime-resolved context and validated props.
2. Extract cart domain functions from UI components into pure modules.
3. Introduce AI adapter layer and normalize response parsing contract.
4. Align order submit flow with ticket lifecycle and backend contract tests.

## Acceptance Criteria
- No hardcoded restaurant, location, ticket, or host IDs remain in smart-order runtime code.
- Chat logic is isolated from cart logic with clear interface boundaries.
- Order submission uses validated runtime context and consistent error states.
- Smart order route can be tested with deterministic mocks for menu, AI, and order APIs.

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

