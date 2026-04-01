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

### A2: Centralize Route And Sidebar Role Policy
- One role matrix source for route access + sidebar visibility.
- Remove duplicated role checks where possible.

### A3: Normalize User Profile Hydration And Signout
- Ensure signout clears session and store consistently.
- Ensure protected routes handle loading/error states deterministically.

### A4: Platform Shell Cleanup
- Clarify `/sidebar` route role.
- Keep shared components domain-neutral.

### D1: Decompose Guest Menu Monolith
- Split `Menu.tsx` into route container + presentational sections.
- Remove repeated category rendering duplication.

### D2: Route Param Correctness For Guest Menu
- Use route params for restaurant/location context.
- Remove hardcoded tenant IDs.

### D3: Chat Adapter Extraction
- Move AI transport and parsing to dedicated adapter/hook.
- Link blocker: BR-008.

### D4: Smart-order Hardcoded Value Removal
- Remove hardcoded restaurant/location/ticket identifiers.
- Ensure runtime context injection from session or props.

### D5: Smart-order Boundary Separation
- Split cart, catalog, chat, and submit orchestration boundaries.

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
