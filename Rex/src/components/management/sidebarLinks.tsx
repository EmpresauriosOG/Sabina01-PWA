// sidebarLinks.tsx
import {
    BarChart,
    ShoppingBasket,
    ChefHat,
    Utensils,
    HandPlatter,
} from "lucide-react"; // Import icons if using a library

export interface SidebarLink {
    name: string;
    icon: JSX.Element;
    link: string;
}

const sidebarLinks: SidebarLink[] = [
    {
        name: "Dashboard",
        icon: <BarChart size={16} strokeWidth={1} />,
        link: "dashboard",
    },
    {
        name: "Tables",
        icon: <Utensils size={16} strokeWidth={1} />,
        link: "tables",
    },
    {
        name: "Orders",
        icon: <HandPlatter size={16} strokeWidth={1} />,
        link: "orders",
    },
    {
        name: "Recipes",
        icon: <ChefHat size={16} strokeWidth={1} />,
        link: "recipes",
    },
    {
        name: "Inventory",
        icon: <ShoppingBasket size={16} strokeWidth={1} />,
        link: "inventory",
    },
    // Add more links as needed
];

export default sidebarLinks;
