import type { User } from "@/hooks/tanstack/getUser";

export function getUserDisplayName(user: User | null) {
  if (!user) {
    return "Invitado";
  }

  return [user.first_name, user.last_name].filter(Boolean).join(" ");
}

export function getUserInitials(user: User | null) {
  const value = getUserDisplayName(user);

  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function isRouteActive(currentPath: string, itemPath: string) {
  if (itemPath === "/") {
    return currentPath === "/";
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}
