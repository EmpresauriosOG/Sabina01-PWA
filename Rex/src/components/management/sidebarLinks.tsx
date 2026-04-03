import {
  BoxesIcon,
  HandPlatter,
  UserPlus,
  Table,
  PieChartIcon,
  Ticket,
} from "lucide-react";
import { hasRouteAccess } from "@/auth/rolePolicy";

export interface SidebarLink {
  name: string;
  icon: JSX.Element;
  path: string;
}

const sidebarLinks: SidebarLink[] = [
  {
    name: "Staff",
    icon: <UserPlus size={16} strokeWidth={1} />,
    path: "/my-staff",
  },
  {
    name: "Inventario",
    icon: <BoxesIcon size={16} strokeWidth={1} />,
    path: "/inventory",
  },
  {
    name: "Ordenes",
    icon: <HandPlatter size={16} strokeWidth={1} />,
    path: "/orders",
  },
  {
    name: "Mesas",
    icon: <Table size={16} strokeWidth={1} />,
    path: "/tables",
  },
  {
    name: "KPIs",
    icon: <PieChartIcon size={16} strokeWidth={1} />,
    path: "/kpis",
  },
  {
    name: "Tickets",
    icon: <Ticket size={16} strokeWidth={1} />,
    path: "/tickets",
  },
];

export function getFilteredSidebarLinks(userRoles: string[]): SidebarLink[] {
  return sidebarLinks.filter((link) => hasRouteAccess(link.path, userRoles));
}

export default sidebarLinks;
