# Backend Hardening Delta

Date captured: 2026-04-05
Source: Backend team migration guide (breaking changes + hold notes)
Purpose: Convert backend migration notes into frontend action tags and track contract-first runtime adoption safely.

Tag definitions:
- `HOLD`: blocked by strategy decision, do not implement yet.
- `READY`: can be planned/implemented once questions are answered.
- `CONFLICT`: backend note conflicts with current frontend direction or other note.
- `DONE`: already implemented in frontend.

## 0) Global Status Snapshot
- Auth migration to custom JWT is currently **on hold** by backend.
- Backend temporarily restored old behavior (`GET /login/get_user_info/{email}` and open protected endpoints).
- Frontend currently standardized on Clerk flow (see `00-system-map.md` updates).
- Contract-first compatibility parsing is now in progress in frontend runtime code.

Status tag: `HOLD`
Owner: Mau
Blocking requests: BR-011, BR-012, BR-013

## 1) Authentication Changes
### Backend note
- `/auth/login` and `/auth/register` exist but are dormant.
- JWT-protected endpoint model documented but not currently active.

### Frontend integration decision
- Keep Clerk auth active and unchanged until backend/frontend decision is signed.
- Do not implement JWT storage or auth header logic yet.

Status tag: `HOLD`
Owner: Mau
Related capabilities: auth-access, platform-shared, smartorder-ai, guest-menu

## 2) Standardized Response Wrapper
### Backend note
Responses should follow:
`{ success, data, message, errors, meta }`

### Frontend impact
- Current frontend axios parsers mostly expect direct payloads (`response.data.*`).
- Adoption requires shared parsing adapter and per-capability migration.

Status tag: `DONE`
Owner: Oscar (primary), Mau (guest/smartorder), Ian (orders/tables/tickets)
Related capabilities: all data-fetching capabilities

## 3) Pagination (`skip`, `limit`) on list endpoints
### Backend note
Menu/orders/ingredients/users/purchases/tickets list endpoints now support pagination and return `meta`.

### Frontend impact
- Tables and data-grid pages need pagination contract alignment.
- KPI and query hooks need clarity on defaults and sorting semantics.

Status tag: `READY`
Owner: Oscar (primary), Ian (orders/tickets)
Related capabilities: inventory-menu-mgmt, staff, kpis, orders, tables-tickets, guest-menu

## 4) WebSocket Contract Changes
### Backend note
- JWT token query parameter requirement described.
- Ping heartbeat every 30s (`{ "type": "ping" }`).
- Rejection on invalid token (1008).

### Frontend impact
- Auth-on-hold conflicts with token requirement statement.
- Ping handling can be prepared now in parser layer.

Status tag: `READY`
Owner: Ian
Related capabilities: orders
Conflict reason: backend also states websocket auth is removed for now.

## 5) OTP Expiry (4h)
### Backend note
- Expired OTP returns explicit error body/code depending on endpoint.

### Frontend impact
- OTP UX must branch on `OTP_EXPIRED` and guide user to rescan/request waiter.

Status tag: `READY`
Owner: Mau (guest-menu/OTP UX)
Related capabilities: legacy-orphans, guest-menu

## 6) `get-non-active-tables` Contract Change
### Backend note
- Response changed from number list to object list.
- Request body renamed (`restaurant_id`, `location_id`).

### Frontend impact
- Any consumer must update request and response parser.
- Need final endpoint/method confirmation from backend.

Status tag: `READY`
Owner: Ian
Related capabilities: tables-tickets

## 7) Error Model Standardization
### Backend note
- Unified error format and status code meanings.

### Frontend impact
- Centralized error parser needed before lane-level migrations.
- UI must distinguish `400/401/403/404/409/503` in user-friendly messaging.

Status tag: `READY`
Owner: Oscar (shared adapter), Mau/Ian (capability handling)
Related capabilities: all

## 8) New Endpoints (`/auth/login`, `/auth/register`, `/health`)
### Frontend impact
- `/health` can be used for deployment smoke checks.
- `/auth/*` remains dormant until auth strategy decision.

Status tag: `HOLD`
Owner: Mau
Related capabilities: auth-access, platform-shared

## 9) Removed Endpoints
### Backend note
- None final; `GET /login/get_user_info/{email}` restored.

Status tag: `DONE`
Owner: Mau
Related capabilities: auth-access

## 10) Integration Direction For This Sprint
- Contract-first parser migration is active for envelope compatibility.
- No runtime migration to custom JWT.
- Endpoint-specific assumptions remain tied to BR answers and compatibility mode.

Status tag: `READY`
Owners by lane:
- Mau: auth hold policy + guest/smartorder envelope plan
- Ian: websocket and orders/tables/tickets contracts
- Oscar: wrapper/pagination/error adapter contracts

