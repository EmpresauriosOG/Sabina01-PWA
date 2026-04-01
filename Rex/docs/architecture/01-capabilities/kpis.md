# Capability: KPIs And Reporting

## Capability Goal And Business Outcomes
- Provide operational and sales insight dashboards for decision making.
- Aggregate backend KPI endpoints into visual cards and charts.
- Keep KPI modules reusable across tenant contexts and date filters.

## Entry Points

### Routes
- `/kpis`

### Pages And Components
- `src/components/containers/Kpis/Kpis.tsx`
- `src/components/cards/*`
- `src/components/charts/*`

## Current Functions Hooks Utils Used

### Read Paths
- `useAverageOrderTimes(restaurant_id)` from `getAverageOrderTime.ts`
- `useAverageTicket(restaurant_id)` from `getAverageTicket.ts`
- `useHighestSelling(restaurant_id)` from `getHighestSelling.ts`
- `useBusiestHours(restaurant_id)` from `getBusiestHours.ts`
- `useItems(restaurant_id)` from `getItems.ts`
- `useItemSales(restaurant_id, location_id)` from `getItemSales.ts`
- `useSales(restaurant_id, location_id)` from `getSales.ts`
- `useOrderStatus(restaurant_id)` from `getOrderStatus.ts`
- `STATUS_MAPPING` from `getOrderStatus.ts`

### Write Paths
- None (read-only analytics capability)

### Realtime Paths
- None (request-response only)

## Dependency Graph
- Upstream: Auth-access user context for restaurant/location IDs.
- Internal dependencies: card containers, chart containers, chart primitives.
- Downstream: management decisions, operational monitoring.
- External services:
  - KPI endpoints under `sabina01.onrender.com/kpis/*`

## Volatility Map

### Temporal Volatility
- Metric definitions and aggregation windows can change.
- Chart requirements and dimensional filters (daily, weekly, location) likely evolve.

### Spatial Volatility
- Tenant-specific KPI definitions can differ by business model.
- Some customers may request custom chart bundles and role-specific dashboards.

## Duplication And Coupling Hotspots
- One-hook-per-endpoint pattern duplicates request options and host strings.
- Limited normalization layer between API response shapes and chart component needs.

## Refactor Target Architecture
- Introduce `kpi-service` module with normalized query adapters.
- Create shared chart view-model contracts to decouple charts from raw API shape.
- Keep KPI screen composition declarative (metric cards + chart blocks from config).

## Estimate (days)
- Optimistic: 3
- Likely: 4
- Pessimistic: 6

## Agent Ready Task Slices
1. Centralize KPI endpoint host and request wrapper.
2. Add response normalization mappers for each KPI family.
3. Replace duplicated hook boilerplate with shared query factory.
4. Add smoke tests for each KPI container with mocked API payloads.

## Acceptance Criteria
- KPI hooks share one transport strategy and host configuration.
- Chart components consume stable normalized data contracts.
- KPI screen remains readable and modular when adding new metrics.
- No KPI endpoint host is hardcoded in multiple files.
