# Capability: Auth And Access

## Capability Goal And Business Outcomes
- Ensure only authenticated and authorized users can access protected operations.
- Keep identity, role resolution, and sign-out behavior consistent across web and mobile layouts.
- Minimize change blast radius when auth provider or role model changes.

## Entry Points

### Routes
- `/login`
- `/signup`
- Protected shell for `/`, `/sidebar`, `/my-staff`, `/inventory`, `/orders`, `/tables`, `/kpis`, `/tickets`

### Pages And Components
- `src/routes/ProtectedRoute.tsx`
- `src/auth/Login.tsx`
- `src/auth/SignUp.tsx`
- `src/components/management/Sidebar/Extended.tsx`
- `src/components/management/Sidebar/MobileSidebar.tsx`

## Current Functions Hooks Utils Used

### Read Paths
- `fetchUser(email)` from `src/hooks/tanstack/getUser.ts`
- `useUser(email)` from `src/hooks/tanstack/getUser.ts` (available but less used in route guard)
- Clerk `useUser()` for session state
- `useUserStore().getRoles()` for role gating in sidebar links

### Write Paths
- `useUserStore().setUser()` updates persisted user profile in session storage
- Clerk `signOut()` is called from sidebar actions
- Kinde `register()` used in signup page

### Realtime Paths
- None

## Dependency Graph
- Upstream: Router provider, Clerk provider, `main.tsx` bootstrapping.
- Internal dependencies: `getUser.ts`, `userState.ts`, `sidebarLinks.tsx`.
- Downstream: All protected capability routes depend on auth-access correctness.
- External services:
  - Clerk
  - Kinde
  - Backend user profile endpoint `GET /login/get_user_info/:email`
  - Legacy Supabase auth context (not wired into runtime provider tree)

## Volatility Map

### Temporal Volatility
- Provider strategy is unstable (Clerk + Kinde + Supabase legacy code paths).
- Role definitions will likely change as operations add chef, hostess, manager-specific views.
- Sign-up requirements (restaurant binding, onboarding flow) are likely to evolve.

### Spatial Volatility
- Multi-tenant restaurants and locations require role scope at tenant level.
- Different customer orgs may need custom role matrices and route visibility rules.

## Duplication And Coupling Hotspots
- Mixed auth providers create duplicated identity flows and ambiguous source of truth.
- Role filtering is spread across UI components, not centralized in one policy boundary.
- Legacy `AuthContext` and legacy login form can accidentally be reused and reintroduce drift.

## Refactor Target Architecture
- Create `auth-core` boundary with:
  - session provider adapter (single provider at runtime)
  - profile resolver (backend profile hydration)
  - route guard policy module
  - role capability matrix as pure data
- Keep provider SDK calls behind one adapter layer; no provider SDK calls in page components.
- Remove or archive legacy Supabase auth context unless explicitly selected as provider.

## Estimate (days)
- Optimistic: 3
- Likely: 5
- Pessimistic: 7

## Agent Ready Task Slices
1. Normalize provider strategy and remove dead auth branches.
2. Introduce centralized authorization matrix for route and sidebar visibility.
3. Separate profile hydration from UI rendering to avoid duplicated fetch logic.
4. Add auth smoke tests for signed-in, signed-out, and role-restricted navigation.

## Acceptance Criteria
- Exactly one runtime auth provider path is active and documented.
- Protected routes deny access when signed out and permit access when signed in.
- Role visibility behavior is defined in one policy map and used by both desktop and mobile sidebar.
- Legacy auth modules are marked `archive` or fully removed from active imports.

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

