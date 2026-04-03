import { cn } from "@/lib/utils";

/**
 * Full-page loading screen — used during auth hydration and initial app load.
 */
export function PageLoader({ message = "Cargando" }: { message?: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * Inline section loader — used inside data-fetching containers.
 */
export function SectionLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center py-12",
        className
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-muted border-t-primary" />
    </div>
  );
}
