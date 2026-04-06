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

export function NavMain({
  items,
  currentPath,
}: {
  items: SidebarNavItem[];
  currentPath: string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navegacion</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={`${item.title}-${item.url}`}>
            <SidebarMenuButton
              asChild
              isActive={isRouteActive(currentPath, item.url)}
              tooltip={item.title}
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
