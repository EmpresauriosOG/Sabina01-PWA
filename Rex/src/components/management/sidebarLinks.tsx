// sidebarLinks.tsx
import {
  ShoppingBasket,
  ChefHat,
  Utensils,
  HandPlatter,
  UserPlus,
} from "lucide-react"; // Import icons if using a library

export interface SidebarLink {
  name: string;
  icon: JSX.Element;
  link: string;
  roles: ("admin" | "waiter" | "chef" | "manager" | "default")[];
}

const sidebarLinks: SidebarLink[] = [
  {
    name: "Staff",
    icon: <UserPlus size={16} strokeWidth={1} />,
    link: "my-staff",
    roles: ["admin", "manager"],
  },
  {
    name: "Tables",
    icon: <Utensils size={16} strokeWidth={1} />,
    link: "tables",
    roles: ["admin"],
  },
  {
    name: "Orders",
    icon: <HandPlatter size={16} strokeWidth={1} />,
    link: "orders",
    roles: ["admin"],
  },
  {
    name: "Recipes",
    icon: <ChefHat size={16} strokeWidth={1} />,
    link: "recipes",
    roles: ["admin"],
  },
  {
    name: "Inventory",
    icon: <ShoppingBasket size={16} strokeWidth={1} />,
    link: "inventory",
    roles: ["admin"],
  },
  // Add more links as needed
];

export default sidebarLinks;
