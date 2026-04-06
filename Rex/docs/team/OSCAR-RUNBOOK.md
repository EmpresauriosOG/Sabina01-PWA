# OSCAR RUNBOOK

Owner: Oscar
Lane ownership: B + E
Date baseline: 2026-04-01

## Goal And Capability Ownership
Oscar owns data-domain stabilization and cleanup lane:
- inventory-menu-mgmt
- staff
- kpis
- legacy-orphans

Reference docs:
- `docs/architecture/01-capabilities/inventory-menu-mgmt.md`
- `docs/architecture/01-capabilities/staff.md`
- `docs/architecture/01-capabilities/kpis.md`
- `docs/architecture/01-capabilities/legacy-orphans.md`
- `docs/team/TEAM-3P-PLAYBOOK.md`

## In Scope
- Inventory/menu management refactor and mutation consistency.
- Staff CRUD stabilization and refresh reliability.
- KPI hook and response normalization cleanup.
- Legacy keep/refactor/archive execution and quarantine.

## Out Of Scope
- Auth provider and guest/smart-order architecture decisions (Mau).
- Primary ownership of orders/tables/tickets realtime policy (Ian).

## File Ownership Boundaries
Primary files/directories Oscar may edit freely:
- `src/components/containers/Inventory/*`
- `src/components/forms/IngredientForm.tsx`
- `src/components/forms/StaffForm.tsx`
- `src/components/modals/IngredientModal.tsx`
- `src/components/modals/DishesModal.tsx`
- `src/components/tables/Ingredients/*`
- `src/components/tables/Dishes/*`
- `src/components/tables/Staff/*`
- `src/components/containers/Staff.tsx`
- `src/components/containers/Kpis/*`
- `src/components/cards/*`
- `src/components/charts/*`
- `src/hooks/tanstack/getAverageOrderTime.ts`
- `src/hooks/tanstack/getAverageTicket.ts`
- `src/hooks/tanstack/getBusiestHours.ts`
- `src/hooks/tanstack/getHighestSelling.ts`
- `src/hooks/tanstack/getItems.ts`
- `src/hooks/tanstack/getItemSales.ts`
- `src/hooks/tanstack/getOrderStatus.ts`
- `src/hooks/tanstack/getSales.ts`
- `src/hooks/tanstack/useIngredient.ts`
- `src/hooks/tanstack/getStaff.ts`
- `src/utils/ingredientUtils.ts`
- `src/utils/menuUtils.ts`
- `src/utils/staffUtils.ts`

Legacy lane files (E):
- `src/context/AuthContext.tsx`
- `src/components/forms/Form.tsx`
- `src/components/management/Tables.tsx`
- `src/components/containers/Restaurants.tsx`
- `src/hooks/tanstack/getOTP.ts`
- `src/utils/tableUtils.ts`
- `src/shared/constants.ts`

Shared-risk files (handoff required if Mau/Ian also touching):
- `src/hooks/tanstack/getMenu.ts`
- `src/shared/state/userState.ts`

## Packetized Tasks

### CF-OSCAR: Contract-First Kickoff (Day 1-3)
- Adopt shared parser boundary from `src/shared/contracts/api.ts` in inventory/staff/KPI hooks and utils.
- Normalize list parsing with envelope compatibility and prepare pagination meta handling.
- Do not remove legacy parsing fallbacks until BR-015/BR-016/BR-021 are answered or waived.
- Link blockers: BR-015, BR-016, BR-021, BR-023.

#### CF-OSCAR Subtasks (completed 2026-04-05)
- [x] `ingredientUtils.ts` â€” uses `resolveArrayPayload`, `unwrapApiEnvelope`, `getApiErrorMessage`.
- [x] `menuUtils.ts` â€” uses `resolveArrayPayload`, `unwrapApiEnvelope`, `getApiErrorMessage`.
- [x] `staffUtils.ts` â€” uses `resolveArrayPayload`, `unwrapApiEnvelope`, `getApiErrorMessage`.
- [x] All 8 KPI hooks â€” use `resolveArrayPayload` or `resolveObjectPayload` (see B5 for error handling fix).
- [x] Legacy parsing fallbacks not removed â€” kept for BR-015/BR-016/BR-021 compatibility.

### B1: Split Dish Modal Complexity (completed 2026-04-05)
- Break modal into focused sections (data, image, ingredients, attributes).
- Reduce coupling between view state and submission logic.

#### B1 Subtasks
- [x] Extracted `DishFormFields` component (inside `DishesModal.tsx`) — owns the shared form body: basic info, image, type selects, attributes, and ingredient tabs.
- [x] Defined `DishFormData`, `SelectedIngredient`, `IngredientOption` shared types with clear section comments.
- [x] Both render branches (`isNestedInDialog` and standalone Dialog) now use `<DishFormFields {...sharedFieldsProps} />` — ~300 lines of copy-paste eliminated (1007 → 711 lines).
- [x] Renamed inner `formData` shadow in `handleSubmit` to `nativeFormData` to make submission path explicit.
- [ ] TODO [B1/BR-003]: Full submission logic decoupling deferred until B2 (unify menu mutation API surface) is unblocked.

### B2: Unify Menu Mutation API Surface
- Remove overlapping update pathways and choose one canonical mutation path.
- Link blocker: BR-003.

### B3: Replace Global Submission Flags (completed 2026-04-05)
- Replace cross-feature boolean form flags with deterministic mutation invalidation.

#### B3 Subtasks
- [x] `src/shared/state/formSubmissionState.ts` â€” deleted (3 Zustand booleans: staffFormSubmitted, ingredientFormSubmitted, dishFormSubmitted).
- [x] `StaffForm.tsx` â€” replaced `setStaffFormSubmitted(true)` with `queryClient.invalidateQueries({ queryKey: ["staff"] })` in both onSubmit and onSubmitModify.
- [x] `Staff.tsx` â€” removed useEffect watcher and useFormSubmissionStore import.
- [x] `IngredientForm.tsx` â€” replaced `setIngredientFormSubmitted(true)` (2 occurrences) with `queryClient.invalidateQueries({ queryKey: ["ingredient"] })`.
- [x] `Ingredients.tsx` â€” removed useEffect watcher, removed unused `refetch`.
- [x] `Dishes.tsx` â€” removed useEffect watcher, removed unused `refetch`.
- [x] `DeleteDish.tsx` â€” replaced `setDishFormSubmitted(true)` with `queryClient.invalidateQueries({ queryKey: ["menu"] })`.
- [x] `ModifyDish.tsx` â€” replaced `setDishFormSubmitted(true)` with `queryClient.invalidateQueries({ queryKey: ["menu"] })`.
- [x] `DishesModal.tsx` â€” replaced 2 occurrences of `setDishFormSubmitted(true)` with `queryClient.invalidateQueries({ queryKey: ["menu"] })`.
- [x] `UserColumn.tsx` â€” extracted `StaffActionsCell` named component; replaced imperative `useFormSubmissionStore.getState().setStaffFormSubmitted(true)` with `queryClient.invalidateQueries({ queryKey: ["staff"] })`.
- [x] `IngredientColumn.tsx` â€” extracted `IngredientActionsCell` named component; replaced with `queryClient.invalidateQueries({ queryKey: ["ingredient"] })`.
- [x] `DishesColumn.tsx` â€” extracted `DishActiveCell` named component; replaced with `queryClient.invalidateQueries({ queryKey: ["menu"] })`.

#### B3 Post-Review Fixes (2026-04-06)
- [x] Tightened invalidation scope to tenant keys when available, with fallback to base key:
  - ["staff", restaurant_id, location_id] in staff form/table actions.
  - ["ingredient", restaurant_id, location_id] in ingredient form/table actions.
  - ["menu", restaurant_id, location_id] in dish modal/column/delete/modify actions.
- [x] Preserved compatibility behavior by falling back to ["staff"], ["ingredient"], ["menu"] when tenant identifiers are missing.
### B4: Staff Service Isolation (completed 2026-04-05)
- Keep staff CRUD behavior and table refresh behavior consistent and explicit.

#### B4 Subtasks
- [x] `StaffForm.onSubmit` — normalized from `await fn().then()` + outer try/catch to pure `async/await + try/catch`. Invalidation now consistent with `onSubmitModify`.
- [x] `StaffForm.onSubmitModify` — normalized from `.then().catch()` to `async/await + try/catch`.
- [x] `StaffActionsCell.onDelete` (`UserColumn.tsx`) — added try/catch with `toast.error(...)` so delete failures are visible instead of silent.
- [x] `staffUtils.ts` — already uses contract parsers and throws typed errors; no changes needed.
- [x] `getStaff.ts` — query key `["staff", restaurant_id, location_id]` already consistent with invalidation keys in StaffForm and StaffActionsCell.

### B5: KPI Transport Normalization
- Normalize KPI query transport and response adapters.
- Link blocker: BR-009.

#### B5 Subtasks (completed 2026-04-05)
- [x] All 8 KPI hooks (getSales, getItems, getOrderStatus, getAverageOrderTime, getAverageTicket, getBusiestHours, getHighestSelling, getItemSales) already use contract parsers.
- [x] Added try/catch with `getApiErrorMessage` to all 8 hooks â€” errors now produce consistent messages instead of raw axios exceptions.
- [ ] TODO [B5/BR-009]: Response shape changes (field additions, renames) deferred until BR-009 answers KPI endpoint schemas and location/tenant filtering.

### E1: Keep/Refactor/Archive Execution
- Apply `legacy-orphans.md` module classification decisions.
- Keep record of archived vs refactored modules.

#### E1 Subtasks (completed 2026-04-05)
Previously deleted (Mau lane, A1.3):
- [x] `src/context/AuthContext.tsx` â€” Supabase auth context, deleted.
- [x] `src/components/forms/Form.tsx` â€” legacy login form, deleted.
- [x] `src/utils/tableUtils.ts` â€” no-contract legacy duplicate, deleted (Ian C1).

Deleted this session (zero importers confirmed before deletion):
- [x] `src/components/management/Tables.tsx` â€” static demo table UI, not routed, no importers.
- [x] `src/components/containers/Restaurants.tsx` â€” fully commented-out code, no importers.
- [x] `src/shared/constants.ts` â€” large static fixture menu data, no active importers.
- [x] `src/hooks/tanstack/getOTP.ts` â€” dead weather API stub with exposed credential (see E2).

### E2: Remove Credentials And Stale Imports
- Remove hardcoded credential usage and stale legacy imports.
- Link blocker: BR-010 if schema fixture data is needed for safe migration.

#### E2 Subtasks (completed 2026-04-05)
- [x] Deleted `src/hooks/tanstack/getOTP.ts` â€” contained exposed RapidAPI key (`X-RapidAPI-Key`) and was a dead weather API stub (not OTP). Zero importers, no active route. Credential should be rotated/revoked by team.

#### E1/E2 Post-Review Fixes (2026-04-06)
- [x] Updated docs/architecture/01-capabilities/legacy-orphans.md to align module status with actual deletions (src/shared/constants.ts moved from keep to rchive and deleted modules marked as archived/deleted).
## Tests Required Before Handoff
- Inventory:
  - ingredient CRUD reflects immediately without manual reload
  - dish CRUD reflects immediately without manual reload
- Staff:
  - create/update/delete behavior and role assignment consistency
- KPI:
  - charts render from normalized payloads for same tenant context
- Legacy cleanup:
  - archived modules not referenced by active import graph
  - no hardcoded secrets remain in runtime path
- Lint/build for touched files

## Handoff Checklist
- Packet ID completed and referenced in PR.
- Any archival move includes rationale and impacted import checks.
- Test evidence attached for each touched capability.
- Any missing backend dependency references request ID.
- Capability docs updated where architecture boundaries changed.

## PR Checklist
- Title format: `Oscar: <packet_id> <summary>`
- Include scope, files touched, tests, blockers, and cleanup notes.
- If shared file touched, include handoff note from primary owner.

## Blocker Escalation Template
Use this exact template in PR or team thread:

`BLOCKER <request_id>`
- Owner: Oscar
- Packet: <B1/B2/...>
- Needed by: <Day #>
- Capability blocked: <inventory/staff/kpis/legacy>
- What is missing: <schema/endpoint example/contract>
- Current workaround risk: <short risk>
- Decision needed: <specific decision>

## Cleanup Safety Rules
- Archive by explicit decision, never by accidental deletion.
- If a module is archived, verify no active route/import depends on it.
- If uncertain, quarantine with clear `legacy` label and owner note.
