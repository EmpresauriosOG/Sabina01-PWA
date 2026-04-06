# Frontend System Map

## Purpose
This document is the primary architecture map for the current frontend in `Rex/src`.
It is capability-first (business/use-case boundaries), with directory mapping as a secondary aid.

Baseline captured on April 1, 2026. Last updated April 5, 2026 (packets A1–A4, D1–D5).

## Route Tree And Protection Model

### Runtime Route Tree
- `/` -> `RootLayout` -> `ProtectedRoute` -> `SmartOrder` (primary capability: `smartorder-ai`)
- `/my-staff` -> `RootLayout` -> `ProtectedRoute` -> `Staff` (primary capability: `staff`)
- `/inventory` -> `RootLayout` -> `ProtectedRoute` -> `Inventory` (primary capability: `inventory-menu-mgmt`)
- `/orders` -> `RootLayout` -> `ProtectedRoute` -> `OrderContainer` (primary capability: `orders`)
- `/tables` -> `RootLayout` -> `ProtectedRoute` -> `RestaurantTablesContainer` (primary capability: `tables-tickets`)
- `/kpis` -> `RootLayout` -> `ProtectedRoute` -> `Kpis` (primary capability: `kpis`)
- `/tickets` -> `RootLayout` -> `ProtectedRoute` -> `Tickets` (primary capability: `tables-tickets`)
- `/login` -> `Login` (primary capability: `auth-access`)
- `/signup` -> `SignUp` (primary capability: `auth-access`)
- `/menu/:restaurantId/:locationId` -> `Menu` (primary capability: `guest-menu`)
- `/otp` -> `OTPTable` (primary capability: `legacy-orphans`)
- `/open-menu` -> `SmartOrder` (primary capability: `smartorder-ai`)

> **A4.1:** `/sidebar` route removed — was rendering Sidebar twice (already mounted in RootLayout).

### Protection Model
- `ProtectedRoute` is the gate for all app-internal routes under `/`.
- Auth provider: **Clerk only** (Kinde and Supabase removed — A1.3). Role hydration from backend via `fetchUser(email)` → Zustand sessionStorage.
- Role-based route access: `src/auth/rolePolicy.ts` is the single source of truth. `ProtectedRoute` calls `hasRouteAccess(pathname, roles)` — unauthorized users are redirected to `/login`.
- Sidebar visibility uses the same `rolePolicy.ts` via `getFilteredSidebarLinks(roles)`.
- `src/components/ui/loading.tsx` provides `PageLoader` (full-screen) and `SectionLoader` (inline) — used in all protected route loading states.
- Login/signup routes are outside `ProtectedRoute`.
- Guest menu route is public.

## Capability To Directory Map

| Capability | Primary Directories | Secondary Directories |
|---|---|---|
| auth-access | `src/auth` (incl. `rolePolicy.ts`), `src/routes/ProtectedRoute.tsx`, `src/hooks/tanstack/getUser.ts` | `src/shared/state/userState.ts`, `src/components/management/sidebar`, `src/components/ui/loading.tsx` |
| smartorder-ai | `src/components/containers/SmartOrder`, `src/components/containers/AdminDashboard.tsx`, `src/components/smartOrders` (incl. `types.ts`) | `src/hooks/tanstack/useChat.ts`, `src/hooks/tanstack/fetchChat.ts`, `src/utils/orderUtils.ts`, `src/hooks/tanstack/getMenu.ts` |
| guest-menu | `src/components/Menu.tsx`, `src/components/menu/` (MenuItemCard, MenuItemGrid, MenuCart, MenuChatBot), `src/components/menu/OTPTable.tsx` | `src/hooks/tanstack/getMenu.ts` |
| staff | `src/components/containers/Staff.tsx`, `src/components/forms/StaffForm.tsx`, `src/components/tables/Staff` | `src/hooks/tanstack/getStaff.ts`, `src/utils/staffUtils.ts` |
| inventory-menu-mgmt | `src/components/containers/Inventory`, `src/components/modals/DishesModal.tsx`, `src/components/tables/Ingredients`, `src/components/tables/Dishes` | `src/hooks/tanstack/useIngredient.ts`, `src/hooks/tanstack/getMenu.ts`, `src/utils/ingredientUtils.ts`, `src/utils/menuUtils.ts` |
| orders | `src/components/containers/Orders`, `src/components/orders` | `src/hooks/tanstack/queryOrders.ts`, `src/utils/orderUtils.ts` |
| tables-tickets | `src/components/containers/RestaurantTables`, `src/components/containers/Tickets` | `src/hooks/tanstack/queryTables.ts`, `src/hooks/tanstack/useTickets.ts`, `src/utils/tablesUtils.ts`, `src/utils/ticketUtils.ts` |
| kpis | `src/components/containers/Kpis`, `src/components/cards`, `src/components/charts` | KPI hooks under `src/hooks/tanstack/get*.ts` |
| platform-shared | `src/main.tsx`, `src/RootLayout.tsx`, `src/components/ui`, `src/components/theme-provider.tsx` | `src/components/forms/FormFields`, shared table primitives |
| legacy-orphans | `src/context/AuthContext.tsx`, `src/components/forms/Form.tsx`, `src/components/management/Tables.tsx`, `src/utils/tableUtils.ts`, `src/shared/constants.ts` | old or partial experiments |

## Data Flow Layers

### Layer 1: UI And Container Composition
- Page-level containers and route elements orchestrate capability flows.
- Most container logic currently mixes UI state + business flow + transport call coordination.

### Layer 2: Query And State Hooks
- TanStack hooks in `src/hooks/tanstack` provide query/mutation wrappers.
- Zustand stores in `src/shared/state` hold user session and form submission flags.

### Layer 3: Transport Functions
- `src/utils/*.ts` performs direct axios calls to backend endpoints.
- Endpoint host values are mostly inlined per file and per function.

### Layer 4: External Services
- Auth: **Clerk only** (Kinde uninstalled, Supabase AuthContext deleted — A1.3).
- Backend APIs: `https://sabina01.onrender.com/*` — still hardcoded across 30+ files (TODO: move to `VITE_API_BASE_URL`).
- AI/chat: `https://aiapi-production-fbc0.up.railway.app/*` — transport owned by `src/hooks/tanstack/useChat.ts` + `fetchChat.ts`.
- Realtime: orders websocket `wss://sabina01.onrender.com/ws/orders/...`.

## Active Vs Legacy Orphan Modules

### Active Core Modules
- `src/main.tsx` route setup and providers
- `src/routes/ProtectedRoute.tsx`
- `src/components/containers/*` for staff, inventory, orders, tables, kpis, smart order
- `src/hooks/tanstack/*` and `src/utils/*` except legacy-only files listed below

### Legacy Orphans Or Transitional Modules
- ~~`src/context/AuthContext.tsx`~~ — **deleted A1.3** (Supabase auth path)
- ~~`src/components/forms/Form.tsx`~~ — **deleted A1.3** (legacy login form)
- `src/components/management/Tables.tsx` (static demo table UI, not routed)
- `src/components/containers/Restaurants.tsx` (commented out)
- `src/utils/tableUtils.ts` (duplicate table fetch shape, unused)
- `src/shared/constants.ts` (large static data, no active imports found)

## Top Volatility Zones
- ~~Auth stack drift~~ — **resolved A1–A2**: Clerk-only, role policy centralized in `rolePolicy.ts`.
- ~~Menu and smart-order overlap~~ — **resolved D1–D5**: `Menu.tsx` decomposed, smart-order boundaries separated, chat adapter extracted.
- Tables and tickets coupling: table lifecycle and ticket lifecycle are tightly coupled, with duplicated transport surfaces (Ian's lane).
- Hardcoded tenancy identifiers: `restaurantId`/`locationId` remain in `AdminDashboard.tsx` and `ShoppingCardModal.tsx` (TODO [D4]). API base URL hardcoded in 30+ files (separate task).

## System-Level Action Priorities
- ~~P0: normalize auth boundary and identity source of truth~~ — **done (A1–A4)**
- ~~P1: split monolithic menu and modal flows into capability-scoped modules~~ — **done (D1–D5)**
- P0: move `https://sabina01.onrender.com` to `VITE_API_BASE_URL` env var (30+ hardcoded call sites).
- P0: replace hardcoded `restaurantId`/`locationId`/`ticket_id` with runtime context from `useUserStore().user` (D4 open items).
- P1: consolidate duplicate table APIs and align ticket lifecycle events (Ian's lane).
- P2: archive or delete remaining legacy orphans (`Tables.tsx`, `Restaurants.tsx`, `tableUtils.ts`, `constants.ts`).
