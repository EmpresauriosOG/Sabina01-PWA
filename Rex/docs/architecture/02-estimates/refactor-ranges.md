# Refactor Ranges By Capability

Baseline date: April 1, 2026  
Unit: engineering days (1 engineer, focused delivery)

## Estimate Table

| Capability | Optimistic | Likely | Pessimistic | Main Cost Drivers |
|---|---:|---:|---:|---|
| auth-access | 3 | 5 | 7 | provider consolidation, role policy centralization |
| smartorder-ai | 4 | 6 | 9 | hardcoded IDs, chat/cart decoupling, order payload correctness |
| guest-menu | 6 | 8 | 12 | monolith decomposition, route-param wiring, duplicate view blocks |
| staff | 2 | 3 | 5 | mutation-refresh strategy and role validation cleanup |
| inventory-menu-mgmt | 5 | 7 | 10 | large modal split, menu mutation unification |
| orders | 3 | 4 | 6 | websocket reliability and status policy isolation |
| tables-tickets | 4 | 6 | 9 | duplicate API clients, ticket close flow completion |
| kpis | 3 | 4 | 6 | hook normalization and shared response mapping |
| platform-shared | 2 | 3 | 4 | shell/provider hardening and shared abstraction cleanup |
| legacy-orphans | 2 | 3 | 5 | archive decisions and safe code quarantine |

## Rollup
- Total optimistic: 34 days
- Total likely: 49 days
- Total pessimistic: 73 days

Practical planning interpretation:
- Sequential single engineer: roughly 7 to 14 weeks depending on interruptions and scope churn.
- 2 to 3 engineers in parallel: roughly 3 to 7 weeks if capability boundaries remain independent.

## Estimation Rationale Notes
- Ranges include implementation, regression fixes, and baseline validation.
- Ranges do not include major backend contract changes unless explicitly listed in task scope.
- High volatility capabilities (auth, smartorder-ai, guest-menu, tables-tickets) carry broader pessimistic bounds.

## Reliability Log And Review Protocol
- Estimate method: volatility-based decomposition plus hotspot complexity scan.
- Review rule: change ranges only when one of these changes:
  - dependency graph changes
  - capability boundary changes
  - backend contract changes
  - production constraints change
- Every estimate revision must include:
  - date
  - reason
  - old value -> new value
  - reviewer

## Parallelization Guidance

### Best Parallel Lanes
- Lane A: auth-access + platform-shared
- Lane B: inventory-menu-mgmt + staff + kpis
- Lane C: orders + tables-tickets
- Lane D: guest-menu + smartorder-ai (shared architect oversight recommended)

### Merge Conflict Risk Zones
- Shared `components/ui` updates
- `src/hooks/tanstack/getMenu.ts` and `src/utils/orderUtils.ts`
- `src/shared/state/userState.ts`
- route configuration in `src/main.tsx`

## Confidence Levels
- High confidence: staff, kpis, platform-shared
- Medium confidence: auth-access, orders, tables-tickets, inventory-menu-mgmt
- Lower confidence: guest-menu, smartorder-ai (due to larger coupling and hidden UX edge cases)
