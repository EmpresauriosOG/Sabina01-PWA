# Capability: Legacy And Orphan Modules

## Capability Goal And Business Outcomes
- Prevent accidental reuse of stale modules that can reintroduce architectural drift.
- Classify old code as `keep`, `refactor`, or `archive` with explicit decisions.
- Reduce maintenance cost by separating active capabilities from historical experiments.

## Entry Points

### Routes
- `/otp` (currently active route but behavior is partial and disconnected from core ordering flow)

### Pages And Components
- `src/components/menu/OTPTable.tsx`
- `src/context/AuthContext.tsx`
- `src/components/forms/Form.tsx`
- `src/components/management/Tables.tsx`
- `src/components/containers/Restaurants.tsx`
- `src/shared/constants.ts`
- `src/utils/tableUtils.ts`
- `src/hooks/tanstack/getOTP.ts`

## Current Functions Hooks Utils Used

### Read Paths
- `useOTP(restaurantId)` from `src/hooks/tanstack/getOTP.ts` (legacy weather API sample)
- `fetchTables(...)` from `src/utils/tableUtils.ts` (duplicate API client, unused)

### Write Paths
- `signInWithGoogle` and `signOut` from legacy `AuthContext` (not wired to runtime provider)

### Realtime Paths
- None

## Dependency Graph
- Upstream: none for most orphan modules (limited or no active imports).
- Internal dependencies: old auth form depends on old auth context.
- Downstream: accidental imports can reintroduce provider conflicts and old contracts.
- External services:
  - Legacy Supabase auth
  - RapidAPI weather endpoint in `getOTP.ts` with hardcoded API key

## Volatility Map

### Temporal Volatility
- This code will decay quickly if kept in active paths without ownership.
- Security and compliance risk increases over time when stale credentials remain in repo.

### Spatial Volatility
- Legacy modules are not tenant-aware and cannot safely serve multi-customer behavior.

## Duplication And Coupling Hotspots
- Duplicate table fetch transport (`tableUtils.ts` vs `tablesUtils.ts`).
- Legacy auth flow duplicates runtime auth concepts with different provider.
- Standalone sample/demo pages can be mistaken as production-ready modules.

## Refactor Target Architecture
- Classify by status:
  - `keep`: modules with active route and clear owner
  - `refactor`: modules with active intent but broken flow
  - `archive`: dead code paths and obsolete experiments
- Move archived modules into dedicated `legacy/` folder or remove after team sign-off.
- Remove hardcoded credentials and secrets from source history and runtime code.

## Estimate (days)
- Optimistic: 2
- Likely: 3
- Pessimistic: 5

## Agent Ready Task Slices
1. Build explicit keep/refactor/archive inventory and get team sign-off.
2. Remove hardcoded credential from `getOTP.ts` and disable route until valid flow exists.
3. Archive or delete unused `tableUtils.ts`, legacy auth form, and sample tables page.
4. Add CI guard to block new hardcoded secrets and deprecated module imports.

## Acceptance Criteria
- Every listed legacy module has a clear status (`keep`, `refactor`, or `archive`).
- No hardcoded API keys or credentials remain in tracked frontend source.
- Deprecated modules are removed from active import graph.
- `/otp` route is either integrated into real flow or explicitly retired.

## Module Classification Table

| File | Status | Rationale |
|---|---|---|
| `src/components/menu/OTPTable.tsx` | refactor | Active route but currently disconnected from ticket/table flow. |
| `src/hooks/tanstack/getOTP.ts` | archive | Uses weather sample endpoint and hardcoded RapidAPI key. |
| `src/context/AuthContext.tsx` | archive | Supabase auth path not used in active provider tree. |
| `src/components/forms/Form.tsx` | archive | Legacy login form tied to archived auth context. |
| `src/components/management/Tables.tsx` | archive | Static demo page, not routed/imported. |
| `src/components/containers/Restaurants.tsx` | archive | Entire component commented out, not used. |
| `src/utils/tableUtils.ts` | archive | Duplicate fetch API, replaced by `tablesUtils.ts`. |
| `src/shared/constants.ts` | keep (quarantine) | Large static content; currently unused but may be useful fixture data. |
