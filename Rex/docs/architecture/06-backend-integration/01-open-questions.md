# Open Questions For Backend (Canonical Register)

Date: 2026-04-05
Owner doc: team + frontend integration packet
Rule: No irreversible implementation starts for a blocked item until its request is `ANSWERED` or `WAIVED`. Compatibility parser scaffolding is allowed.

Status values:
- `OPEN`
- `IN_PROGRESS`
- `ANSWERED`
- `WAIVED`

## Question Register

| request_id | domain | question | owner | needed_by_day | blocking_capability | status |
|---|---|---|---|---|---|---|
| BR-011 | Auth | What is the final auth strategy (Clerk token verification vs custom JWT vs hybrid), by environment (dev/staging/prod), and timeline for cutover? | Mau | Day 2 | auth-access | OPEN |
| BR-012 | Auth | Is `/auth/login` active in any env now? Provide exact runtime status matrix (active/dormant) for `/auth/login` and `/auth/register`. | Mau | Day 2 | auth-access | OPEN |
| BR-013 | Auth | Exact `/auth/login` contract: request schema, success envelope, token fields (`access_token`, `token_type`, `expires_in`, refresh token yes/no), and all error examples (`400/401/403/409`). | Mau | Day 3 | auth-access, platform-shared | OPEN |
| BR-014 | Security | Authoritative protected endpoint matrix for **current runtime now** (not future docs). | Mau | Day 2 | all | OPEN |
| BR-015 | API Envelope | Do all endpoints now guarantee `{ success, data, message, errors, meta }`? List exceptions explicitly. | Oscar | Day 3 | inventory-menu-mgmt, staff, kpis, guest-menu, smartorder-ai, orders, tables-tickets | OPEN |
| BR-016 | Pagination | Pagination semantics: default sort field/order, stable ordering guarantee, max-limit enforcement behavior, out-of-range behavior, and exact `meta` schema. | Oscar | Day 3 | inventory-menu-mgmt, staff, kpis, orders, tables-tickets, guest-menu | OPEN |
| BR-017 | WebSocket | Current websocket auth requirement (on/off) and canonical URL contract for orders stream. | Ian | Day 3 | orders | OPEN |
| BR-018 | WebSocket | Full websocket event schema (`ping` and order update variants), reconnect/backfill expectations, and close code semantics. | Ian | Day 4 | orders | OPEN |
| BR-019 | OTP | Exact OTP expiry contract for both verification endpoints: status code, response body, `error_code`, and localization guarantees. | Mau | Day 4 | guest-menu, legacy-orphans | OPEN |
| BR-020 | Tables | Final `get-non-active-tables` method/path + request schema (`restaurant_id`, `location_id`) + response schema + backwards-compat window. | Ian | Day 4 | tables-tickets | OPEN |
| BR-021 | Errors | Confirm uniform error schema by status code and when `errors` is null vs populated. | Oscar | Day 4 | all | OPEN |
| BR-022 | Rollout | Versioning and rollout plan: cutover date, coexistence window, deprecation timeline for old payloads. | Mau | Day 5 | all | OPEN |
| BR-023 | Artifacts | Provide OpenAPI/Swagger or Postman export + sample payloads for menu/orders/tickets/tables/user/ingredients/kpis. | Oscar | Day 5 | all | OPEN |

## Example Clarification Prompt (`/auth/login`)
Use this with backend team to avoid ambiguity:

1. Is `POST /auth/login` currently reachable in production? If yes, which frontend should call it?
2. Please provide a full success response example with all token fields and user fields.
3. Please provide one example each for 400, 401, 403, 409 errors.
4. Is refresh-token flow supported? If yes, endpoint and expiry policy?
5. If auth is on hold, what exact condition will move it to active and who approves it?

## Decision Logging
When a request is answered, append:
- `answered_on`
- `source` (doc link, ticket ID, API spec link)
- `summary`
- `affected_files`
- `next_action_owner`

## Escalation Rule
If any `OPEN` request is past `needed_by_day` and blocks implementation:
- set status to `IN_PROGRESS`
- escalate in `docs/team/TEAM-3P-PLAYBOOK.md`
- mark affected packets as `BLOCKED` (no speculative coding)

