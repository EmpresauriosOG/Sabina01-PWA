import { Link, Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/management/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSidebarPageTitle } from "@/components/management/sidebar/config";

function RootLayout() {
  const location = useLocation();
  const pageTitle = getSidebarPageTitle(location.pathname);

  return (
    <>
      <TooltipProvider>
        <SidebarProvider className="h-svh overflow-hidden">
          <AppSidebar />
          <SidebarInset className="min-h-0 overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink asChild>
                        <Link to="/">Restaurante</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="min-h-0 flex-1 p-2 pt-0 md:p-3 md:pt-0">
              <div className="relative isolate flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-background">
                <div className="flex min-h-0 flex-1 flex-col overflow-auto">
                  <div className="flex min-h-full flex-1 flex-col px-4 pb-5 pt-3 md:px-6 md:pb-6 md:pt-4">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster />
      <SonnerToaster position="top-right" richColors />
    </>
  );
}

export default RootLayout;
