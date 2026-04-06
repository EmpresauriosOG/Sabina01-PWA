# Capability: Platform Shared And Shell

## Capability Goal And Business Outcomes
- Provide a stable runtime shell, route composition, and reusable UI primitives.
- Keep shared components generic so feature teams can move independently.
- Centralize cross-cutting concerns (providers, layout, toasts, theme, table primitives).

## Entry Points

### Routes
- `/sidebar` (direct route currently mapped to sidebar component)
- Global shell applied to all nested protected routes through `RootLayout`

### Pages And Components
- `src/main.tsx`
- `src/RootLayout.tsx`
- `src/components/ui/*`
- `src/components/theme-provider.tsx`
- `src/components/forms/FormFields/*`
- `src/components/tables/DataTable.tsx`
- `src/components/tables/ColumnHeader.tsx`
- `src/components/tables/DeleteToast.tsx`

## Current Functions Hooks Utils Used

### Read Paths
- Shared state reads from `useUserStore` where needed in shell/sidebar.
- UI helpers from `src/lib/utils.ts`.

### Write Paths
- Theme preference persistence via `theme-provider`.
- Shared toast and table UI interactions.

### Realtime Paths
- None

## Dependency Graph
- Upstream: browser runtime, provider bootstrap order in `main.tsx`.
- Internal dependencies: all capabilities consume `components/ui` primitives.
- Downstream: every route page depends on shell layout and provider correctness.
- External services:
  - Clerk provider setup in `main.tsx`
  - Query client provider for all data hooks

## Volatility Map

### Temporal Volatility
- Design system choices and layout strategy will evolve with product growth.
- Provider composition can change with auth and state strategy updates.

### Spatial Volatility
- White-labeling or tenant branding can require shell-level theming variability.
- Different devices and roles may require layout variants.

## Duplication And Coupling Hotspots
- Sidebar appears both in `RootLayout` and `/sidebar` route (possible duplicate intent).
- Shared table/form primitives can become coupled to specific domain data conventions.

## Refactor Target Architecture
- Keep shell boundaries strict:
  - `platform-shell` (layout and navigation)
  - `platform-providers` (auth/query/theme bootstrapping)
  - `platform-ui` (domain-agnostic primitives only)
- Remove or repurpose standalone `/sidebar` route if only a debug route.
- Enforce domain-independent contracts on shared table and form components.

## Estimate (days)
- Optimistic: 2
- Likely: 3
- Pessimistic: 4

## Agent Ready Task Slices
1. Clarify `/sidebar` route intent and remove duplication if unnecessary.
2. Audit shared components for domain leakage and isolate business logic.
3. Create provider bootstrap notes and invariants for future migrations.
4. Add smoke tests around shell rendering and provider initialization.

## Acceptance Criteria
- Shared layer remains domain-agnostic and reusable across capabilities.
- Route shell and provider boot order are documented and stable.
- `/sidebar` is either intentionally supported or formally archived.
- Shared components can be consumed without importing capability-specific code.
