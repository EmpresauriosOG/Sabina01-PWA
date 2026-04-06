# Frontend Contract Types To Lock

Date: 2026-04-05
Purpose: Define canonical parsing contracts before backend hardening implementation.

## 1) API Envelope

```ts
export type ApiEnvelope<TData, TMeta = unknown> = {
  success: boolean;
  data: TData;
  message: string | null;
  errors: unknown;
  meta: TMeta | null;
};
```

## 2) Pagination Meta

```ts
export type PaginationMeta = {
  total: number;
  skip: number;
  limit: number;
};
```

## 3) API Error Envelope

```ts
export type ApiErrorEnvelope = {
  success: false;
  message: string;
  errors?: unknown;
  meta?: unknown | null;
};
```

## 4) WebSocket Order Message

```ts
export type WsPingMessage = {
  type: "ping";
};

export type WsOrderUpdateMessage<TOrder> = {
  type?: "order_update" | "order" | string;
  order: TOrder;
};

export type WsOrderMessage<TOrder> = WsPingMessage | WsOrderUpdateMessage<TOrder>;
```

## 5) Parser Helpers (spec only)

```ts
export function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.success === "boolean" &&
    "data" in v &&
    "message" in v &&
    "errors" in v &&
    "meta" in v
  );
}

export function isWsPingMessage(value: unknown): value is WsPingMessage {
  return !!value && typeof value === "object" && (value as { type?: string }).type === "ping";
}
```

## 6) Contract Mapping Rules
- If endpoint returns envelope:
  - consume `response.data.data` as payload
  - consume `response.data.meta` as pagination/metadata
- If endpoint returns legacy shape:
  - route through compatibility adapter and mark endpoint as exception in BR-015
- Never parse directly from mixed shapes inside UI components.

## 7) Error Handling Mapping
- `400`: validation/input issue -> inline form or actionable message
- `401`: unauthenticated -> auth strategy-dependent handler (currently on hold)
- `403`: insufficient permissions -> role/permission notice
- `404`: not found -> empty/reload state
- `409`: conflict/duplicate -> targeted UI hint (e.g., duplicate email)
- `503`: backend unavailable -> retry banner/toast + graceful fallback

## 8) Test Matrix For Contracts
1. Envelope parse success and fallback for legacy shape.
2. Pagination meta parse for menu/orders/tickets/staff/ingredients/kpis.
3. Websocket parser ignores ping and handles order updates.
4. OTP expiry parser handles `OTP_EXPIRED` for both verification endpoints.
5. Error parser maps status code to consistent UX behavior.

## 9) Hold Notes
- Auth contract implementation remains blocked until BR-011/BR-012/BR-013 resolution.
- Websocket token query requirement remains blocked until BR-017 resolution.

## 10) Implementation Status (2026-04-05)
- Added shared parser boundary at `src/shared/contracts/api.ts`.
- First migration wave started for:
  - `hooks/tanstack/getMenu.ts`
  - `utils/orderUtils.ts`
  - `utils/ticketUtils.ts`
  - `utils/tablesUtils.ts`
  - `utils/staffUtils.ts`
  - `utils/ingredientUtils.ts`
  - `utils/menuUtils.ts`
  - `hooks/tanstack/getUser.ts`
  - `components/containers/Orders/OrderBoard.tsx` (ping-safe websocket parser)
- Remaining migration items continue in capability lanes; do not bypass shared parser boundary.

