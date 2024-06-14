import { Link, Outlet } from "react-router-dom";
import { HandPlatter, Menu, ChefHat } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <div>
            <header className="w-full sticky top-0 backdrop-blur-lg flex h-16 items-center justify-between gap-4 border-b px-4 md:px-6">
                <nav className="hidden flex-col gap-8 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        to="#"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <ChefHat className="h-6 w-" />
                        <span className="sr-only">Restaurant</span>
                    </Link>
                    <Link
                        to="#"
                        className="text-foreground transition-colors hover:text-foreground"
                    >
                        Menu
                    </Link>
                    <Link
                        to="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Locations
                    </Link>
                    <Link
                        to="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Contact
                    </Link>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">
                                Toggle navigation menu
                            </span>
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="top">
                        <nav className="grid gap-6 text-lg font-medium p-2">
                            <SheetClose asChild>
                                <Link
                                    to="#"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                >
                                    <ChefHat className="h-6 w-6" />
                                    <span className="sr-only">Acme Inc</span>
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link to="#" className="hover:text-foreground">
                                    Menus
                                </Link>
                            </SheetClose>
                            <Link
                                to="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Locations
                            </Link>
                            <Link
                                to="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Contact
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full"
                            >
                                <HandPlatter className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle user menu
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Order</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Checkout</DropdownMenuItem>
                            <DropdownMenuItem>Empty order</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <Outlet />
        </div>
    );
}
