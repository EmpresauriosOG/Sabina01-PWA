import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { SidebarActionItem } from "./types";

export function NavSecondary({
  items,
  ...props
}: {
  items: SidebarActionItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  if (!items.length) {
    return null;
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.render ? (
                item.render()
              ) : (
                <SidebarMenuButton size="sm">
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
