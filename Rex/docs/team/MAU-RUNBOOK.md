# MAU RUNBOOK

Owner: Mau
Lane ownership: A + D
Date baseline: 2026-04-01

## Goal And Capability Ownership
Mau owns the highest-complexity cross-cutting work:
- auth-access
- platform-shared
- guest-menu
- smartorder-ai

Reference docs:
- `docs/architecture/01-capabilities/auth-access.md`
- `docs/architecture/01-capabilities/platform-shared.md`
- `docs/architecture/01-capabilities/guest-menu.md`
- `docs/architecture/01-capabilities/smartorder-ai.md`
- `docs/team/TEAM-3P-PLAYBOOK.md`

## In Scope
- Auth provider consolidation and route/role policy normalization.
- Runtime shell cleanup and shared session boundaries.
- Guest menu decomposition and route param correctness.
- Smart-order decomposition (chat/cart/catalog/submit boundaries).
- Architecture review support for Ian and Oscar boundary changes.

## Out Of Scope
- Primary ownership of tables/tickets/orders transport policy (Ian).
- Primary ownership of inventory/staff/kpis/legacy cleanup (Oscar).
- Backend implementation changes outside documented request process.

## File Ownership Boundaries
Primary files/directories Mau may edit freely:
- `src/auth/*`
- `src/routes/ProtectedRoute.tsx`
- `src/main.tsx` (provider/route shell concerns)
- `src/components/containers/SmartOrder/*`
- `src/components/containers/AdminDashboard.tsx`
- `src/components/Menu.tsx`
- `src/components/smartOrders/*`
- `src/components/management/Sidebar/*`
- `src/hooks/tanstack/fetchChat.ts`

Shared-risk files (handoff required if Ian/Oscar also touching):
- `src/main.tsx`
- `src/hooks/tanstack/getMenu.ts`
- `src/shared/state/userState.ts`
- `src/utils/orderUtils.ts`

## Packetized Tasks

### A1: Unify Auth Provider Boundary
- Remove active drift between Clerk/Kinde/legacy flows in runtime.
- Define one source of truth for signed-in state and role hydration.
- Link blocker: BR-001, BR-002.

#### A1 Subtasks (completed 2026-04-02)
- [x] A1.1: Audit current auth provider usage (Clerk active, Kinde partial, Supabase dead)
- [x] A1.2: Decision — keep Clerk as sole auth provider. Role-from-backend pattern stays.
- [x] A1.3: Removed dead auth code (Kinde, Supabase AuthContext, legacy LoginForm)
  - Deleted: `src/context/AuthContext.tsx`, `src/supabase/supabase.config.tsx`, `src/components/forms/Form.tsx`
  - Rewrote `src/auth/SignUp.tsx` to use Clerk `<SignUp>` component
  - Uninstalled `@kinde-oss/kinde-auth-react`, `@supabase/supabase-js`
  - Removed dead imports from `ProtectedRoute.tsx` and `main.tsx`
- [x] A1.4: Validated role-from-backend pattern is clean (no provider-specific role logic)
- [ ] A1.5: Minor — `sidebarLinks.tsx` role types include "chef"/"default" not in Roles enum (fix later)

### A2: Centralize Route And Sidebar Role Policy
- One role matrix source for route access + sidebar visibility.
- Remove duplicated role checks where possible.

#### A2 Subtasks (completed 2026-04-02)
- [x] A2.1: Fixed sidebarLinks — removed "chef"/"default" strings, duplicate entries, used Roles enum via policy
- [x] A2.2: Created `src/auth/rolePolicy.ts` — single source of truth for route→role mapping
- [x] A2.3: Added role-based route protection to `ProtectedRoute.tsx` (was only checking isSignedIn)
- [x] A2.4: Sidebars now use `getFilteredSidebarLinks(roles)` — no inline filtering, no role duplication
- [x] A2.5: Build verified clean

### A3: Normalize User Profile Hydration And Signout
- Ensure signout clears session and store consistently.
- Ensure protected routes handle loading/error states deterministically.

#### A3 Subtasks (completed 2026-04-02)
- [x] A3.1: Audited all loading states — found 13 raw `Loading...` strings across the app
- [x] A3.2: Created `src/components/ui/loading.tsx` with `PageLoader` (full-screen) and `SectionLoader` (inline)
- [x] A3.3: Normalized signout — both sidebars now clear Zustand first, then Clerk signOut. Labels consistent ("Cerrar sesion")
- [x] A3.4: Replaced all 13 loading states with proper components (ProtectedRoute, SmartOrder, Staff, Orders, Tables, Inventory, KPI charts/cards, Menu, Tickets)

### A4: Platform Shell Cleanup
- Clarify `/sidebar` route role.
- Keep shared components domain-neutral.

#### A4 Subtasks (completed 2026-04-02)
- [x] A4.1: Removed dead `/sidebar` route from main.tsx (was rendering Sidebar twice — already in RootLayout). Removed unused Sidebar import.
- [x] A4.2: Audited shared components — only `DeleteToast.tsx` had domain leakage (hardcoded `deleteStaff`). Refactored to accept generic `onDelete` callback. Deleted duplicate `DeleteIngredient.tsx`. All `src/components/ui/` primitives are clean.

### D1: Decompose Guest Menu Monolith
- Split `Menu.tsx` into route container + presentational sections.
- Remove repeated category rendering duplication.

#### D1 Subtasks (completed 2026-04-02)
- [x] D1.1: Audited Menu.tsx — 1355 lines, same card JSX copy-pasted 5x (one per category tab)
- [x] D1.2: Extracted into 4 focused components:
  - `MenuItemCard.tsx` — single menu item with quantity controls + drawer detail
  - `MenuItemGrid.tsx` — filtered grid, takes optional courseType filter
  - `MenuCart.tsx` — shopping cart overlay with quantity management
  - `MenuChatBot.tsx` — AI chat toggle + interface (self-contained state)
  - `Menu.tsx` — thin route container (1355 → 202 lines, total 728 lines, zero duplication)

### D2: Route Param Correctness For Guest Menu
- Use route params for restaurant/location context.
- Remove hardcoded tenant IDs.

#### D2 Subtasks (completed 2026-04-02)
- [x] D2.1: Replaced hardcoded IDs with `useParams()` in Menu.tsx (route already defined as `/menu/:restaurantId/:locationId`)
- [x] D2.2: Also fixed hardcoded IDs in chat RAG endpoint URL

### D3: Chat Adapter Extraction
- Move AI transport and parsing to dedicated adapter/hook.
- Link blocker: BR-008.

#### D3 Subtasks (completed 2026-04-05)
- [x] D3.1: Created `src/hooks/tanstack/useChat.ts` — owns HTTP transport (via `fetchChat`) + wire-format parsing. Exports `ChatMessage` type and `useChat(locationId, { onMessages })` hook.
- [x] D3.2: Extracted `parseResponse` into `useChat.ts` — handles both plain-text and structured dish-card responses, normalizes to `ChatMessage[]`.
- [x] D3.3: Rewrote `SmartOrdersChat.tsx` — removed all inline parsing logic, now calls `useChat` and appends normalized messages. Clears input immediately on send.
- [x] D3.4: Updated `ChatInterface.tsx` — removed local `ChatMessage` type alias, imports from `useChat.ts` (single source of truth).

### D4: Smart-order Hardcoded Value Removal
- Remove hardcoded restaurant/location/ticket identifiers.
- Ensure runtime context injection from session or props.

#### D4 Subtasks (audit completed 2026-04-02)
- [x] D4.1: Scanned codebase for all hardcoded IDs
- [x] D4.2: Added `TODO [D4]` comments at each location with original value and fix guidance
- Hardcoded values found:
  1. `src/components/containers/AdminDashboard.tsx:41-42` — restaurantId + locationId (should come from `useUserStore().user`)
  2. `src/components/Menu.tsx:75-76` — restaurantId + locationId (should use `useParams()` — route is `/menu/:restaurantId/:locationId`)
  3. `src/utils/orderUtils.ts:50` — ticket_id (should come from active ticket context/session)
  4. `src/components/smartOrders/ShoppingCardModal.tsx:35` — ticket_id (same as above)
- Additional note: API base URL `https://sabina01.onrender.com` is hardcoded in 30+ files — should be moved to `VITE_API_BASE_URL` env var (separate task)

### D5: Smart-order Boundary Separation
- Split cart, catalog, chat, and submit orchestration boundaries.

#### D5 Subtasks (completed 2026-04-05)
- [x] D5.1: Extracted `MenuItem`/`OrderItem` types to `src/components/smartOrders/types.ts` — removed cross-component imports from AdminDashboard
- [x] D5.2: Moved `renderMessage` into `ChatInterface` — removed prop drilling of render function. ChatInterface now owns all message rendering and receives `onAddToOrder` callback instead
- [x] D5.3: AdminDashboard simplified — owns only cart state + search state + orchestration. No UI rendering logic for chat messages.

## Tests Required Before Handoff
- Auth route protection:
  - signed-out user blocked from protected pages
  - signed-in user can access protected pages
- Signout flow:
  - clears state and returns to expected route
- Guest menu:
  - route-param-based loading works for multiple IDs
- Smart-order:
  - no hardcoded tenant/ticket IDs
  - order submit uses runtime context only
- Lint/build for touched files

## Handoff Checklist
- Packet ID completed and referenced in PR.
- Changed files listed by capability.
- Test evidence included (commands + outcomes).
- Related docs updated if boundaries changed.
- Any unresolved dependency linked to request ID.

## PR Checklist
- Title format: `Mau: <packet_id> <summary>`
- Include scope, file list, risks, tests, blockers.
- Confirm no cross-lane edits without handoff note.

## Blocker Escalation Template
Use this exact template in PR or team thread:

`BLOCKER <request_id>`
- Owner: Mau
- Packet: <A1/A2/...>
- Needed by: <Day #>
- Capability blocked: <name>
- What is missing: <contract/schema/example>
- Current workaround risk: <short risk>
- Decision needed: <specific yes/no or schema choice>

## Additional Architecture Reviewer Role
When Ian or Oscar propose boundary changes:
- verify capability ownership is preserved
- verify no volatile business logic is pushed into shared UI
- verify new transport logic is not duplicated across capabilities
- require doc update in `docs/architecture/01-capabilities/*.md` when boundary shifts
