"use client";

import { Link } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { SidebarNavItem } from "./types";
import { isRouteActive } from "./utils";

export function NavProjects({
  items,
  currentPath,
  title = "Accesos rapidos",
}: {
  items: SidebarNavItem[];
  currentPath: string;
  title?: string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={`${item.title}-${item.url}`}>
            <SidebarMenuButton
              asChild
              isActive={isRouteActive(currentPath, item.url)}
            >
              <Link to={item.url}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
