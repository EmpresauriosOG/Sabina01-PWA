import { Moon, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const handleToggle = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    return (
        <div className="relative flex items-center space-x-3">
            <Label htmlFor="theme-toggle">
                {theme === "light" ? (
                    <Sun
                        className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-1000 ease-in-out dark:rotate-90 dark:scale-0`}
                    />
                ) : (
                    <Moon
                        className={`h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform duration-500 ease-in-out dark:rotate-0 dark:scale-100`}
                    />
                )}
                <span className="sr-only">Toggle theme</span>
            </Label>
            <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onClick={handleToggle}
            />
        </div>
    );
}
