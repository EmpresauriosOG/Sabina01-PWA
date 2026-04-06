# Frontend Resume And Refactor Estimate Pack

Prepared for team sharing in Notion.  
Baseline date: April 1, 2026.

## 1) Executive Resume Of The App
- Stack: React + TypeScript + Vite + TanStack Query + Zustand.
- Domain: restaurant operations frontend (smart ordering, staff, inventory, orders, tables, tickets, KPI dashboards).
- Architecture status: recoverable but with medium-high debt.
- Primary architectural risks:
  - mixed auth providers and legacy auth code
  - hardcoded IDs, endpoints, and one credential leak in source
  - duplicated transport/data paths
  - large monolithic components
  - no automated tests

## 2) Current Capability Map
- auth-access
- smartorder-ai
- guest-menu
- staff
- inventory-menu-mgmt
- orders
- tables-tickets
- kpis
- platform-shared
- legacy-orphans

Primary route mapping is documented in `00-system-map.md`.

## 3) Refactor Estimates (Days)

| Capability | Optimistic | Likely | Pessimistic |
|---|---:|---:|---:|
| auth-access | 3 | 5 | 7 |
| smartorder-ai | 4 | 6 | 9 |
| guest-menu | 6 | 8 | 12 |
| staff | 2 | 3 | 5 |
| inventory-menu-mgmt | 5 | 7 | 10 |
| orders | 3 | 4 | 6 |
| tables-tickets | 4 | 6 | 9 |
| kpis | 3 | 4 | 6 |
| platform-shared | 2 | 3 | 4 |
| legacy-orphans | 2 | 3 | 5 |

Rollup:
- Total optimistic: 34 days
- Total likely: 49 days
- Total pessimistic: 73 days

## 4) Is This Codebase Good?
Short answer: good enough to continue, not good enough to scale safely without targeted stabilization.

Rubric snapshot:
- Maintainability: medium
- Change isolation: low-medium
- Testability: low
- Operational confidence: medium-low

## 5) Recommended Execution Order

### P0 First
1. Contract-first: add shared API envelope compatibility parser and migrate core hooks/utils.
2. Remove hardcoded IDs/credentials and normalize runtime config.
3. Consolidate auth strategy to one provider path (currently blocked by BR-011/012/013).
4. Fix critical lint errors and ticket lifecycle gaps.

### Then Parallel Capability Lanes
- Lane A: auth-access + platform-shared
- Lane B: inventory-menu-mgmt + staff + kpis
- Lane C: tables-tickets + orders
- Lane D: guest-menu + smartorder-ai
- Lane E: legacy-orphans cleanup

## 6) What Was Implemented In This Documentation Pass
- Capability-first architecture map and route ownership.
- One capability document per module with volatility analysis and task slices.
- Refactor estimate tables with tri-range day estimates.
- Quality assessment with objective findings and P0/P1/P2 priorities.
- Agent work queue for parallel execution.
- Volatility architect skill pack for Codex and Claude adapters.

## 7) What Is Still Missing
- Team cross-review and sign-off on estimates.
- Dry-run skill validation on 3 prompts for both adapters.
- CI-level architecture guardrails (import boundaries, secret scanning, test baseline).
- Backend BR confirmations for envelope/pagination/error contracts before removing compatibility fallbacks.

## 8) Detailed Docs Index
- `00-system-map.md`
- `01-capabilities/*.md`
- `02-estimates/refactor-ranges.md`
- `03-quality/codebase-health.md`
- `04-agent-work-queue.md`
- `skills/volatility-architect/*`
