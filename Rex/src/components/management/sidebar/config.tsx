import type * as React from "react";
import {
  BoxesIcon,
  HandPlatter,
  PieChartIcon,
  Table,
  Ticket,
  UserPlus,
} from "lucide-react";

type SidebarRole = "admin" | "waiter" | "chef" | "manager" | "default";

export type SidebarRouteItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  roles: SidebarRole[];
  group: "main" | "secondary";
};

export const sidebarRouteItems: SidebarRouteItem[] = [
  {
    title: "Staff",
    url: "/my-staff",
    icon: <UserPlus size={16} strokeWidth={1.75} />,
    roles: ["admin", "manager"],
    group: "main",
  },
  {
    title: "Inventario",
    url: "/inventory",
    icon: <BoxesIcon size={16} strokeWidth={1.75} />,
    roles: ["admin", "manager"],
    group: "main",
  },
  {
    title: "Orders",
    url: "/orders",
    icon: <HandPlatter size={16} strokeWidth={1.75} />,
    roles: ["admin", "manager"],
    group: "main",
  },
  {
    title: "Tables",
    url: "/tables",
    icon: <Table size={16} strokeWidth={1.75} />,
    roles: ["admin", "manager"],
    group: "main",
  },
  {
    title: "Kpis",
    url: "/kpis",
    icon: <PieChartIcon size={16} strokeWidth={1.75} />,
    roles: ["admin", "manager"],
    group: "secondary",
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: <Ticket size={16} strokeWidth={1.75} />,
    roles: ["admin", "manager"],
    group: "secondary",
  },
];

export function getSidebarPageTitle(pathname: string) {
  const currentItem = sidebarRouteItems.find(
    (item) => pathname === item.url || pathname.startsWith(`${item.url}/`),
  );

  return currentItem?.title ?? "Inicio";
}
