# Frontend Codebase Health Assessment

Baseline date: April 1, 2026  
Scope: `Rex/src` frontend only

## Executive Status
- Overall status: recoverable foundation with medium-high architectural debt.
- Strengths:
  - TypeScript + React + Vite stack is modern and maintainable.
  - Capability-oriented directory hints already exist (`containers`, `hooks/tanstack`, `utils`).
  - React Query and websocket usage provide a base for scalable data flow.
- Weaknesses:
  - Auth provider drift (Clerk + Kinde + legacy Supabase).
  - Hardcoded identifiers, URLs, and one hardcoded API credential in source.
  - Monolithic components and duplicated flow logic.
  - No automated tests in repo-level frontend flow.
- Release risk: medium-high until P0 issues are addressed.

## Objective Findings

### Lint Baseline
Captured from `npm run lint` on April 1, 2026:
- Total problems: 12
- Errors: 6
- Warnings: 6

Errors (must fix before strict CI):
- `src/components/tables/DataTable.tsx`: `no-explicit-any` violations.
- `src/components/tables/Dishes/DishesColumn.tsx`: hook rule violation (`useFormSubmissionStore` inside non-component callback).
- `src/components/ui/chart.tsx`: unused variable.
- `src/context/AuthContext.tsx`: unused eslint-disable directive.
- `src/hooks/tanstack/useTickets.ts`: unused import (`Ticket`).

Warnings (quality debt):
- Fast refresh warning pattern in several files exporting non-component values.

### Missing Automated Tests
- No `test`, `spec`, `__tests__`, vitest, or jest test files found in `src`.
- No frontend integration or route smoke test harness present.

### Hardcoded Identifiers Endpoints And Credentials
- Hardcoded restaurant/location IDs in active UI paths:
  - `src/components/containers/AdminDashboard.tsx`
  - `src/components/Menu.tsx`
- Hardcoded ticket ID in order submission:
  - `src/components/smartOrders/ShoppingCardModal.tsx`
  - `src/utils/orderUtils.ts`
- Hardcoded transport hosts distributed across many hooks/utils:
  - `https://sabina01.onrender.com/*`
  - `https://aiapi-production-fbc0.up.railway.app/*`
- Hardcoded credential detected:
  - RapidAPI key in `src/hooks/tanstack/getOTP.ts`

### Duplicated Legacy And Drifted Code
- Duplicate table transport modules:
  - active: `src/utils/tablesUtils.ts`
  - duplicate legacy: `src/utils/tableUtils.ts`
- Auth drift:
  - active Clerk in runtime provider and route guard
  - Kinde signup path in `src/auth/SignUp.tsx`
  - legacy Supabase auth context in `src/context/AuthContext.tsx`
- Large monoliths:
  - `src/components/Menu.tsx`
  - `src/components/modals/DishesModal.tsx`

## Refactor Priorities (P0 P1 P2)

### P0 (stability and security blockers)
- Remove hardcoded IDs and credentials from runtime source.
- Consolidate auth runtime path to one provider strategy.
- Fix lint errors that indicate behavioral risks (hook rules, stale code artifacts).
- Close critical TODO paths in table-ticket lifecycle.

### P1 (change isolation and maintainability)
- Decompose monolithic guest-menu and dish modal components.
- Normalize API host and request handling into reusable service layer.
- Consolidate duplicate table APIs and align model contracts.

### P2 (cleanup and long-term guardrails)
- Archive legacy modules after sign-off.
- Add architecture drift checks in CI (import boundaries, secret scanning, lint gating).
- Add capability-level smoke tests and contract tests.

## Verdict Rubric

| Dimension | Current Rating | Rationale |
|---|---|---|
| Maintainability | Medium | Good stack, but high coupling and large files increase effort. |
| Change isolation | Low-Medium | Business rules and transport details are spread across UI files. |
| Testability | Low | No automated tests and no clear contract test layer. |
| Operational confidence | Medium-Low | Realtime and multi-provider auth exist, but drift and hardcoded values reduce trust. |

## Is This Codebase Good?
Short answer: good enough to continue, not good enough to scale safely without targeted refactor.

Decision summary:
- Keep and evolve the project.
- Start with P0 stabilization before adding major new features.
- Use capability-first workstreams to avoid another cross-cutting rewrite.
