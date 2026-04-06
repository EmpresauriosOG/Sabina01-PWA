# Capability: Staff Management

## Capability Goal And Business Outcomes
- Create, view, update, and remove staff records scoped to restaurant/location.
- Keep role assignment flow simple for admins/managers.
- Provide reliable refresh behavior after create/update/delete operations.

## Entry Points

### Routes
- `/my-staff`

### Pages And Components
- `src/components/containers/Staff.tsx`
- `src/components/forms/StaffForm.tsx`
- `src/components/modals/StaffModal.tsx`
- `src/components/tables/Staff/UserColumn.tsx`
- `src/components/tables/Staff/ModifyStaff.tsx`

## Current Functions Hooks Utils Used

### Read Paths
- `useStaff(restaurant_id, location_id)` from `src/hooks/tanstack/getStaff.ts`
- `fetchStaff(restaurant_id, location_id)` from `src/utils/staffUtils.ts`

### Write Paths
- `submitStaff(data)` from `src/utils/staffUtils.ts`
- `modifyStaff(data)` from `src/utils/staffUtils.ts`
- `deleteStaff(email)` from `src/utils/staffUtils.ts`
- Form refresh signaling via `useFormSubmissionStore.setStaffFormSubmitted`

### Realtime Paths
- None

## Dependency Graph
- Upstream: Auth-access (`userState` restaurant and location IDs), shared table components.
- Internal dependencies: form fields, modal wrappers, data table abstractions.
- Downstream: authorization role behavior in sidebar and protected feature access.
- External services:
  - User endpoints under `sabina01.onrender.com/user/*`

## Volatility Map

### Temporal Volatility
- Role taxonomy and onboarding validations will evolve.
- Staff profile fields may expand (phone, shift, permissions, auditing).

### Spatial Volatility
- Restaurant organizations may require custom role sets and validation policies.
- Some tenants may require soft delete or suspension states instead of hard delete.

## Duplication And Coupling Hotspots
- Form submission state toggles are global and loosely typed by boolean flags.
- Staff role enum is shared from user profile shape and may be over-coupled to backend naming.

## Refactor Target Architecture
- Introduce `staff-service` boundary with typed command/query contracts.
- Replace boolean global form signals with local mutation callbacks + query invalidation.
- Keep table column definitions separate from mutation side effects.

## Estimate (days)
- Optimistic: 2
- Likely: 3
- Pessimistic: 5

## Agent Ready Task Slices
1. Move staff CRUD payload mapping into one service module.
2. Replace form-submitted flags with mutation success invalidation.
3. Add strict role validation and user-facing error mapping.
4. Add tests for create/update/delete flows and table refresh behavior.

## Acceptance Criteria
- Staff CRUD works without relying on global boolean refresh flags.
- Role assignments are validated and consistent across create and edit flows.
- Data table reflects API changes after each mutation without manual page reload.
- Error states provide actionable messages for API failures.

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

