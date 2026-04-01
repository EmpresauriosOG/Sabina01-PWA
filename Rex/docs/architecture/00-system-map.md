# Frontend System Map

## Purpose
This document is the primary architecture map for the current frontend in `Rex/src`.
It is capability-first (business/use-case boundaries), with directory mapping as a secondary aid.

Baseline captured on April 1, 2026.

## Route Tree And Protection Model

### Runtime Route Tree
- `/` -> `RootLayout` -> `ProtectedRoute` -> `SmartOrder` (primary capability: `smartorder-ai`)
- `/sidebar` -> `RootLayout` -> `ProtectedRoute` -> `Sidebar` (primary capability: `platform-shared`)
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

### Protection Model
- `ProtectedRoute` is the gate for all app-internal routes under `/`.
- Auth runtime currently mixes Clerk session checks with backend user fetch + local persisted user store.
- Login/signup routes are outside `ProtectedRoute`.
- Guest menu route is public.

## Capability To Directory Map

| Capability | Primary Directories | Secondary Directories |
|---|---|---|
| auth-access | `src/auth`, `src/routes/ProtectedRoute.tsx`, `src/hooks/tanstack/getUser.ts` | `src/shared/state/userState.ts`, `src/components/management/Sidebar` |
| smartorder-ai | `src/components/containers/SmartOrder`, `src/components/containers/AdminDashboard.tsx`, `src/components/smartOrders` | `src/hooks/tanstack/fetchChat.ts`, `src/utils/orderUtils.ts`, `src/hooks/tanstack/getMenu.ts` |
| guest-menu | `src/components/Menu.tsx`, `src/components/menu/OTPTable.tsx` | `src/hooks/tanstack/getMenu.ts` |
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
- Auth: Clerk (active), Kinde (signup path), Supabase (legacy context still present).
- Backend APIs: `https://sabina01.onrender.com/*`.
- AI/chat: `https://aiapi-production-fbc0.up.railway.app/*` and one invalid inline URL in `Menu.tsx`.
- Realtime: orders websocket `wss://sabina01.onrender.com/ws/orders/...`.

## Active Vs Legacy Orphan Modules

### Active Core Modules
- `src/main.tsx` route setup and providers
- `src/routes/ProtectedRoute.tsx`
- `src/components/containers/*` for staff, inventory, orders, tables, kpis, smart order
- `src/hooks/tanstack/*` and `src/utils/*` except legacy-only files listed below

### Legacy Orphans Or Transitional Modules
- `src/context/AuthContext.tsx` (Supabase auth path no longer wired into app providers)
- `src/components/forms/Form.tsx` (legacy login form tied to old auth context)
- `src/components/management/Tables.tsx` (static demo table UI, not routed)
- `src/components/containers/Restaurants.tsx` (commented out)
- `src/utils/tableUtils.ts` (duplicate table fetch shape, unused)
- `src/shared/constants.ts` (large static data, no active imports found)

## Top Volatility Zones
- Auth stack drift: Clerk, Kinde, and Supabase all coexist in current source.
- Menu and smart-order overlap: `Menu.tsx` and `AdminDashboard` duplicate shopping/chat patterns.
- Tables and tickets coupling: table lifecycle and ticket lifecycle are tightly coupled, with duplicated transport surfaces.
- Hardcoded tenancy identifiers and endpoint values across multiple capabilities.

## System-Level Action Priorities
- P0: normalize auth boundary and identity source of truth.
- P0: remove hardcoded IDs, host strings, and credentials from UI/client code.
- P1: split monolithic menu and modal flows into capability-scoped modules.
- P1: consolidate duplicate table APIs and align ticket lifecycle events.
- P2: archive or quarantine legacy/orphan modules behind explicit decisions.
