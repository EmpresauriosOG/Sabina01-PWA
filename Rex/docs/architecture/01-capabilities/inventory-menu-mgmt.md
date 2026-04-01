# Capability: Inventory And Menu Management

## Capability Goal And Business Outcomes
- Manage ingredients and dishes for each restaurant location.
- Keep ingredient stock and menu item definitions editable by authorized users.
- Support fast create/update/delete workflows from tabular management UI.

## Entry Points

### Routes
- `/inventory`

### Pages And Components
- `src/components/containers/Inventory/Inventory.tsx`
- `src/components/containers/Inventory/Ingredients.tsx`
- `src/components/containers/Inventory/Dishes.tsx`
- `src/components/forms/IngredientForm.tsx`
- `src/components/modals/IngredientModal.tsx`
- `src/components/modals/DishesModal.tsx`
- `src/components/tables/Ingredients/*`
- `src/components/tables/Dishes/*`

## Current Functions Hooks Utils Used

### Read Paths
- `useIngredient(restaurant_id, location_id)` from `src/hooks/tanstack/useIngredient.ts`
- `useMenu(restaurantId, locationId)` from `src/hooks/tanstack/getMenu.ts`
- `fetchIngredients(...)` from `src/utils/ingredientUtils.ts`
- `fetchMenuItems(...)` from `src/utils/menuUtils.ts`

### Write Paths
- Ingredient:
  - `submitIngredient(data)`
  - `updateIngredient(data)`
  - `deleteIngredient(id)`
- Menu:
  - `submitMenuItem(data)`
  - `updateMenuItem(data)`
  - `deleteMenuItem(id)`
  - `updateDish(dish)` (overlapping mutation purpose)
- Submission refresh flags:
  - `setIngredientFormSubmitted`
  - `setDishFormSubmitted`

### Realtime Paths
- None

## Dependency Graph
- Upstream: Auth-access tenant context and role gating.
- Internal dependencies: shared form primitives, modal wrappers, data table abstractions.
- Downstream: Guest menu and smart-order read these menu definitions.
- External services:
  - Ingredients endpoints
  - Menu endpoints

## Volatility Map

### Temporal Volatility
- Dish schema will likely expand (tags, allergens, availability windows, variants).
- Ingredient policy and stock tracking rules may evolve.
- Image upload and content moderation needs may be added.

### Spatial Volatility
- Menu taxonomy and units differ by customer cuisine and operating model.
- Some tenants need custom fields and approval workflows before publishing menu changes.

## Duplication And Coupling Hotspots
- Very large `DishesModal.tsx` mixes upload, filtering, form composition, edit mode, and submission orchestration.
- Overlapping menu update functions (`updateMenuItem`, `updateDish`) increase ambiguity.
- Boolean form submission flags couple unrelated inventory flows.

## Refactor Target Architecture
- Split management into two subdomains:
  - `inventory-domain` (ingredients)
  - `menu-domain` (dishes and metadata)
- Introduce typed command handlers for create/update/delete with one canonical endpoint mapping.
- Move image handling to dedicated utility or service adapter.
- Replace global submission booleans with mutation success callbacks and query invalidation.

## Estimate (days)
- Optimistic: 5
- Likely: 7
- Pessimistic: 10

## Agent Ready Task Slices
1. Decompose `DishesModal` into focused form sections and service actions.
2. Unify menu mutation surface and remove overlapping update paths.
3. Move ingredient and dish refresh logic to query invalidation patterns.
4. Add validation + regression tests for ingredient and dish CRUD.

## Acceptance Criteria
- Ingredient and menu CRUD are isolated into clearly named service functions.
- No global boolean submission flags are required to refresh data.
- Dish modal complexity is reduced into reusable subcomponents with explicit responsibilities.
- Inventory route remains functional for create/update/delete across both tabs.
