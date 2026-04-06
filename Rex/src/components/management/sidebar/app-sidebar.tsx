"use client";

import * as React from "react";
import { Link, useLocation } from "react-router-dom";

import { NavMain } from "@/components/management/sidebar/nav-main";
import { NavProjects } from "@/components/management/sidebar/nav-projects";
import { NavSecondary } from "@/components/management/sidebar/nav-secondary";
import { NavUser } from "@/components/management/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { useUserStore } from "@/shared/state/userState";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CommandIcon,
  Home01Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons";
import { useClerk } from "@clerk/clerk-react";

import { sidebarRouteItems } from "./config";
import type { SidebarActionItem, SidebarUser } from "./types";
import { getUserDisplayName, getUserInitials, isRouteActive } from "./utils";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { signOut } = useClerk();
  // TODO [TESTING]: To see all sidebar items without a real session, hardcode the role here:
  //   const roles = [Roles.admin];   ← "admin" has access to every route in config.tsx
  // Available roles: admin | manager | staff | waiter | kitchen | hostess
  // "admin" is the only role that currently sees the full sidebar.
  const roles = React.useMemo(() => user?.roles ?? [], [user?.roles]);

  const mainItems = React.useMemo(
    () =>
      sidebarRouteItems
        .filter(
          (item) =>
            item.group === "main" &&
            item.roles.some((role) => roles.includes(role)),
        )
        .map(({ title, url, icon }) => ({ title, url, icon })),
    [roles],
  );

  const quickAccessItems = React.useMemo(
    () =>
      sidebarRouteItems
        .filter(
          (item) =>
            item.group === "secondary" &&
            item.roles.some((role) => roles.includes(role)),
        )
        .map(({ title, url, icon }) => ({ title, url, icon })),
    [roles],
  );

  const secondaryItems = React.useMemo<SidebarActionItem[]>(
    () => [
      {
        title: "Tema",
        icon: <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} />,
        render: () => (
          <div className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-sidebar-foreground">
            <span className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Moon02Icon}
                strokeWidth={2}
                className="size-4"
              />
              <span>Tema</span>
            </span>
            <ModeToggle />
          </div>
        ),
      },
    ],
    [],
  );

  const currentPath = location.pathname;
  const homeIsActive = isRouteActive(currentPath, "/");
  const userName = getUserDisplayName(user);
  const userEmail = user?.email ?? "Sin sesion";
  const userInitials = getUserInitials(user) || "SB";
  const sidebarUser: SidebarUser = {
    name: userName,
    email: userEmail,
  };

  const handleSignOut = React.useCallback(() => {
    setUser(null);
    void signOut({ redirectUrl: "/" });
  }, [setUser, signOut]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild isActive={homeIsActive}>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon
                    icon={CommandIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Restaurante</span>
                  <span className="truncate text-xs">Operacion</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={homeIsActive} tooltip="Inicio">
              <Link to="/">
                <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />
                <span>Inicio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <NavMain items={mainItems} currentPath={currentPath} />
        <NavProjects items={quickAccessItems} currentPath={currentPath} />
        <NavSecondary items={secondaryItems} className="mt-auto" />
      </SidebarContent>
      {user ? (
        <SidebarFooter>
          <NavUser
            user={sidebarUser}
            initials={userInitials}
            onSignOut={handleSignOut}
          />
        </SidebarFooter>
      ) : null}
    </Sidebar>
  );
}
