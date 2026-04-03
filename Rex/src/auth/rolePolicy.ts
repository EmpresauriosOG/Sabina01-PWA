import { Roles } from "@/hooks/tanstack/getUser";

/**
 * Single source of truth for route-level role access.
 * Both the route guard and sidebar consume this map.
 *
 * If a path is not listed here, any authenticated user can access it.
 */
export const routeRolePolicy: Record<string, Roles[]> = {
  "/": [Roles.admin, Roles.manager, Roles.staff, Roles.waiter, Roles.kitchen, Roles.hostess],
  "/my-staff": [Roles.admin, Roles.manager],
  "/inventory": [Roles.admin, Roles.manager],
  "/orders": [Roles.admin, Roles.manager],
  "/tables": [Roles.admin, Roles.manager],
  "/kpis": [Roles.admin, Roles.manager],
  "/tickets": [Roles.admin, Roles.manager],
};

export function hasRouteAccess(path: string, userRoles: string[]): boolean {
  const allowedRoles = routeRolePolicy[path];
  if (!allowedRoles) return true;
  return allowedRoles.some((role) => userRoles.includes(role));
}
